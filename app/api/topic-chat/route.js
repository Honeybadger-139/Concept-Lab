import { NextResponse } from "next/server";
import { flushLangfuse, getLangfuseClient } from "@/lib/langfuse";
import { getSessionUserEmail } from "@/lib/sessionUser";
import {
  MIN_MATCH_SCORE,
  buildKnowledge,
  buildTopicVocabulary,
  classifyScope,
  createOutOfScopeReply,
  deterministicTopicAnswer,
  retrieveEvidence,
} from "@/data/topicChatUtils";

export const runtime = "nodejs";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OLLAMA_CHAT_PATH = "/api/chat";
const DEFAULT_PROVIDER = (process.env.TOPIC_CHAT_PROVIDER || "auto").toLowerCase();
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL =
  process.env.TOPIC_CHAT_OLLAMA_MODEL ||
  process.env.TOPIC_CHAT_MODEL ||
  "llama3.2";
const OPENAI_MODEL =
  process.env.TOPIC_CHAT_OPENAI_MODEL ||
  process.env.TOPIC_CHAT_MODEL ||
  "gpt-4o-mini";

function envPositiveInt(name, fallback) {
  const value = Number.parseInt(process.env[name] || "", 10);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

const LLM_TIMEOUT_MS = envPositiveInt("TOPIC_CHAT_TIMEOUT_MS", 12000);
const TOPIC_CHAT_MAX_TOKENS = envPositiveInt("TOPIC_CHAT_MAX_TOKENS", 220);

function normalizedProvider(providerRaw) {
  const provider = String(providerRaw || DEFAULT_PROVIDER).toLowerCase();
  if (["ollama", "openai", "auto"].includes(provider)) return provider;
  return "auto";
}

function providerOrder(provider) {
  if (provider === "ollama") return ["ollama"];
  if (provider === "openai") return ["openai"];
  return ["ollama", "openai"];
}

function withTimeout(signalTimeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), signalTimeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function clip(text, max = 1200) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function normalizeTopic(rawTopic = {}) {
  return {
    sectionId: clip(rawTopic.sectionId || "", 40),
    sectionTitle: clip(rawTopic.sectionTitle || "", 80),
    slug: clip(rawTopic.slug || "", 140),
    title: clip(rawTopic.title || "", 140),
    excerpt: clip(rawTopic.excerpt || "", 600),
    theoryHtml: clip(rawTopic.theoryHtml || "", 12000),
    example: clip(rawTopic.example || "", 2500),
    interviewPrep: rawTopic.interviewPrep || null,
    flashCards: Array.isArray(rawTopic.flashCards) ? rawTopic.flashCards.slice(0, 24) : [],
  };
}

function toEvidencePayload(evidence) {
  return evidence.map((item, index) => ({
    id: `E${index + 1}`,
    source: item.source,
    text: item.text,
    score: Number(item.score.toFixed(4)),
  }));
}

function appendEvidenceFooterIfMissing(answer, evidencePayload) {
  const hasCitation = /\[E\d+\]/.test(answer);
  if (hasCitation || evidencePayload.length === 0) return answer;
  const refs = evidencePayload.map((item) => `[${item.id}]`).join(", ");
  return `${answer.trim()}\n\nEvidence: ${refs}`;
}

function buildPromptMessages(topic, question, evidencePayload) {
  const evidenceText = evidencePayload
    .map((item) => `[${item.id}] ${item.source}: ${item.text}`)
    .join("\n");

  const systemPrompt = [
    "You are a strict topic-scoped tutor.",
    "Answer ONLY from the provided evidence snippets.",
    "If evidence is insufficient, refuse politely and ask for a narrower in-topic question.",
    "Do not use outside knowledge.",
    "Cite evidence references as [E1], [E2], etc.",
  ].join(" ");

  const userPrompt = [
    `Topic section: ${topic.sectionTitle}`,
    `Topic title: ${topic.title}`,
    `User question: ${question}`,
    "Evidence:",
    evidenceText,
    "Return a concise, beginner-friendly answer grounded strictly in evidence.",
  ].join("\n\n");

  return {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    llmInput: userPrompt,
  };
}

function createLangfuseTrace({ userId, question, topic }) {
  const langfuse = getLangfuseClient();
  if (!langfuse) return null;

  try {
    const section = topic?.sectionId || topic?.sectionTitle || "unknown_section";
    const slug = topic?.slug || "unknown_slug";
    return langfuse.trace({
      name: "topic_chat",
      userId,
      sessionId: `${userId}:${section}`,
      input: {
        question,
        topic: {
          sectionId: topic?.sectionId || null,
          sectionTitle: topic?.sectionTitle || null,
          slug: topic?.slug || null,
          title: topic?.title || null,
        },
      },
      metadata: {
        route: "/api/topic-chat",
        section,
        slug,
      },
      tags: ["topic-chat", section, slug],
    });
  } catch {
    return null;
  }
}

function trackOutcome(trace, payload) {
  if (!trace) return;

  try {
    trace.event({
      name: "topic_chat_outcome",
      input: payload,
    });

    trace.update({
      output: {
        mode: payload?.mode || null,
        guardrail: payload?.guardrail || null,
      },
      metadata: {
        statusCode: payload?.statusCode || null,
        llmUsed: Boolean(payload?.llmUsed),
        provider: payload?.provider || null,
        model: payload?.model || null,
        evidenceCount: payload?.evidenceCount ?? null,
      },
    });
  } catch {
    // keep telemetry optional
  }
}

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { ok: false, guardrail: "openai_missing_api_key", provider: "openai", model: OPENAI_MODEL };

  const timeout = withTimeout(LLM_TIMEOUT_MS);
  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.1,
        max_tokens: TOPIC_CHAT_MAX_TOKENS,
        messages,
      }),
      signal: timeout.signal,
    });

    if (!response.ok) {
      return { ok: false, guardrail: "openai_http_error", provider: "openai", model: OPENAI_MODEL };
    }

    const parsed = await response.json();
    const answer = String(parsed?.choices?.[0]?.message?.content || "").trim();
    if (!answer) {
      return { ok: false, guardrail: "openai_empty_response", provider: "openai", model: OPENAI_MODEL };
    }

    return {
      ok: true,
      answer,
      mode: "llm_guarded_openai",
      provider: "openai",
      model: OPENAI_MODEL,
      usage: {
        input: Number(parsed?.usage?.prompt_tokens || 0),
        output: Number(parsed?.usage?.completion_tokens || 0),
        total: Number(parsed?.usage?.total_tokens || 0),
      },
    };
  } catch {
    return { ok: false, guardrail: "openai_exception", provider: "openai", model: OPENAI_MODEL };
  } finally {
    timeout.clear();
  }
}

