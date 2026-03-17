"use client";

import { useMemo, useState } from "react";

const TARGETS = {
  binary: {
    label: "Binary classification",
    outputRange: "0 to 1",
    outputChoice: "Sigmoid",
    why: "The output should behave like a probability that y = 1.",
  },
  regression: {
    label: "Regression (positive or negative)",
    outputRange: "negative to positive infinity",
    outputChoice: "Linear",
    why: "The model must be able to predict values above and below zero.",
  },
  nonnegative: {
    label: "Regression (non-negative only)",
    outputRange: "0 to positive infinity",
    outputChoice: "ReLU",
    why: "Targets like price or count should not go below zero.",
  },
};

const HIDDEN_CHOICES = {
  sigmoid: {
    title: "Sigmoid hidden layer",
    note: "Useful historically and still correct mathematically, but slower to compute and flatter at both extremes.",
    gradientView: "Small gradients when z is very negative or very positive.",
  },
  relu: {
    title: "ReLU hidden layer",
    note: "Default modern choice for hidden layers because it is cheap to compute and only flat on one side.",
    gradientView: "Gradient is strong for positive z and zero only in the inactive region.",
  },
};

export default function ActivationDecisionLab() {
  const [targetType, setTargetType] = useState("binary");
  const [hiddenType, setHiddenType] = useState("relu");
  const [zValue, setZValue] = useState(2);

  const hiddenSummary = HIDDEN_CHOICES[hiddenType];
  const outputSummary = TARGETS[targetType];

  const activations = useMemo(() => {
    const sigmoid = 1 / (1 + Math.exp(-zValue));
    const relu = Math.max(0, zValue);
    const linear = zValue;
    return { sigmoid, relu, linear };
  }, [zValue]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        This lab turns the activation-function guidance into a design decision: choose the output activation from the target range, then use ReLU as the default hidden-layer activation unless you have a strong reason not to.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Choose the prediction target
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {Object.entries(TARGETS).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTargetType(key)}
                style={{
                  textAlign: "left",
                  borderRadius: "10px",
                  border: targetType === key ? "1px solid #10b981" : "1px solid var(--glass-border)",
                  background: targetType === key ? "rgba(16,185,129,0.1)" : "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  padding: "0.6rem 0.7rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: targetType === key ? "#34d399" : "var(--text-primary)" }}>{value.label}</div>
                <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{value.why}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.25rem" }}>Output-layer recommendation</div>
          <p style={{ margin: "0 0 0.35rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Target range: {outputSummary.outputRange}
          </p>
          <div style={{ display: "inline-block", borderRadius: "999px", border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.12)", color: "#34d399", padding: "0.28rem 0.65rem", fontSize: "0.76rem", fontWeight: 700, marginBottom: "0.45rem" }}>
            Use {outputSummary.outputChoice} at the output layer
          </div>
          <p style={{ margin: 0, fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>{outputSummary.why}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Hidden-layer default
          </div>
          <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.55rem" }}>
            {Object.entries(HIDDEN_CHOICES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setHiddenType(key)}
                style={{
                  borderRadius: "999px",
                  border: hiddenType === key ? "1px solid #f59e0b" : "1px solid var(--glass-border)",
                  background: hiddenType === key ? "rgba(245,158,11,0.12)" : "var(--bg-secondary)",
                  color: hiddenType === key ? "#fcd34d" : "var(--text-secondary)",
                  padding: "0.32rem 0.7rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {value.title}
              </button>
            ))}
          </div>
          <p style={{ margin: "0 0 0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{hiddenSummary.note}</p>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}><strong style={{ color: "var(--text-primary)" }}>Gradient view:</strong> {hiddenSummary.gradientView}</p>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Activation values for current z
          </div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            z value: {zValue.toFixed(1)}
            <input type="range" min="-8" max="8" step="0.1" value={zValue} onChange={(event) => setZValue(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.45rem" }}>
            <div style={{ borderRadius: "10px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", padding: "0.55rem 0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#a5b4fc", fontWeight: 700 }}>Sigmoid</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{activations.sigmoid.toFixed(4)}</div>
            </div>
            <div style={{ borderRadius: "10px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", padding: "0.55rem 0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#fcd34d", fontWeight: 700 }}>ReLU</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{activations.relu.toFixed(4)}</div>
            </div>
            <div style={{ borderRadius: "10px", background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.25)", padding: "0.55rem 0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#5eead4", fontWeight: 700 }}>Linear</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{activations.linear.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Practical rule of thumb
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>Output layer: choose the activation that matches the legal range of the target y.</li>
          <li>Hidden layers: default to ReLU unless you have a strong reason to test another option.</li>
          <li>Sigmoid remains natural for binary classification outputs, not as the default everywhere in the network.</li>
        </ul>
      </div>
    </div>
  );
}
