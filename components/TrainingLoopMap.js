"use client";

import { useState } from "react";

const STEPS = [
  {
    id: "architecture",
    title: "1. Specify architecture",
    detail: "Define the layers, unit counts, and activations. This tells TensorFlow what function family and parameters exist.",
    code: "model = Sequential([Dense(25, activation='sigmoid'), Dense(15, activation='sigmoid'), Dense(1, activation='sigmoid')])",
    color: "#3b82f6",
  },
  {
    id: "compile",
    title: "2. Compile with loss",
    detail: "Choose the loss function that matches the task. For binary classification, TensorFlow uses BinaryCrossentropy to measure error.",
    code: "model.compile(loss=BinaryCrossentropy())",
    color: "#8b5cf6",
  },
  {
    id: "fit",
    title: "3. Fit to data",
    detail: "Run repeated training passes. TensorFlow performs forward propagation, loss computation, backpropagation, and parameter updates inside fit().",
    code: "model.fit(X, y, epochs=100)",
    color: "#14b8a6",
  },
];

export default function TrainingLoopMap() {
  const [active, setActive] = useState("architecture");
  const [epochs, setEpochs] = useState(100);
  const [taskType, setTaskType] = useState("binary");

  const activeStep = STEPS.find((step) => step.id === active) || STEPS[0];
  const lossName = taskType === "binary" ? "BinaryCrossentropy" : "MeanSquaredError";
  const targetMeaning = taskType === "binary" ? "Output estimates probability that y = 1." : "Output estimates a continuous number that may be positive or negative.";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        This map ties the TensorFlow API back to the training math: define the network, choose the loss, then let fit() run the repeated optimization loop.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActive(step.id)}
                style={{
                  textAlign: "left",
                  borderRadius: "10px",
                  border: active === step.id ? `1px solid ${step.color}` : "1px solid rgba(148,163,184,0.18)",
                  background: active === step.id ? `${step.color}18` : "rgba(15,23,42,0.8)",
                  color: "#f8fafc",
                  padding: "0.65rem 0.75rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.82rem", color: active === step.id ? step.color : "#e2e8f0", fontWeight: 700, marginBottom: "0.15rem" }}>{step.title}</div>
                <div style={{ fontSize: "0.77rem", color: "#cbd5e1", lineHeight: 1.45 }}>{step.detail}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.25rem" }}>{activeStep.title}</div>
          <p style={{ margin: "0 0 0.55rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{activeStep.detail}</p>
          <pre style={{ margin: "0 0 0.65rem", whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#fcd34d", lineHeight: 1.55, background: "rgba(15,23,42,0.55)", borderRadius: "10px", border: "1px solid var(--glass-border)", padding: "0.65rem 0.75rem" }}>{activeStep.code}</pre>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginBottom: "0.55rem" }}>
            <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Task type
              <select value={taskType} onChange={(event) => setTaskType(event.target.value)} style={{ width: "100%", marginTop: "0.22rem", padding: "0.36rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                <option value="binary">Binary classification</option>
                <option value="regression">Regression</option>
              </select>
            </label>
            <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Epochs: {epochs}
              <input type="range" min="1" max="300" step="1" value={epochs} onChange={(event) => setEpochs(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
            </label>
          </div>

          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(20,184,166,0.08)", borderLeft: "3px solid #14b8a6", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "#5eead4" }}>Current setup:</strong> loss = {lossName}. {targetMeaning} Training runs for {epochs} epoch{epochs === 1 ? "" : "s"}.
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Why this matters
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>The API is short, but the model still follows the same logic as logistic regression: specify the function, define the error, then minimize it.</li>
          <li>Backpropagation is hidden inside fit(), but understanding that hidden step is what lets you debug training failures intelligently.</li>
          <li>Loss choice is not cosmetic; it changes what the model is encouraged to care about during training.</li>
        </ul>
      </div>
    </div>
  );
}
