"use client";

import { useMemo, useState } from "react";
import styles from "./TopicScopedChatbot.module.css";
import {
  buildKnowledge,
  buildTopicVocabulary,
  deterministicTopicAnswer,
} from "@/data/topicChatUtils";

export default function TopicScopedChatbot({ topic }) {
  const knowledge = useMemo(() => buildKnowledge(topic), [topic]);
  const topicVocabulary = useMemo(() => buildTopicVocabulary(topic, knowledge), [topic, knowledge]);
  const suggestedPrompts = useMemo(
    () => (Array.isArray(topic?.interviewPrep?.questions) ? topic.interviewPrep.questions.slice(0, 3) : []),
    [topic]
  );

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: "Ask me anything about this topic. I can only answer within this topic.",
    },
  ]);

  async function submitQuestion(rawQuestion) {
    const nextQuestion = String(rawQuestion || "").trim();
    if (!nextQuestion || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: nextQuestion }]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/topic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: nextQuestion,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error(`topic-chat route returned ${response.status}`);
      }

      const payload = await response.json();
      const answerText = String(payload?.answer || "").trim();
      const mode = payload?.mode ? ` (${payload.mode})` : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answerText || deterministicTopicAnswer(nextQuestion, topic, knowledge, topicVocabulary),
          meta: mode ? `source${mode}` : "",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: deterministicTopicAnswer(nextQuestion, topic, knowledge, topicVocabulary),
          meta: "source (deterministic_fallback)",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
            {message.meta && <div className={styles.meta}>{message.meta}</div>}
          </div>
        ))}
        {isLoading && <div className={styles.assistantBubble}>Thinking...</div>}
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={isLoading}
          placeholder={`Ask a question about "${topic.title}"`}
          aria-label={`Ask a question about ${topic.title}`}
        />
        <button className={styles.sendButton} type="submit" disabled={isLoading}>
          {isLoading ? "Asking..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
