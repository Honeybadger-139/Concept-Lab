"use client";

import { useState } from "react";

const INJECTION = [
  { icon: "📄", title: "Parse Documents", desc: "Extract text blocks, tables, and images with layout context." },
  { icon: "🧠", title: "Embed by Modality", desc: "Text embeddings for text, CLIP-like embeddings for images." },
  { icon: "🗂️", title: "Store Unified Index", desc: "Persist vectors with metadata: type, page, region, source." },
];

const RETRIEVAL = [
  { icon: "❓", title: "User Query", desc: "Text or image input enters retrieval layer." },
  { icon: "🔍", title: "Cross-Modal Search", desc: "Find relevant text chunks and image regions jointly." },
  { icon: "🧷", title: "Evidence Assembly", desc: "Link retrieved visuals with nearby textual context." },
  { icon: "👁️", title: "Vision LLM Answer", desc: "Generate grounded answer with citations to text/image sources." },
];

function StepCard({ step }) {
  return (
    <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.5rem", padding: "0.55rem", background: "var(--bg-tertiary)" }}>
      <div style={{ fontSize: "0.86rem", marginBottom: "0.18rem" }}>{step.icon} <strong style={{ color: "var(--text-primary)" }}>{step.title}</strong></div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{step.desc}</div>
    </div>
  );
}

export default function MultimodalRAGFlowViz() {
  const [mode, setMode] = useState("retrieval");
  const steps = mode === "retrieval" ? RETRIEVAL : INJECTION;

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        Multi-modal RAG architecture: index both text and image evidence, then route to a vision-capable model for grounded output.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.65rem" }}>
        <button
          onClick={() => setMode("retrieval")}
          style={{
            flex: 1,
            borderRadius: "999px",
            padding: "0.33rem 0.5rem",
            border: mode === "retrieval" ? "1px solid #6366f1" : "1px solid var(--glass-border)",
            background: mode === "retrieval" ? "rgba(99,102,241,0.2)" : "transparent",
            color: "var(--text-primary)",
            fontSize: "0.73rem",
            cursor: "pointer",
          }}
        >
          Retrieval-time Flow
        </button>
        <button
          onClick={() => setMode("injection")}
          style={{
            flex: 1,
            borderRadius: "999px",
            padding: "0.33rem 0.5rem",
            border: mode === "injection" ? "1px solid #f97316" : "1px solid var(--glass-border)",
            background: mode === "injection" ? "rgba(249,115,22,0.2)" : "transparent",
            color: "var(--text-primary)",
            fontSize: "0.73rem",
            cursor: "pointer",
          }}
        >
          Injection-time Flow
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.5rem" }}>
        {steps.map((step, idx) => (
          <StepCard key={`${mode}-${idx}`} step={step} />
        ))}
      </div>

      <div style={{ marginTop: "0.65rem", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.08)", borderRadius: "0.45rem", padding: "0.5rem 0.6rem", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
        <strong style={{ color: "#f87171" }}>Common pitfall:</strong> OCR-only pipelines may miss visual semantics in charts/diagrams.
        Keep modality-aware extraction and evaluation in place.
      </div>
    </div>
  );
}
