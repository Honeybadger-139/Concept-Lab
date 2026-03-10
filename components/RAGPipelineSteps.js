"use client";

/**
 * RAGPipelineSteps — animated two-column diagram of the RAG pipelines.
 *
 * Shows the INJECTION pipeline (offline) and the RETRIEVAL pipeline (real-time)
 * side by side, with animated flow arrows that highlight on hover.
 */

import { useState } from "react";

const INJECTION = [
  { icon: "📄", label: "Source Documents", desc: "PDFs, DOCX, TXT files" },
  { icon: "✂️", label: "Chunking", desc: "Split into ~1,000 token pieces" },
  { icon: "🔢", label: "Embedding", desc: "Each chunk → dense vector" },
  { icon: "🗃️", label: "Vector Store", desc: "ChromaDB / Pinecone / pgvector" },
];

const RETRIEVAL = [
  { icon: "❓", label: "User Query", desc: "Natural language question" },
  { icon: "🔢", label: "Embed Query", desc: "Same model as injection" },
  { icon: "🔍", label: "Similarity Search", desc: "Top-K by cosine similarity" },
  { icon: "📦", label: "Retrieved Chunks", desc: "Top 3–5 most relevant pieces" },
  { icon: "🤖", label: "LLM + Context", desc: "Chunks + query → grounded answer" },
  { icon: "💬", label: "Final Answer", desc: "Cited, accurate, grounded" },
];

function PipelineArrow() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      color: "var(--text-tertiary)",
      fontSize: "1.1rem",
      lineHeight: 1,
      padding: "0.15rem 0",
    }}>↓</div>
  );
}

function PipelineStep({ icon, label, desc, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "rgba(99,102,241,0.45)" : "var(--glass-border)"}`,
        background: active ? "rgba(99,102,241,0.1)" : "var(--bg-tertiary)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.1rem" }}>{desc}</div>
      </div>
    </div>
  );
}

export default function RAGPipelineSteps() {
  const [activeInj, setActiveInj] = useState(null);
  const [activeRet, setActiveRet] = useState(null);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>
        RAG has <strong style={{ color: "var(--text-primary)" }}>two distinct pipelines</strong>.
        The injection pipeline runs <em>once offline</em> to build the knowledge base.
        The retrieval pipeline runs <em>on every user query</em> in real-time.
        Click any step to highlight it.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Injection */}
        <div>
          <div style={{
            textAlign: "center",
            marginBottom: "0.875rem",
            padding: "0.4rem 0.875rem",
            borderRadius: "99px",
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.25)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#f97316",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            ⚙️ Injection Pipeline (Offline / Batch)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {INJECTION.map((step, i) => (
              <div key={i}>
                <PipelineStep
                  {...step}
                  active={activeInj === i}
                  onClick={() => setActiveInj(activeInj === i ? null : i)}
                />
                {i < INJECTION.length - 1 && <PipelineArrow />}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "0.875rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.15)",
            fontSize: "0.75rem",
            color: "#f97316",
          }}>
            ⏱ Runs once. Re-run only when documents change.
          </div>
        </div>

        {/* Retrieval */}
        <div>
          <div style={{
            textAlign: "center",
            marginBottom: "0.875rem",
            padding: "0.4rem 0.875rem",
            borderRadius: "99px",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#6366f1",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            ⚡ Retrieval Pipeline (Real-time / Per Query)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {RETRIEVAL.map((step, i) => (
              <div key={i}>
                <PipelineStep
                  {...step}
                  active={activeRet === i}
                  onClick={() => setActiveRet(activeRet === i ? null : i)}
                />
                {i < RETRIEVAL.length - 1 && <PipelineArrow />}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "0.875rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            fontSize: "0.75rem",
            color: "#6366f1",
          }}>
            ⚡ Runs every query. Must be fast (&lt;500 ms target).
          </div>
        </div>

      </div>

      {/* Key insight */}
      <div style={{
        marginTop: "1.25rem",
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-sm)",
        background: "rgba(167,139,250,0.07)",
        borderLeft: "3px solid var(--accent-tertiary)",
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
      }}>
        <strong style={{ color: "var(--accent-tertiary)" }}>Key constraint:</strong>{" "}
        Both pipelines <em>must use the exact same embedding model</em>. If you embed
        documents with <code style={{ fontSize: "0.8em", background: "rgba(99,102,241,0.15)", padding: "0.1em 0.35em", borderRadius: "3px" }}>text-embedding-3-small</code> you must
        also embed queries with it. Mixing models corrupts the similarity scores entirely.
      </div>
    </div>
  );
}
