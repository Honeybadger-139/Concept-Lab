"use client";

import { useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const SCENARIOS = {
  high_bias: {
    label: "High Bias Pattern",
    trainBase: 24,
    trainFloor: 16,
    cvBase: 28,
    cvFloor: 19,
    recommendation:
      "Model is still too simple. Prioritize model capacity, better features, or lower regularization before launching a major data-collection effort.",
  },
  high_variance: {
    label: "High Variance Pattern",
    trainBase: 9,
    trainFloor: 6,
    cvBase: 26,
    cvFloor: 12,
    recommendation:
      "Model already fits training data well but fails to generalize. More data, stronger regularization, and better data hygiene are likely high-ROI next moves.",
  },
  balanced: {
    label: "Healthy Learning Pattern",
    trainBase: 14,
    trainFloor: 9,
    cvBase: 17,
    cvFloor: 11,
    recommendation:
      "Generalization is reasonably aligned. Focus on product slices, calibration, and targeted error-analysis improvements rather than drastic architecture changes.",
  },
};

export default function LearningCurveDecisionLab() {
  const [scenario, setScenario] = useState("high_variance");
  const [trainSize, setTrainSize] = useState(60);
  const [regularization, setRegularization] = useState(3.0);

  const curve = useMemo(() => {
    const config = SCENARIOS[scenario];
    const sizeRatio = clamp((trainSize - 20) / 80, 0, 1);
    const lambdaRatio = clamp(regularization / 10, 0, 1);

    const trainError =
      config.trainBase - (config.trainBase - config.trainFloor) * sizeRatio + lambdaRatio * 2.0;
    const cvError =
      config.cvBase - (config.cvBase - config.cvFloor) * sizeRatio + Math.abs(lambdaRatio - 0.35) * 3.0;

    const gap = cvError - trainError;
    return { trainError, cvError, gap, config };
  }, [scenario, trainSize, regularization]);

  const trainPct = clamp((curve.trainError / 35) * 100, 2, 100);
  const cvPct = clamp((curve.cvError / 35) * 100, 2, 100);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Learning curves are decision tools, not pretty charts. They tell us whether more data is likely to help, or whether we should change model capacity and regularization first.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {Object.entries(SCENARIOS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenario(key)}
            style={{
              borderRadius: "999px",
              border: scenario === key ? "1px solid #3b82f6" : "1px solid var(--glass-border)",
              background: scenario === key ? "rgba(59,130,246,0.12)" : "var(--bg-tertiary)",
              color: scenario === key ? "#93c5fd" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.77rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Training examples (relative scale): {trainSize}
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={trainSize}
              onChange={(event) => setTrainSize(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
            Regularization intensity: {regularization.toFixed(1)}
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={regularization}
              onChange={(event) => setRegularization(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Current signal</div>
          <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.55rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.78rem", marginBottom: "0.2rem" }}>
                <span style={{ color: "#cbd5e1", fontWeight: 700 }}>J_train</span>
                <span style={{ color: "#60a5fa" }}>{curve.trainError.toFixed(1)}%</span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(148,163,184,0.2)", overflow: "hidden" }}>
                <div style={{ width: String(trainPct) + "%", height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.78rem", marginBottom: "0.2rem" }}>
                <span style={{ color: "#cbd5e1", fontWeight: 700 }}>J_cv</span>
                <span style={{ color: "#34d399" }}>{curve.cvError.toFixed(1)}%</span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(148,163,184,0.2)", overflow: "hidden" }}>
                <div style={{ width: String(cvPct) + "%", height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)" }} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Generalization gap (J_cv - J_train): <strong style={{ color: "#f8fafc" }}>{curve.gap.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Recommended move
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {curve.config.recommendation}
        </p>
      </div>
    </div>
  );
}
