"use client";

import { useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function BiasVarianceWorkbench() {
  const [mode, setMode] = useState("diagnosis");
  const [baseline, setBaseline] = useState(10.6);
  const [trainError, setTrainError] = useState(10.8);
  const [cvError, setCvError] = useState(14.8);
  const [lambdaValue, setLambdaValue] = useState(2.0);

  const diagnosis = useMemo(() => {
    const biasGap = trainError - baseline;
    const varianceGap = cvError - trainError;

    let label = "Healthy balance";
    let recommendation = "Current train and cross-validation behavior looks reasonably aligned. Focus on product slices, error analysis, or next-level feature work.";

    if (biasGap > 3 && varianceGap > 3) {
      label = "High bias and high variance";
      recommendation = "The model is not fitting the training set well, and it generalizes even worse. Increase capacity or improve features first, then return to regularization and data coverage.";
    } else if (biasGap > 3) {
      label = "High bias";
      recommendation = "Training error is still far from the baseline you believe is achievable. Try a more expressive model, richer features, lower regularization, or more capable architecture.";
    } else if (varianceGap > 3) {
      label = "High variance";
      recommendation = "Training performance is acceptable relative to the baseline, but cross-validation falls behind. More data, stronger regularization, or simpler modeling choices are more likely to help.";
    }

    return {
      biasGap,
      varianceGap,
      label,
      recommendation,
    };
  }, [baseline, trainError, cvError]);

  const regularizationView = useMemo(() => {
    const normalized = clamp(lambdaValue / 10, 0, 1);
    const simulatedTrain = 6 + normalized * 10;
    const simulatedCv = 18 - normalized * 8 + normalized * normalized * 6;
    return {
      simulatedTrain,
      simulatedCv,
    };
  }, [lambdaValue]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        This workbench turns bias and variance into an engineering decision tool. Compare baseline, training, and cross-validation behavior, then map the gaps to the next action instead of guessing randomly.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        {[
          ["diagnosis", "Bias/variance diagnosis"],
          ["regularization", "Regularization view"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #8b5cf6" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(139,92,246,0.12)" : "var(--bg-tertiary)",
              color: mode === key ? "#fcd34d" : "var(--text-secondary)",
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

      {mode === "diagnosis" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
              <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
                Baseline or human-level error: {baseline.toFixed(1)}%
                <input type="range" min="0" max="20" step="0.1" value={baseline} onChange={(event) => setBaseline(Number(event.target.value))} style={{ width: "100%", marginTop: "0.24rem" }} />
              </label>
              <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
                Training error: {trainError.toFixed(1)}%
                <input type="range" min="0" max="25" step="0.1" value={trainError} onChange={(event) => setTrainError(Number(event.target.value))} style={{ width: "100%", marginTop: "0.24rem" }} />
              </label>
              <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
                Cross-validation error: {cvError.toFixed(1)}%
                <input type="range" min="0" max="30" step="0.1" value={cvError} onChange={(event) => setCvError(Number(event.target.value))} style={{ width: "100%", marginTop: "0.24rem" }} />
              </label>
            </div>

            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
              <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.28rem" }}>{diagnosis.label}</div>
              <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.6rem" }}>
                {[
                  ["Baseline", baseline, "#38bdf8"],
                  ["Train", trainError, "#fbbf24"],
                  ["CV", cvError, "#34d399"],
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.78rem", marginBottom: "0.2rem" }}>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{label}</span>
                      <span style={{ color }}>{Number(value).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "999px", background: "rgba(148,163,184,0.18)", overflow: "hidden" }}>
                      <div style={{ width: `${clamp(Number(value), 0, 30) / 30 * 100}%`, height: "100%", background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                Baseline -{">"} Train gap: <strong style={{ color: "#f8fafc" }}>{diagnosis.biasGap.toFixed(1)}%</strong>
                <br />
                Train -{">"} CV gap: <strong style={{ color: "#f8fafc" }}>{diagnosis.varianceGap.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
              Recommended next move
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              {diagnosis.recommendation}
            </p>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
              <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
                Lambda: {lambdaValue.toFixed(2)}
                <input type="range" min="0" max="10" step="0.1" value={lambdaValue} onChange={(event) => setLambdaValue(Number(event.target.value))} style={{ width: "100%", marginTop: "0.24rem" }} />
              </label>
              <p style={{ margin: "0.55rem 0 0", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Small lambda means weak regularization and more flexible fitting. Large lambda shrinks weights harder and can push the model toward underfitting.
              </p>
            </div>

            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
              <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.28rem" }}>Simulated effect of lambda</div>
              <div style={{ fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                Training error: <strong style={{ color: "#f8fafc" }}>{regularizationView.simulatedTrain.toFixed(1)}%</strong>
                <br />
                Cross-validation error: <strong style={{ color: "#f8fafc" }}>{regularizationView.simulatedCv.toFixed(1)}%</strong>
              </div>
              <div style={{ marginTop: "0.6rem", padding: "0.55rem 0.65rem", borderRadius: "10px", background: lambdaValue < 1.5 ? "rgba(34,197,94,0.1)" : lambdaValue > 6 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", borderLeft: lambdaValue < 1.5 ? "3px solid #22c55e" : lambdaValue > 6 ? "3px solid #ef4444" : "3px solid #f59e0b", fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                {lambdaValue < 1.5
                  ? "Very small lambda: flexible model, low training error, higher risk of variance."
                  : lambdaValue > 6
                    ? "Very large lambda: strong shrinkage, high risk of bias and underfitting."
                    : "Intermediate lambda: often where cross-validation performance is best, but you still choose it by validation rather than intuition alone."}
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
              Regularization rule
            </div>
            <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              <li>Lambda too small: the model may memorize training noise and show a large CV gap.</li>
              <li>Lambda too large: weights are forced too small and even training performance degrades.</li>
              <li>Choose lambda by cross-validation, not by aesthetics or a single default value.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
