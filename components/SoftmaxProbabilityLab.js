"use client";

import { useMemo, useState } from "react";

function softmax(values) {
  const maxValue = Math.max(...values);
  const shifted = values.map((value) => Math.exp(value - maxValue));
  const total = shifted.reduce((sum, value) => sum + value, 0);
  return shifted.map((value) => value / total);
}

export default function SoftmaxProbabilityLab() {
  const [logits, setLogits] = useState([2.4, 1.2, 0.4, -0.8]);
  const [groundTruth, setGroundTruth] = useState(0);
  const [mode, setMode] = useState("probabilities");

  const probabilities = useMemo(() => softmax(logits), [logits]);
  const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
  const loss = -Math.log(Math.max(probabilities[groundTruth], 1e-9));

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Softmax turns class scores into one probability distribution. The scores compete through a shared denominator, so pushing one class up automatically pushes the others down.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["probabilities", "Probability view"],
          ["logits", "from_logits=True view"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #3b82f6" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(59,130,246,0.12)" : "var(--bg-tertiary)",
              color: mode === key ? "#93c5fd" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.77rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
            Adjust class logits
          </div>
          {logits.map((value, index) => (
            <label key={index} style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
              Class {index + 1} logit: {value.toFixed(1)}
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={value}
                onChange={(event) => {
                  const next = [...logits];
                  next[index] = Number(event.target.value);
                  setLogits(next);
                }}
                style={{ width: "100%", marginTop: "0.22rem" }}
              />
            </label>
          ))}
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Ground-truth class
            <select value={groundTruth} onChange={(event) => setGroundTruth(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem", padding: "0.36rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
              {logits.map((_, index) => (
                <option key={index} value={index}>Class {index + 1}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.28rem" }}>Softmax output</div>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Predicted class: <strong style={{ color: "#f8fafc" }}>Class {predictedIndex + 1}</strong>
          </p>
          <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.6rem" }}>
            {probabilities.map((value, index) => (
              <div key={index} style={{ borderRadius: "10px", border: index === predictedIndex ? "1px solid rgba(16,185,129,0.32)" : "1px solid rgba(148,163,184,0.2)", background: index === predictedIndex ? "rgba(16,185,129,0.12)" : "rgba(15,23,42,0.72)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.78rem" }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 700 }}>Class {index + 1}</span>
                  <span style={{ color: "#cbd5e1" }}>{value.toFixed(4)}</span>
                </div>
                <div style={{ marginTop: "0.4rem", height: "8px", borderRadius: "999px", background: "rgba(148,163,184,0.18)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(4, value * 100)}%`, height: "100%", background: index === predictedIndex ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(59,130,246,0.08)", borderLeft: "3px solid #3b82f6", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Cross-entropy loss for true class {groundTruth + 1}: <strong style={{ color: "#f8fafc" }}>{loss.toFixed(4)}</strong>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Architecture note
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {mode === "probabilities"
            ? "This is the readable path: output layer computes logits, softmax turns them into probabilities, then cross-entropy scores the true class."
            : "This is the numerically stable path used in production code: keep the layer output as raw logits and let the loss function combine softmax plus cross-entropy internally with from_logits=True."}
        </p>
      </div>
    </div>
  );
}
