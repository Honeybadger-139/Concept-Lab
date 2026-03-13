"use client";

import { useMemo, useState } from "react";
import styles from "./TopicScopedChatbot.module.css";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "by", "can", "do", "does",
  "for", "from", "how", "i", "if", "in", "into", "is", "it", "its", "me", "my", "of", "on",
  "or", "our", "please", "should", "that", "the", "their", "them", "there", "this", "to",
  "was", "we", "what", "when", "where", "which", "who", "why", "with", "you", "your",
]);

const MAX_CONTEXT_SNIPPETS = 3;
const MIN_MATCH_SCORE = 0.12;
const STRICT_TOPIC_SCORE = 0.2;

function htmlToText(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function compactSnippet(text, maxLen = 280) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}...`;
}

function buildKnowledge(topic) {
  const sources = [];
  if (topic?.excerpt) {
    sources.push({ source: "Excerpt", text: topic.excerpt });
  }
  if (topic?.theoryHtml) {
    sources.push({ source: "Theory", text: htmlToText(topic.theoryHtml) });
  }
  if (topic?.example) {
    sources.push({ source: "Example", text: topic.example });
  }

  const questions = Array.isArray(topic?.interviewPrep?.questions) ? topic.interviewPrep.questions : [];
  const answers = Array.isArray(topic?.interviewPrep?.answers) ? topic.interviewPrep.answers : [];
  questions.forEach((question, index) => {
    const answer = answers[index] || topic?.interviewPrep?.seniorTip || "";
    const pairText = answer ? `Question: ${question}. Answer: ${answer}` : `Question: ${question}`;
    sources.push({ source: "Interview Prep", text: pairText });
  });

  const flashCards = Array.isArray(topic?.flashCards) ? topic.flashCards : [];
  flashCards.forEach((card) => {
    if (!card?.q && !card?.a) return;
    sources.push({
      source: "Flash Card",
      text: `Question: ${card.q || ""}. Answer: ${card.a || ""}`,
    });
  });

  const snippets = [];
  sources.forEach((entry) => {
    const sentences = splitSentences(entry.text);
    if (sentences.length === 0) return;

    for (let i = 0; i < sentences.length; i += 2) {
      const text = compactSnippet(sentences.slice(i, i + 2).join(" "));
      const tokenSet = new Set(tokenize(text));
      if (tokenSet.size === 0) continue;
      snippets.push({ source: entry.source, text, tokenSet });
    }
  });

  return snippets;
}

function buildTopicVocabulary(topic, knowledge) {
  const frequency = new Map();
  const seed = tokenize(`${topic?.sectionTitle || ""} ${topic?.title || ""} ${topic?.excerpt || ""}`);
  seed.forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 5));

  knowledge.forEach((snippet) => {
    snippet.tokenSet.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });
  });

  const topWords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([word]) => word);

  return new Set(topWords);
}

function scoreSnippet(questionTokens, snippetTokenSet) {
  if (!questionTokens.length) return 0;
  let overlap = 0;
  questionTokens.forEach((token) => {
    if (snippetTokenSet.has(token)) overlap += 1;
  });
  return overlap / questionTokens.length;
}

function createOutOfScopeReply(topicTitle) {
  return `I can only answer questions about "${topicTitle}".

Try asking about this topic's core theory, example, interview questions, or flash cards.`;
}

function answerFromTopic(question, topic, knowledge, topicVocabulary) {
  const questionTokens = tokenize(question);
  if (questionTokens.length === 0) {
    return `Please ask a concrete question about "${topic.title}".`;
  }

  const scored = knowledge
    .map((snippet) => ({
      ...snippet,
      score: scoreSnippet(questionTokens, snippet.tokenSet),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const topicHits = questionTokens.reduce((count, token) => count + (topicVocabulary.has(token) ? 1 : 0), 0);
  const looksOffTopic = topicHits === 0 && (!best || best.score < STRICT_TOPIC_SCORE);
  if (!best || best.score < MIN_MATCH_SCORE || looksOffTopic) {
    return createOutOfScopeReply(topic.title);
  }

  const evidence = scored.filter((item) => item.score >= MIN_MATCH_SCORE).slice(0, MAX_CONTEXT_SNIPPETS);
  const responseLines = evidence.map((item, index) => `${index + 1}. ${item.text} [${item.source}]`);

  return `Based on this topic:

${responseLines.join("\n")}

Ask a narrower follow-up if you want a deeper explanation on one part.`;
}

export default function TopicScopedChatbot({ topic }) {
  const knowledge = useMemo(() => buildKnowledge(topic), [topic]);
  const topicVocabulary = useMemo(() => buildTopicVocabulary(topic, knowledge), [topic, knowledge]);
  const suggestedPrompts = useMemo(
    () => (Array.isArray(topic?.interviewPrep?.questions) ? topic.interviewPrep.questions.slice(0, 3) : []),
    [topic]
  );

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: `Ask me anything about "${topic.title}". I only use this topic's content and refuse out-of-scope questions.`,
    },
  ]);

  function submitQuestion(rawQuestion) {
    const nextQuestion = String(rawQuestion || "").trim();
    if (!nextQuestion) return;

    const answer = answerFromTopic(nextQuestion, topic, knowledge, topicVocabulary);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: nextQuestion },
      { role: "assistant", text: answer },
    ]);
    setQuestion("");
  }

  function onSubmit(event) {
    event.preventDefault();
    submitQuestion(question);
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.scopeNote}>
        Scope: <strong>{topic.title}</strong> only.
      </p>

      {suggestedPrompts.length > 0 && (
        <div className={styles.promptRow}>
          {suggestedPrompts.map((prompt, index) => (
            <button key={index} type="button" className={styles.promptButton} onClick={() => submitQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className={styles.messages} role="log" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? styles.userBubble : styles.assistantBubble}>
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={`Ask a question about "${topic.title}"`}
          aria-label={`Ask a question about ${topic.title}`}
        />
        <button className={styles.sendButton} type="submit">
          Ask
        </button>
      </form>
    </div>
  );
}
