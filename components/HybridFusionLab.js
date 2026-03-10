"use client";

import { useMemo, useState } from "react";

const VECTOR_RANK = ["D1", "D2", "D3", "D4", "D5"];
const KEYWORD_RANK = ["D3", "D5", "D1", "D6", "D2"];

function rrfScore(rank, k) {
  return 1 / (k + rank);
}

export default function HybridFusionLab() {
  const [kConst, setKConst] = useState(60);
  const [maxRank, setMaxRank] = useState(5);

  const fused = useMemo(() => {
    const ids = new Set([...VECTOR_RANK, ...KEYWORD_RANK]);
    const rows = [];
    ids.forEach((id) => {
      const vr = VECTOR_RANK.indexOf(id) + 1;
      const kr = KEYWORD_RANK.indexOf(id) + 1;
      const vScore = vr > 0 && vr <= maxRank ? rrfScore(vr, kConst) : 0;
      const kScore = kr > 0 && kr <= maxRank ? rrfScore(kr, kConst) : 0;
      rows.push({
        id,
        vectorRank: vr || null,
        keywordRank: kr || null,
        score: vScore + kScore,
      });
    });
    return rows.sort((a, b) => b.score - a.score);
  }, [kConst, maxRank]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        Simulate hybrid retrieval fusion using Reciprocal Rank Fusion (RRF).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.7rem", marginBottom: "0.7rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.65rem" }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>Input Rankings</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "0.25rem" }}>
            Vector branch: {VECTOR_RANK.join(" > ")}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
            Keyword branch: {KEYWORD_RANK.join(" > ")}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.65rem" }}>
          <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "0.2rem" }}>
            RRF constant K: {kConst}
          </label>
          <input type="range" min={20} max={100} step={5} value={kConst} onChange={(e) => setKConst(Number(e.target.value))} style={{ width: "100%" }} />

          <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.35rem", marginBottom: "0.2rem" }}>
            Max per-list rank considered: {maxRank}
          </label>
          <input type="range" min={3} max={5} step={1} value={maxRank} onChange={(e) => setMaxRank(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", padding: "0.65rem" }}>
        <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
          Fused Ranking (RRF)
        </div>
        {fused.map((row, idx) => (
          <div key={row.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr", gap: "0.35rem", fontSize: "0.71rem", color: "var(--text-secondary)", borderBottom: "1px dashed var(--glass-border)", padding: "0.28rem 0" }}>
            <span style={{ color: idx < 3 ? "#22c55e" : "var(--text-secondary)" }}>#{idx + 1}</span>
            <span>{row.id}</span>
            <span>V:{row.vectorRank || "-"}</span>
            <span>RRF:{row.score.toFixed(4)}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "0.6rem", border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.08)", borderRadius: "0.45rem", padding: "0.45rem 0.6rem", fontSize: "0.71rem", color: "var(--text-secondary)" }}>
        Rank fusion is robust when vector and keyword scores are not calibrated to the same numeric scale.
      </div>
    </div>
  );
}
