"use client";

import { useMemo, useState } from "react";

const DOC_TYPES = [
  { id: "faq", label: "FAQ / Help Center" },
  { id: "policy", label: "Policy / Legal Docs" },
  { id: "research", label: "Long Research Narrative" },
  { id: "scanned", label: "Scanned PDF / Report" },
];

const PRIORITY = [
  { id: "balanced", label: "Balanced" },
  { id: "quality", label: "Highest quality" },
  { id: "cost", label: "Lowest cost" },
  { id: "latency", label: "Fastest ingestion" },
];

function recommend(docType, priority, hasTables) {
  if (docType === "scanned") {
    return {
      strategy: "Layout extraction + recursive chunking",
      rationale: "Run OCR/layout parsing first (for example unstructured.io), then chunk normalized text.",
      risk: "Without extraction, retrieval loses chart/table context.",
    };
  }
  if (docType === "faq") {
    return {
      strategy: priority === "quality" ? "Recursive splitter" : "Character/recursive hybrid",
      rationale: "FAQ entries are short and structured; deterministic chunking is usually enough.",
      risk: "Over-chunking can duplicate near-identical answers.",
    };
  }
  if (docType === "policy") {
    return {
      strategy: "Recursive splitter with heading-aware separators",
      rationale: "Policy clauses rely on section continuity; preserve boundaries and keep overlap.",
      risk: "Chunk boundaries in clause middle can produce incorrect policy interpretation.",
    };
  }
  if (docType === "research") {
    return {
      strategy: priority === "quality" ? "Semantic chunking (evaluate first)" : "Recursive splitter baseline",
      rationale: "Narrative text often benefits from topic-aware boundaries, but cost rises quickly.",
      risk: "Semantic chunking can be expensive without measurable gain.",
    };
  }

  return {
    strategy: "Recursive splitter",
    rationale: "Strong default quality-to-cost tradeoff.",
    risk: "Requires tuning for edge formats.",
  };
}

export default function ChunkingStrategyWorkbench() {
  const [docType, setDocType] = useState("policy");
  const [priority, setPriority] = useState("balanced");
  const [chunkSize, setChunkSize] = useState(900);
  const [overlapPct, setOverlapPct] = useState(15);
  const [hasTables, setHasTables] = useState(true);

  const output = useMemo(() => {
    const rec = recommend(docType, priority, hasTables);
    const overlap = Math.round((chunkSize * overlapPct) / 100);
    const qualityScore = Math.min(95, Math.round(58 + overlapPct * 1.2 + (priority === "quality" ? 12 : 0)));
    const costScore = Math.min(95, Math.round(40 + overlapPct * 0.9 + (priority === "cost" ? -10 : 10)));
    return { ...rec, overlap, qualityScore, costScore };
  }, [docType, priority, chunkSize, overlapPct, hasTables]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        Choose document characteristics and constraints to see a practical chunking strategy recommendation.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            Inputs
          </div>
          <label style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Document type</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "100%", marginBottom: "0.45rem", marginTop: "0.2rem", padding: "0.35rem", borderRadius: "0.4rem", border: "1px solid var(--glass-border)", background: "transparent", color: "var(--text-primary)" }}>
            {DOC_TYPES.map((d) => (
              <option key={d.id} value={d.id} style={{ background: "#111" }}>{d.label}</option>
            ))}
          </select>

          <label style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: "100%", marginBottom: "0.45rem", marginTop: "0.2rem", padding: "0.35rem", borderRadius: "0.4rem", border: "1px solid var(--glass-border)", background: "transparent", color: "var(--text-primary)" }}>
            {PRIORITY.map((p) => (
              <option key={p.id} value={p.id} style={{ background: "#111" }}>{p.label}</option>
            ))}
          </select>

          <label style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", display: "block", marginTop: "0.15rem" }}>
            Chunk size: {chunkSize} tokens
          </label>
          <input type="range" min={400} max={1400} step={50} value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))} style={{ width: "100%" }} />

          <label style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", display: "block", marginTop: "0.15rem" }}>
            Overlap: {overlapPct}% ({output.overlap} tokens)
          </label>
          <input type="range" min={5} max={30} step={1} value={overlapPct} onChange={(e) => setOverlapPct(Number(e.target.value))} style={{ width: "100%" }} />

          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem", fontSize: "0.73rem", color: "var(--text-secondary)" }}>
            <input type="checkbox" checked={hasTables} onChange={(e) => setHasTables(e.target.checked)} />
            Contains many tables/figures
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
            Recommendation
          </div>
          <div style={{ fontSize: "0.83rem", color: "#a5b4fc", fontWeight: 700, marginBottom: "0.35rem" }}>
            {output.strategy}
          </div>
          <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "0.45rem" }}>
            {output.rationale}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#fca5a5", marginBottom: "0.55rem" }}>
            Risk: {output.risk}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.4rem", padding: "0.35rem" }}>
              <div style={{ fontSize: "0.66rem", color: "var(--text-tertiary)" }}>Estimated quality</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#22c55e" }}>{output.qualityScore}/100</div>
            </div>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.4rem", padding: "0.35rem" }}>
              <div style={{ fontSize: "0.66rem", color: "var(--text-tertiary)" }}>Ingestion cost</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f59e0b" }}>{output.costScore}/100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
