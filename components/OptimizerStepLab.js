"use client";

import { useMemo, useState } from "react";

export default function OptimizerStepLab() {
  const [scenario, setScenario] = useState("consistent");
  const [baseLearningRate, setBaseLearningRate] = useState(0.1);

  const gradients = scenario === "consistent" ? [0.9, 0.8, 0.7, 0.6] : [1.1, -1.0, 1.0, -0.9];

  const summary = useMemo(() => {
    let gdPosition = 0;
    let adaptivePosition = 0;
    let adaptiveRate = baseLearningRate;

    const rows = gradients.map((gradient, index) => {
      gdPosition -= baseLearningRate * gradient;

      if (index > 0) {
        const sameDirection = Math.sign(gradient) === Math.sign(gradients[index - 1]);
        adaptiveRate = sameDirection ? adaptiveRate * 1.2 : adaptiveRate * 0.6;
      }

      adaptivePosition -= adaptiveRate * gradient;

      return {
        step: index + 1,
        gradient,
        gdPosition,
        adaptivePosition,
        adaptiveRate,
      };
    });

    return rows;
  }, [gradients, baseLearningRate]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Adam is useful because one fixed learning rate is rarely ideal everywhere. When gradients keep pointing the same way, larger steps help. When updates bounce back and forth, smaller steps calm the oscillation.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["consistent", "Consistent downhill direction"],
          ["oscillating", "Oscillating gradients"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenario(key)}
            style={{
              borderRadius: "999px",
              border: scenario === key ? "1px solid #8b5cf6" : "1px solid var(--glass-border)",
              background: scenario === key ? "rgba(139,92,246,0.12)" : "var(--bg-tertiary)",
              color: scenario === key ? "#c4b5fd" : "var(--text-secondary)",
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

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem", marginBottom: "0.8rem" }}>
        <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
          Base learning rate: {baseLearningRate.toFixed(2)}
          <input
            type="range"
            min="0.02"
            max="0.25"
            step="0.01"
            value={baseLearningRate}
            onChange={(event) => setBaseLearningRate(Number(event.target.value))}
            style={{ width: "100%", marginTop: "0.24rem" }}
          />
        </label>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.5rem", marginBottom: "0.8rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ color: "#93c5fd", textAlign: "left" }}>
              <th style={{ padding: "0.5rem" }}>Step</th>
              <th style={{ padding: "0.5rem" }}>Gradient</th>
              <th style={{ padding: "0.5rem" }}>GD position</th>
              <th style={{ padding: "0.5rem" }}>Adaptive position</th>
              <th style={{ padding: "0.5rem" }}>Adaptive rate</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row.step} style={{ borderTop: "1px solid rgba(148,163,184,0.16)", color: "#e2e8f0" }}>
                <td style={{ padding: "0.5rem" }}>{row.step}</td>
                <td style={{ padding: "0.5rem" }}>{row.gradient.toFixed(2)}</td>
                <td style={{ padding: "0.5rem" }}>{row.gdPosition.toFixed(3)}</td>
                <td style={{ padding: "0.5rem" }}>{row.adaptivePosition.toFixed(3)}</td>
                <td style={{ padding: "0.5rem" }}>{row.adaptiveRate.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Intuition
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {scenario === "consistent"
            ? "When the gradient keeps pointing in nearly the same direction, adaptive optimizers can safely increase the effective step size and move faster than plain gradient descent."
            : "When the gradient keeps flipping sign, adaptive optimizers shrink the effective step size to reduce zig-zagging and settle toward the valley more smoothly."}
        </p>
      </div>
    </div>
  );
}
