"use client";

import { useMemo, useState } from "react";

const CHUNKS = [
  {
    id: "c1",
    source: "lotr.txt",
    text: "It was in the heart of Hobbiton, at the home of Frodo Baggins, that Gandalf came to speak of matters far greater than Frodo could have imagined.",
    score: 0.86,
  },
  {
    id: "c2",
    source: "lotr.txt",
    text: "Gandalf came to Hobbiton to visit Frodo one summer day, carrying news that would alter the quiet rhythm of the Shire.",
    score: 0.81,
  },
  {
    id: "c3",
    source: "lotr.txt",
    text: "Frodo was in his home in Hobbiton when Gandalf, his old friend and mentor, arrived for the conversation that changed everything.",
    score: 0.76,
  },
  {
    id: "c4",
    source: "notes.txt",
    text: "A strict threshold can cause the retriever to return nothing even when the answer exists semantically but falls below the configured cutoff.",
    score: 0.49,
  },
];

const MODES = {
  ingest: {
    title: "Ingestion Baseline",
    summary: "Load the document, split it into chunks, embed each chunk, and persist the vectors so the expensive embedding work is not repeated every run.",
    note: "This mirrors the first basic example: document path, persistent Chroma directory, chunk overlap, embed, and save once.",
  },
  retrieve: {
    title: "Retriever Tuning",
    summary: "Load the persisted vector store, embed the user question with the same embedding model, then tune top-k and threshold until the retriever returns enough relevant context without too much noise.",
    note: "This mirrors the second basic example: same embedding model, similarity threshold, and top-k control the query-time behavior.",
  },
  answer: {
    title: "One-off Question Answering",
    summary: "Join the shortlisted chunks into one prompt, tell the model to answer only from those documents, and return 'I'm not sure' when the evidence is missing.",
    note: "This mirrors the one-off question example: stateless, grounded, and optimized for a single request rather than multi-turn memory.",
  },
};

function StatusBadge({ label, tone }) {
  const palette = {
    good: { border: "#22c55e55", bg: "#22c55e18", color: "#86efac" },
    warn: { border: "#f59e0b55", bg: "#f59e0b18", color: "#fcd34d" },
    bad: { border: "#ef444455", bg: "#ef444418", color: "#fca5a5" },
  }[tone];

  return (
    <span
      style={{
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.color,
        borderRadius: "999px",
        padding: "0.2rem 0.5rem",
        fontSize: "0.72rem",
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

export default function RAGRetrievalWorkbench() {
  const [mode, setMode] = useState("retrieve");
  const [topK, setTopK] = useState(3);
  const [threshold, setThreshold] = useState(0.5);
  const [conversationMode, setConversationMode] = useState("one_off");

  const selectedChunks = useMemo(() => {
    return CHUNKS.filter((chunk) => chunk.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }, [threshold, topK]);

  const retrievalState = useMemo(() => {
    if (selectedChunks.length === 0) {
      return {
        label: "No chunks returned",
        tone: "bad",
        explanation: "Threshold is too strict for this query. The retriever cannot hand useful evidence to the generator.",
      };
    }

    if (selectedChunks.length < topK) {
      return {
        label: "Sparse retrieval",
        tone: "warn",
        explanation: "Some chunks passed the threshold, but you may be over-constraining the candidate set.",
      };
    }

    return {
      label: "Healthy retrieval window",
      tone: "good",
      explanation: "The retriever is returning a compact, relevant candidate set for downstream answer generation.",
    };
  }, [selectedChunks, topK]);

  const promptPreview = useMemo(() => {
    const context = selectedChunks.map((chunk, index) => `[${index + 1}] ${chunk.text}`).join("\n\n");
    return `Question: Where does Gandalf meet Frodo?\n\nDocuments:\n${context || "<no retrieved context>"}\n\nInstruction: Answer only from the provided documents. If the answer is not found, respond with \"I'm not sure\".`;
  }, [selectedChunks]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Walk through the three practical RAG steps from the LangChain examples: ingest the document once, retrieve chunks with a tuned retriever, and assemble a grounded one-off answer prompt.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.8rem" }}>
        {Object.entries(MODES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #f97316" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(249,115,22,0.14)" : "var(--bg-tertiary)",
              color: mode === key ? "#fdba74" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.title}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.25rem" }}>{MODES[mode].title}</div>
        <p style={{ margin: "0 0 0.35rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>{MODES[mode].summary}</p>
        <p style={{ margin: 0, fontSize: "0.76rem", color: "#94a3b8", lineHeight: 1.45 }}>{MODES[mode].note}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.5rem" }}>
            Tuning Controls
          </div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
            Top-K: {topK}
            <input type="range" min="1" max="4" value={topK} onChange={(event) => setTopK(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.65rem" }}>
            Similarity threshold: {threshold.toFixed(2)}
            <input type="range" min="0.3" max="0.95" step="0.01" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Query mode
            <select
              value={conversationMode}
              onChange={(event) => setConversationMode(event.target.value)}
              style={{ width: "100%", marginTop: "0.22rem", padding: "0.36rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            >
              <option value="one_off">One-off question</option>
              <option value="conversational">Conversational follow-up</option>
            </select>
          </label>
          <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(99,102,241,0.08)", borderLeft: "3px solid #6366f1", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "#a5b4fc" }}>Key constraint:</strong> the same embedding model must be used for stored chunks and incoming user queries, otherwise similarity scores become meaningless.
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
              Retrieval outcome
            </div>
            <StatusBadge label={retrievalState.label} tone={retrievalState.tone} />
          </div>
          <p style={{ margin: "0 0 0.55rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{retrievalState.explanation}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {selectedChunks.map((chunk) => (
              <div key={chunk.id} style={{ borderRadius: "10px", border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.08)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontSize: "0.76rem", color: "#fdba74", fontWeight: 700 }}>{chunk.source}</span>
                  <span style={{ fontSize: "0.72rem", color: "#f8fafc" }}>score {chunk.score.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.45 }}>{chunk.text}</div>
              </div>
            ))}
            {selectedChunks.length === 0 && (
              <div style={{ borderRadius: "10px", border: "1px dashed rgba(239,68,68,0.3)", padding: "0.8rem", fontSize: "0.8rem", color: "#fca5a5" }}>
                No chunks passed the threshold. This is the exact failure mode the transcript warns about when thresholds are too strict.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Prompt assembly preview
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#c4b5fd", lineHeight: 1.55 }}>{promptPreview}</pre>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            One-off vs conversational
          </div>
          <p style={{ margin: "0 0 0.45rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {conversationMode === "one_off"
              ? "This request is stateless: retrieve evidence, build one prompt, answer, and stop. That keeps latency and operational complexity lower."
              : "Conversational RAG adds memory handling on top of retrieval. The answer may need both retrieved chunks and earlier chat turns, which increases prompt assembly complexity."}
          </p>
          <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <li>One-off mode is better for search widgets and isolated doc Q and A endpoints.</li>
            <li>Conversation mode is useful only when follow-up questions truly depend on prior turns.</li>
            <li>Either way, retrieval quality still depends on chunking, embedding consistency, and prompt grounding rules.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
