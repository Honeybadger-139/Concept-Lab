import { NextResponse } from "next/server";
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
const DEFAULT_MODEL = process.env.TOPIC_CHAT_MODEL || "gpt-4o-mini";

function clip(text, max = 1200) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function normalizeTopic(rawTopic = {}) {
  return {
    sectionTitle: clip(rawTopic.sectionTitle || "", 80),
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

export async function POST(request) {
  let question = "";
  let topic = null;

  try {
    const body = await request.json();
    question = clip(body?.question || "", 600);
    topic = normalizeTopic(body?.topic || {});
  } catch {
    return NextResponse.json(
      { answer: "Invalid request payload.", mode: "error", guardrail: "bad_payload" },
      { status: 400 }
    );
  }

  if (!question) {
    return NextResponse.json(
      { answer: "Please ask a concrete question for this topic.", mode: "guardrail", guardrail: "empty_question" },
      { status: 200 }
    );
  }

  if (!topic?.title) {
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
    return NextResponse.json(
      { answer: `Please ask a concrete question about "${topic.title}".`, mode: "guardrail", guardrail: "empty_question" },
      { status: 200 }
    );
  }

  if (!best || best.score < MIN_MATCH_SCORE || looksOffTopic) {
    return NextResponse.json(
      { answer: createOutOfScopeReply(topic.title), mode: "guardrail", guardrail: "off_topic_or_weak_evidence" },
      { status: 200 }
    );
  }

  const evidencePayload = toEvidencePayload(evidence);
  const deterministicFallback = deterministicTopicAnswer(question, topic, knowledge, topicVocabulary);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        answer: deterministicFallback,
        mode: "deterministic_fallback",
        guardrail: "missing_openai_api_key",
        evidence: evidencePayload,
      },
      { status: 200 }
    );
  }

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

  try {
    const llmResponse = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.1,
        max_tokens: 380,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!llmResponse.ok) {
      return NextResponse.json(
        {
          answer: deterministicFallback,
          mode: "deterministic_fallback",
          guardrail: "llm_http_error",
          evidence: evidencePayload,
        },
        { status: 200 }
      );
    }

    const parsed = await llmResponse.json();
    const rawAnswer = parsed?.choices?.[0]?.message?.content || "";
    const answer = appendEvidenceFooterIfMissing(rawAnswer || deterministicFallback, evidencePayload);

    return NextResponse.json(
      {
        answer,
        mode: "llm_guarded",
        guardrail: "grounded_rag",
        evidence: evidencePayload,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        answer: deterministicFallback,
        mode: "deterministic_fallback",
        guardrail: "llm_exception",
        evidence: evidencePayload,
      },
      { status: 200 }
    );
  }
}
