"use client";

import { useMemo, useState } from "react";

const DOCUMENTS = [
  {
    id: "dracula-1",
    source: "dracula.txt",
    chapter: "Chapter 1",
    score: 0.91,
    text: "Dracula's castle lies in the east of Transylvania near the Borgo Pass.",
  },
  {
    id: "dracula-2",
    source: "dracula.txt",
    chapter: "Chapter 2",
    score: 0.84,
    text: "The post town named by Count Dracula is Bistritz, deep in the Carpathian region.",
  },
  {
    id: "frankenstein-1",
    source: "frankenstein.txt",
    chapter: "Letter 4",
    score: 0.52,
    text: "Victor recounts the scientific obsession that led him to create life.",
  },
  {
    id: "meeting-1",
    source: "team_meeting.txt",
    chapter: "Q4 Review",
    score: 0.34,
    text: "Budget discussion focused on headcount planning and rollout timing.",
  },
];

export default function MetadataFilterWorkbench() {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [minScore, setMinScore] = useState(0.4);

  const filteredDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => (sourceFilter === "all" ? true : doc.source === sourceFilter))
      .filter((doc) => doc.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }, [minScore, sourceFilter]);

  const candidatePool = useMemo(() => {
    return sourceFilter === "all"
      ? "Broad semantic search across every ingested document."
      : `Candidate pool narrowed to ${sourceFilter} before similarity ranking even starts.`;
  }, [sourceFilter]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Metadata turns retrieval into controlled search. Instead of asking the vector store to search everything, you can narrow the candidate set by source, chapter, tenant, or any other ingestion-time tag.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem", marginBottom: "0.85rem" }}>
        <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          Source filter
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value)}
            style={{ width: "100%", marginTop: "0.22rem", padding: "0.38rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          >
            <option value="all">All sources</option>
            <option value="dracula.txt">dracula.txt</option>
            <option value="frankenstein.txt">frankenstein.txt</option>
            <option value="team_meeting.txt">team_meeting.txt</option>
          </select>
        </label>

        <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          Minimum relevance score: {minScore.toFixed(2)}
          <input type="range" min="0.2" max="0.95" step="0.01" value={minScore} onChange={(event) => setMinScore(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
        </label>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.8rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.2rem" }}>
          Candidate-pool explanation
        </div>
        <div style={{ fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.5 }}>{candidatePool}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "0.75rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
            Retrieved chunks with metadata
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {filteredDocs.map((doc) => (
              <div key={doc.id} style={{ borderRadius: "10px", border: "1px solid rgba(56,189,248,0.25)", background: "rgba(56,189,248,0.08)", padding: "0.6rem 0.7rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.76rem", color: "#7dd3fc", fontWeight: 700 }}>{doc.source}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{doc.chapter} | score {doc.score.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{doc.text}</div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <div style={{ borderRadius: "10px", border: "1px dashed rgba(239,68,68,0.3)", padding: "0.8rem", fontSize: "0.8rem", color: "#fca5a5" }}>
                No chunks survived the filter. This is safer than cross-source leakage, but it means your filter strategy is now too restrictive.
              </div>
            )}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Why metadata matters
          </div>
          <ul style={{ margin: "0 0 0.7rem", paddingLeft: "1rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <li>Lets the answer show exactly where a chunk came from.</li>
            <li>Reduces hallucination risk because source evidence is visible.</li>
            <li>Supports scoped retrieval by document, tenant, section, or effective date.</li>
            <li>Makes manual verification possible when users want to inspect the origin.</li>
          </ul>
          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(16,185,129,0.08)", borderLeft: "3px solid #10b981", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "#34d399" }}>Ingestion rule:</strong> attach metadata before chunk upsert so every vector keeps its source, chapter, and any governance labels you need later.
          </div>
        </div>
      </div>
    </div>
  );
}
