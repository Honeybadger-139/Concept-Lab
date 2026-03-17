"use client";

import { useMemo, useState } from "react";

function relu(value) {
  return Math.max(0, value);
}

export default function ActivationCollapseViz() {
  const [mode, setMode] = useState("linear");
  const [xValue, setXValue] = useState(1.2);

  const model = useMemo(() => {
    const w1 = 1.5;
    const b1 = -0.8;
    const w2 = 2.2;
    const b2 = 0.4;

    const hiddenLinear = w1 * xValue + b1;
    const hiddenActivated = mode === "linear" ? hiddenLinear : relu(hiddenLinear);
    const output = w2 * hiddenActivated + b2;
    const collapsedW = w2 * w1;
    const collapsedB = w2 * b1 + b2;
    const collapsedOutput = collapsedW * xValue + collapsedB;

    return {
      hiddenLinear,
      hiddenActivated,
      output,
      collapsedW,
      collapsedB,
      collapsedOutput,
      matchesExactly: mode === "linear",
    };
  }, [mode, xValue]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        This visual shows the core reason activation functions matter. If every layer is linear, a deep network collapses into one linear equation. Insert a nonlinear activation and the network can represent shapes a single line cannot.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["linear", "All linear layers"],
          ["relu", "Insert ReLU in hidden layer"],
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

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem", marginBottom: "0.8rem" }}>
        <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
          Input x: {xValue.toFixed(1)}
          <input
            type="range"
            min="-4"
            max="4"
            step="0.1"
            value={xValue}
            onChange={(event) => setXValue(Number(event.target.value))}
            style={{ width: "100%", marginTop: "0.24rem" }}
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
            Two-layer network
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "0.45rem", alignItems: "center" }}>
            <div style={{ borderRadius: "10px", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.28)", padding: "0.7rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#93c5fd", fontWeight: 700 }}>Input</div>
              <div style={{ fontSize: "0.92rem", color: "#f8fafc", fontWeight: 700 }}>x = {xValue.toFixed(1)}</div>
            </div>
            <div style={{ color: "#64748b", fontWeight: 700 }}>-{'>'}</div>
            <div style={{ borderRadius: "10px", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.28)", padding: "0.7rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#c4b5fd", fontWeight: 700 }}>Hidden</div>
              <div style={{ fontSize: "0.78rem", color: "#e2e8f0" }}>z1 = 1.5x - 0.8</div>
              <div style={{ fontSize: "0.78rem", color: "#e2e8f0" }}>
                a1 = {mode === "linear" ? "z1" : "ReLU(z1)"}
              </div>
              <div style={{ fontSize: "0.86rem", color: "#f8fafc", fontWeight: 700, marginTop: "0.2rem" }}>
                a1 = {model.hiddenActivated.toFixed(2)}
              </div>
            </div>
            <div style={{ color: "#64748b", fontWeight: 700 }}>-{'>'}</div>
            <div style={{ borderRadius: "10px", background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.28)", padding: "0.7rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#5eead4", fontWeight: 700 }}>Output</div>
              <div style={{ fontSize: "0.78rem", color: "#e2e8f0" }}>a2 = 2.2a1 + 0.4</div>
              <div style={{ fontSize: "0.86rem", color: "#f8fafc", fontWeight: 700, marginTop: "0.2rem" }}>
                a2 = {model.output.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Collapse check
          </div>
          <p style={{ margin: "0 0 0.45rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            In the all-linear case, the full network is exactly equivalent to one line:
          </p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#bfdbfe", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.24)", borderRadius: "10px", padding: "0.6rem 0.7rem", marginBottom: "0.5rem" }}>
            y = ({model.collapsedW.toFixed(2)})x + ({model.collapsedB.toFixed(2)})
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            Collapsed output: <strong style={{ color: "var(--text-primary)" }}>{model.collapsedOutput.toFixed(2)}</strong>
            <br />
            Network output: <strong style={{ color: "var(--text-primary)" }}>{model.output.toFixed(2)}</strong>
          </div>
          <div style={{ marginTop: "0.55rem", padding: "0.55rem 0.65rem", borderRadius: "10px", background: model.matchesExactly ? "rgba(20,184,166,0.1)" : "rgba(245,158,11,0.1)", borderLeft: model.matchesExactly ? "3px solid #14b8a6" : "3px solid #f59e0b", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {model.matchesExactly
              ? "Exact match: stacked linear layers have not added expressive power."
              : "Mismatch appears: the ReLU changed the shape of the function, so the network no longer collapses to one straight line."}
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Why this matters
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>Depth without nonlinearity is just a more complicated way to write linear regression.</li>
          <li>Using sigmoid only at the output while hidden layers stay linear collapses the network to logistic regression.</li>
          <li>ReLU or other nonlinear activations are what let hidden layers create curved decision boundaries and richer internal representations.</li>
        </ul>
      </div>
    </div>
  );
}
