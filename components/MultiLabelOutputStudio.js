"use client";

import { useMemo, useState } from "react";

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function softmax(values) {
  const maxValue = Math.max(...values);
  const shifted = values.map((value) => Math.exp(value - maxValue));
  const total = shifted.reduce((sum, value) => sum + value, 0);
  return shifted.map((value) => value / total);
}

export default function MultiLabelOutputStudio() {
  const [scores, setScores] = useState([2.2, 1.6, 0.8]);
  const [mode, setMode] = useState("multiclass");

  const independentProbabilities = useMemo(() => scores.map((value) => sigmoid(value)), [scores]);
  const competingProbabilities = useMemo(() => softmax(scores), [scores]);
  const displayValues = mode === "multiclass" ? competingProbabilities : independentProbabilities;
  const labels = ["Car", "Bus", "Pedestrian"];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Multiclass and multi-label may look similar at the output layer, but the semantics are different. Multiclass outputs compete for one winner. Multi-label outputs act like separate yes or no decisions.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["multiclass", "Multiclass (softmax)"],
          ["multilabel", "Multi-label (sigmoid heads)"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #10b981" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(16,185,129,0.12)" : "var(--bg-tertiary)",
              color: mode === key ? "#34d399" : "var(--text-secondary)",
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
            Shared representation scores
          </div>
          {scores.map((value, index) => (
            <label key={labels[index]} style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
              {labels[index]} score: {value.toFixed(1)}
              <input
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={value}
                onChange={(event) => {
                  const next = [...scores];
                  next[index] = Number(event.target.value);
                  setScores(next);
                }}
                style={{ width: "100%", marginTop: "0.22rem" }}
              />
            </label>
          ))}
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.28rem" }}>
            {mode === "multiclass" ? "One class must win" : "Each label is independent"}
          </div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {labels.map((label, index) => (
              <div key={label} style={{ borderRadius: "10px", border: "1px solid rgba(148,163,184,0.2)", background: "rgba(15,23,42,0.72)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.79rem" }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{label}</span>
                  <span style={{ color: "#cbd5e1" }}>{displayValues[index].toFixed(4)}</span>
                </div>
                <div style={{ marginTop: "0.4rem", height: "8px", borderRadius: "999px", background: "rgba(148,163,184,0.18)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(4, displayValues[index] * 100)}%`, height: "100%", background: mode === "multiclass" ? "linear-gradient(90deg, #3b82f6, #60a5fa)" : "linear-gradient(90deg, #10b981, #34d399)" }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: "0.55rem 0 0", fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            {mode === "multiclass"
              ? "Softmax makes all labels compete for the same probability mass, so the outputs sum to 1."
              : "Sigmoid heads let multiple labels be high at once, which is what you want when an image can contain several objects simultaneously."}
          </p>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Design rule
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>Use softmax when labels are mutually exclusive and exactly one should win.</li>
          <li>Use one sigmoid output per label when several labels can be true at the same time.</li>
          <li>A shared hidden representation can still be useful in both cases; what changes is the output semantics.</li>
        </ul>
      </div>
    </div>
  );
}
