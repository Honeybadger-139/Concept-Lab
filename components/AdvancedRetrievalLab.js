"use client";

import { useMemo, useState } from "react";

const DOCS = [
  { id: "A", title: "Refund policy (core)", relevance: 0.93, novelty: 0.30 },
  { id: "B", title: "Refund policy exceptions", relevance: 0.88, novelty: 0.76 },
  { id: "C", title: "Refund process workflow", relevance: 0.84, novelty: 0.81 },
  { id: "D", title: "Return shipping terms", relevance: 0.80, novelty: 0.64 },
  { id: "E", title: "Pricing FAQ (partial)", relevance: 0.55, novelty: 0.69 },
];

function mmrRank(docs, lambda = 0.6) {
  const chosen = [];
  const remaining = [...docs];
  while (remaining.length) {
    let bestIdx = 0;
    let bestScore = -Infinity;
    remaining.forEach((doc, idx) => {
      const diversityBoost = doc.novelty;
      const score = lambda * doc.relevance + (1 - lambda) * diversityBoost;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    });
    chosen.push(remaining.splice(bestIdx, 1)[0]);
  }
  return chosen;
}

export default function AdvancedRetrievalLab() {
  const [mode, setMode] = useState("similarity"); // similarity | mmr | threshold
  const [k, setK] = useState(3);
  const [threshold, setThreshold] = useState(0.7);
  const [lambda, setLambda] = useState(0.6);

  const ranked = useMemo(() => {
    if (mode === "similarity") {
      return [...DOCS].sort((a, b) => b.relevance - a.relevance);
    }
    if (mode === "mmr") {
      return mmrRank(DOCS, lambda);
    }
    return [...DOCS]
      .filter((d) => d.relevance >= threshold)
      .sort((a, b) => b.relevance - a.relevance);
  }, [mode, threshold, lambda]);

  const selected = ranked.slice(0, k);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        Compare retrieval modes: similarity, MMR, and thresholded retrieval.
      </p>

      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.65rem" }}>
        {[
          ["similarity", "Similarity"],
          ["mmr", "MMR"],
          ["threshold", "Threshold"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            style={{
              flex: 1,
              borderRadius: "999px",
              border: mode === id ? "1px solid #6366f1" : "1px solid var(--glass-border)",
              background: mode === id ? "rgba(99,102,241,0.2)" : "transparent",
              color: "var(--text-primary)",
              fontSize: "0.73rem",
              padding: "0.32rem 0.5rem",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.7rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.65rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.45rem" }}>
            Controls
          </div>
          <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "0.2rem" }}>
            Top-K selected: {k}
          </label>
          <input type="range" min={1} max={5} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%" }} />

          {mode === "threshold" && (
            <>
              <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.4rem", marginBottom: "0.2rem" }}>
                Score threshold: {threshold.toFixed(2)}
              </label>
              <input type="range" min={0.4} max={0.95} step={0.01} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: "100%" }} />
            </>
          )}

          {mode === "mmr" && (
            <>
              <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.4rem", marginBottom: "0.2rem" }}>
                MMR lambda (relevance vs diversity): {lambda.toFixed(2)}
              </label>
              <input type="range" min={0.2} max={0.9} step={0.05} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} style={{ width: "100%" }} />
            </>
          )}
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.65rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.45rem" }}>
            Selected Context
          </div>
          {selected.length === 0 && (
            <div style={{ fontSize: "0.73rem", color: "#fca5a5" }}>
              No chunks passed the threshold. Trigger abstention/fallback behavior.
            </div>
          )}
          {selected.map((doc, idx) => (
            <div key={doc.id} style={{ border: "1px solid var(--glass-border)", borderRadius: "0.45rem", padding: "0.4rem", marginBottom: "0.35rem" }}>
              <div style={{ fontSize: "0.73rem", color: "var(--text-primary)" }}>
                #{idx + 1} {doc.title}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>
                relevance={doc.relevance.toFixed(2)} | novelty={doc.novelty.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
