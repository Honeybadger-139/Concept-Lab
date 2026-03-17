"use client";

import { useMemo, useState } from "react";

const MODALITIES = {
  vision: {
    source: "Large image pretraining dataset",
    target: "Smaller domain image dataset",
    mismatchRisk: "Low if image statistics are related",
  },
  language: {
    source: "General language corpus",
    target: "Task-specific text dataset",
    mismatchRisk: "Low if domain language is similar",
  },
  audio: {
    source: "General speech/audio corpus",
    target: "Specific accent/noise setting",
    mismatchRisk: "Medium if production audio differs sharply",
  },
};

export default function TransferLearningFlowLab() {
  const [modality, setModality] = useState("vision");
  const [freezeRatio, setFreezeRatio] = useState(70);
  const [targetData, setTargetData] = useState(20);

  const metrics = useMemo(() => {
    const freezeFactor = freezeRatio / 100;
    const dataFactor = targetData / 100;

    const overfitRisk = Math.max(0, (1 - freezeFactor) * (1 - dataFactor) * 100);
    const adaptationSpeed = Math.min(100, 25 + (1 - freezeFactor) * 55 + dataFactor * 20);
    const baseAccuracy = 58 + dataFactor * 30 + (1 - Math.abs(freezeFactor - 0.6)) * 8;

    return {
      overfitRisk,
      adaptationSpeed,
      expectedAccuracy: Math.min(96, baseAccuracy),
    };
  }, [freezeRatio, targetData]);

  const m = MODALITIES[modality];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Transfer learning reuses learned representations from a large related dataset, then adapts them to a smaller target task. The main knobs are how much of the backbone to freeze and how much target data we have.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {Object.keys(MODALITIES).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setModality(key)}
            style={{
              borderRadius: "999px",
              border: modality === key ? "1px solid #10b981" : "1px solid var(--glass-border)",
              background: modality === key ? "rgba(16,185,129,0.12)" : "var(--bg-tertiary)",
              color: modality === key ? "#34d399" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.77rem",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Transfer pipeline</div>
          <div style={{ display: "grid", gap: "0.42rem" }}>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(59,130,246,0.28)", background: "rgba(59,130,246,0.12)", padding: "0.55rem 0.65rem", fontSize: "0.78rem", color: "#bfdbfe" }}>
              1. Pretrained backbone
              <div style={{ marginTop: "0.18rem", color: "#dbeafe" }}>{m.source}</div>
            </div>
            <div style={{ textAlign: "center", color: "#64748b", fontWeight: 700, fontSize: "0.82rem" }}>downarrow</div>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(16,185,129,0.28)", background: "rgba(16,185,129,0.12)", padding: "0.55rem 0.65rem", fontSize: "0.78rem", color: "#a7f3d0" }}>
              2. Add task head + fine-tune
              <div style={{ marginTop: "0.18rem", color: "#d1fae5" }}>{m.target}</div>
            </div>
            <div style={{ textAlign: "center", color: "#64748b", fontWeight: 700, fontSize: "0.82rem" }}>downarrow</div>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(245,158,11,0.28)", background: "rgba(245,158,11,0.12)", padding: "0.55rem 0.65rem", fontSize: "0.78rem", color: "#fde68a" }}>
              3. Evaluate + monitor
              <div style={{ marginTop: "0.18rem", color: "#fef3c7" }}>Risk note: {m.mismatchRisk}</div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Frozen backbone layers: {freezeRatio}%
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={freezeRatio}
              onChange={(event) => setFreezeRatio(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
            Target-data sufficiency: {targetData}%
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={targetData}
              onChange={(event) => setTargetData(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.55rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.55rem 0.65rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>Expected accuracy</div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: 700 }}>{metrics.expectedAccuracy.toFixed(1)}%</div>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.55rem 0.65rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>Adaptation speed</div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: 700 }}>{metrics.adaptationSpeed.toFixed(1)}%</div>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.55rem 0.65rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>Overfit risk</div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: 700 }}>{metrics.overfitRisk.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
