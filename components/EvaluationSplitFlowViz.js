"use client";

import { useMemo, useState } from "react";

const MODELS = [
  { label: "Degree 1", cvError: 0.26, testError: 0.27 },
  { label: "Degree 2", cvError: 0.14, testError: 0.15 },
  { label: "Degree 4", cvError: 0.19, testError: 0.21 },
];

export default function EvaluationSplitFlowViz() {
  const [mode, setMode] = useState("three-way");
  const [trainShare, setTrainShare] = useState(60);
  const [cvShare, setCvShare] = useState(20);

  const testShare = 100 - trainShare - (mode === "three-way" ? cvShare : 0);

  const selectedModel = useMemo(() => {
    return [...MODELS].sort((a, b) => a.cvError - b.cvError)[0];
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Evaluation is not just about measuring one score. You need to separate parameter fitting, model selection, and final reporting so the number you trust has not already been used to make design decisions.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["two-way", "Train/Test split"],
          ["three-way", "Train/CV/Test split"],
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
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Training split: {trainShare}%
            <input
              type="range"
              min={mode === "three-way" ? "50" : "60"}
              max={mode === "three-way" ? "80" : "90"}
              step="5"
              value={trainShare}
              onChange={(event) => {
                const nextTrain = Number(event.target.value);
                setTrainShare(nextTrain);
                if (mode === "three-way" && nextTrain + cvShare > 90) {
                  setCvShare(90 - nextTrain);
                }
              }}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
          {mode === "three-way" ? (
            <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
              Cross-validation split: {cvShare}%
              <input
                type="range"
                min="10"
                max={100 - trainShare - 10}
                step="5"
                value={cvShare}
                onChange={(event) => setCvShare(Number(event.target.value))}
                style={{ width: "100%", marginTop: "0.24rem" }}
              />
            </label>
          ) : null}
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Dataset governance</div>
          <div style={{ display: "flex", width: "100%", height: "16px", borderRadius: "999px", overflow: "hidden", marginBottom: "0.5rem", background: "rgba(148,163,184,0.12)" }}>
            <div style={{ width: `${trainShare}%`, background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
            {mode === "three-way" ? <div style={{ width: `${cvShare}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} /> : null}
            <div style={{ width: `${testShare}%`, background: "linear-gradient(90deg, #10b981, #34d399)" }} />
          </div>
          <div style={{ display: "grid", gap: "0.38rem", fontSize: "0.79rem", color: "#cbd5e1" }}>
            <div><strong style={{ color: "#93c5fd" }}>Train:</strong> fit model parameters only.</div>
            {mode === "three-way" ? <div><strong style={{ color: "#fcd34d" }}>CV:</strong> choose degree, lambda, architecture, or threshold.</div> : null}
            <div><strong style={{ color: "#34d399" }}>Test:</strong> report final unbiased estimate only after design choices are locked.</div>
          </div>
        </div>
      </div>

      {mode === "three-way" ? (
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem", marginBottom: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Model selection example
          </div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {MODELS.map((model) => {
              const isSelected = model.label === selectedModel.label;
              return (
                <div key={model.label} style={{ borderRadius: "10px", border: isSelected ? "1px solid rgba(245,158,11,0.34)" : "1px solid var(--glass-border)", background: isSelected ? "rgba(245,158,11,0.1)" : "var(--bg-secondary)", padding: "0.55rem 0.65rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.79rem" }}>
                    <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{model.label}</span>
                    <span style={{ color: isSelected ? "#fcd34d" : "var(--text-secondary)" }}>CV error {model.cvError.toFixed(2)}</span>
                  </div>
                  <div style={{ marginTop: "0.2rem", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                    Test error after selection: {model.testError.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ margin: "0.55rem 0 0", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Choose the model using cross-validation error, then use the test set once for final reporting. If you use the test set to choose the winner, that score becomes optimistic.
          </p>
        </div>
      ) : null}

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Core rule
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>Training performance tells you how well the model fit known data.</li>
          <li>Cross-validation performance guides design decisions.</li>
          <li>Test performance should stay untouched until you want one fair estimate of generalization.</li>
        </ul>
      </div>
    </div>
  );
}