async function callOllama(messages) {
  const timeout = withTimeout(LLM_TIMEOUT_MS);
  try {
    const response = await fetch(`${OLLAMA_BASE_URL.replace(/\/$/, "")}${OLLAMA_CHAT_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: TOPIC_CHAT_MAX_TOKENS,
        },
      }),
      signal: timeout.signal,
    });

    if (!response.ok) {
      return { ok: false, guardrail: "ollama_http_error", provider: "ollama", model: OLLAMA_MODEL };
    }

    const parsed = await response.json();
    const answer = String(parsed?.message?.content || "").trim();
    if (!answer) {
      return { ok: false, guardrail: "ollama_empty_response", provider: "ollama", model: OLLAMA_MODEL };
    }

    return {
      ok: true,
      answer,
      mode: "llm_guarded_ollama",
      provider: "ollama",
      model: OLLAMA_MODEL,
      usage: null,
    };
  } catch {
    return { ok: false, guardrail: "ollama_exception", provider: "ollama", model: OLLAMA_MODEL };
  } finally {
    timeout.clear();
  }
}

export async function POST(request) {
  const userId = await getSessionUserEmail();
  if (!userId) {
    return NextResponse.json(
      { answer: "Unauthorized.", mode: "error", guardrail: "unauthorized" },
      { status: 401 }
    );
  }

  let question = "";
  let topic = null;
  let requestedProvider = "auto";
  let trace = null;

  try {
    const body = await request.json();
    question = clip(body?.question || "", 600);
    topic = normalizeTopic(body?.topic || {});
    requestedProvider = body?.provider || DEFAULT_PROVIDER;
    trace = createLangfuseTrace({ userId, question, topic });
  } catch {
    trace = createLangfuseTrace({ userId, question, topic });
    trackOutcome(trace, {
      mode: "error",
      guardrail: "bad_payload",
      statusCode: 400,
      llmUsed: false,
      evidenceCount: 0,
    });
    await flushLangfuse();

    return NextResponse.json(
      { answer: "Invalid request payload.", mode: "error", guardrail: "bad_payload" },
      { status: 400 }
    );
  }

  if (!question) {
    trackOutcome(trace, {
      mode: "guardrail",
      guardrail: "empty_question",
      statusCode: 200,
      llmUsed: false,
      evidenceCount: 0,
    });
    await flushLangfuse();

    return NextResponse.json(
      { answer: "Please ask a concrete question for this topic.", mode: "guardrail", guardrail: "empty_question" },
      { status: 200 }
    );
  }

  if (!topic?.title) {
    trackOutcome(trace, {
      mode: "error",
      guardrail: "missing_topic",
      statusCode: 400,
      llmUsed: false,
      evidenceCount: 0,
    });
    await flushLangfuse();

    return NextResponse.json(
      { answer: "Topic context is missing.", mode: "error", guardrail: "missing_topic" },
      { status: 400 }
    );
  }

  const knowledge = buildKnowledge(topic);
  const topicVocabulary = buildTopicVocabulary(topic, knowledge);
  const { questionTokens, best, evidence } = retrieveEvidence(question, knowledge);
  const { looksOffTopic } = classifyScope(question, topicVocabulary, best);

  if (questionTokens.length === 0) {
    trackOutcome(trace, {
      mode: "guardrail",
      guardrail: "empty_question",
      statusCode: 200,
      llmUsed: false,
      evidenceCount: evidence.length,
    });
    await flushLangfuse();

    return NextResponse.json(
      { answer: `Please ask a concrete question about "${topic.title}".`, mode: "guardrail", guardrail: "empty_question" },
      { status: 200 }
    );
  }

  if (!best || best.score < MIN_MATCH_SCORE || looksOffTopic) {
    trackOutcome(trace, {
      mode: "guardrail",
      guardrail: "off_topic_or_weak_evidence",
      statusCode: 200,
      llmUsed: false,
      evidenceCount: evidence.length,
    });
    await flushLangfuse();

    return NextResponse.json(
      { answer: createOutOfScopeReply(topic.title), mode: "guardrail", guardrail: "off_topic_or_weak_evidence" },
      { status: 200 }
    );
  }

  const evidencePayload = toEvidencePayload(evidence);
  const deterministicFallback = deterministicTopicAnswer(question, topic, knowledge, topicVocabulary);
  const provider = normalizedProvider(requestedProvider);
  const providers = providerOrder(provider);
  const { messages: promptMessages, llmInput } = buildPromptMessages(topic, question, evidencePayload);

  let lastGuardrail = "llm_unavailable";
  for (const selectedProvider of providers) {
    const result =
      selectedProvider === "ollama"
        ? await callOllama(promptMessages)
        : await callOpenAI(promptMessages);

    if (result.ok) {
      const answer = appendEvidenceFooterIfMissing(result.answer, evidencePayload);

      if (trace) {
        try {
          trace.generation({
            name: "topic_chat_llm_call",
            model: result.model,
            input: llmInput,
            output: result.answer,
            metadata: {
              provider: result.provider,
              topicTitle: topic.title,
              topicSection: topic.sectionId || topic.sectionTitle || null,
              topicSlug: topic.slug || null,
            },
            usage: result.usage || undefined,
          });
        } catch {
          // no-op
        }
      }

      trackOutcome(trace, {
        mode: result.mode,
        guardrail: "grounded_rag",
        statusCode: 200,
        llmUsed: true,
        provider: result.provider,
        model: result.model,
        evidenceCount: evidencePayload.length,
      });
      await flushLangfuse();

      return NextResponse.json(
        {
          answer,
          mode: result.mode,
          guardrail: "grounded_rag",
          evidence: evidencePayload,
        },
        { status: 200 }
      );
    }

    lastGuardrail = result.guardrail || lastGuardrail;
  }

  trackOutcome(trace, {
    mode: "deterministic_fallback",
    guardrail: lastGuardrail,
    statusCode: 200,
    llmUsed: false,
    evidenceCount: evidencePayload.length,
  });
  await flushLangfuse();

  return NextResponse.json(
    {
      answer: deterministicFallback,
      mode: "deterministic_fallback",
      guardrail: lastGuardrail,
      evidence: evidencePayload,
    },
    { status: 200 }
  );
}
