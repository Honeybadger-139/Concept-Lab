"use client";

import { useMemo, useState } from "react";

const RETRIEVAL_PRESETS = {
  high: {
    label: "High",
    description: "Top chunks are highly relevant and complete.",
    baseRisk: 18,
  },
  medium: {
    label: "Medium",
    description: "Some relevant chunks, but partial coverage.",
    baseRisk: 42,
  },
  low: {
    label: "Low",
    description: "Weak matches or missing evidence.",
    baseRisk: 72,
  },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function RAGGuardrailsStudio() {
  const [retrievalQuality, setRetrievalQuality] = useState("medium");
  const [citationsRequired, setCitationsRequired] = useState(true);
  const [abstainEnabled, setAbstainEnabled] = useState(true);
  const [guardrailLevel, setGuardrailLevel] = useState(2); // 1 relaxed, 2 balanced, 3 strict

  const model = useMemo(() => {
    const preset = RETRIEVAL_PRESETS[retrievalQuality];

    let risk = preset.baseRisk;
    if (citationsRequired) risk -= 10;
    if (abstainEnabled) risk -= 14;
    risk -= (guardrailLevel - 1) * 8;
    risk = clamp(risk, 6, 95);

    const groundedness = clamp(100 - risk + (citationsRequired ? 6 : 0), 5, 99);

    let outcome = "Answer with explicit confidence caveat.";
    if (retrievalQuality === "low" && abstainEnabled) {
      outcome = "Abstain and ask follow-up for missing evidence.";
    } else if (retrievalQuality === "low" && !abstainEnabled) {
      outcome = "High chance of overconfident unsupported answer.";
    } else if (retrievalQuality === "high" && citationsRequired) {
      outcome = "Grounded answer with source references.";
    }

    const recommendation = [];
    if (!citationsRequired) recommendation.push("Require source citations for every key claim.");
    if (!abstainEnabled) recommendation.push("Enable abstention when no chunk passes threshold.");
    if (guardrailLevel === 1) recommendation.push("Tighten system prompt constraints and output schema.");
    if (retrievalQuality !== "high") recommendation.push("Improve retrieval first (chunking, filters, threshold, reranking).");

    return {
      risk,
      groundedness,
      outcome,
      recommendation: recommendation.length ? recommendation : ["Current setup is reasonable; validate on eval set before shipping."],
    };
  }, [retrievalQuality, citationsRequired, abstainEnabled, guardrailLevel]);

  const riskColor =
    model.risk >= 70 ? "#ef4444" : model.risk >= 40 ? "#f59e0b" : "#22c55e";

  const sampleAnswer =
    retrievalQuality === "low" && abstainEnabled
      ? "I do not have enough reliable evidence in the retrieved documents to answer this yet. Please provide a narrower question or additional sources."
      : "Based on the retrieved policy documents, annual plans are non-cancellable after 30 days [policy_v3.2_p14]. Exceptions require finance approval [billing_sop_p3].";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Configure answer-stage guardrails and see how retrieval quality plus generation policy changes
        hallucination risk.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "0.85rem",
        }}
      >
        <div
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            background: "var(--bg-tertiary)",
          }}
        >
          <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            Guardrail Controls
          </div>

          <div style={{ marginBottom: "0.6rem" }}>
            <label style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", display: "block", marginBottom: "0.3rem" }}>
              Retrieval Quality
            </label>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {Object.entries(RETRIEVAL_PRESETS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setRetrievalQuality(key)}
                  style={{
                    flex: 1,
                    borderRadius: "999px",
                    border:
                      retrievalQuality === key
                        ? "1px solid #d97706"
                        : "1px solid var(--glass-border)",
                    background:
                      retrievalQuality === key ? "rgba(217, 119, 6,0.2)" : "transparent",
                    color: "var(--text-primary)",
                    fontSize: "0.72rem",
                    padding: "0.25rem 0.4rem",
                    cursor: "pointer",
                  }}
                >
                  {value.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.35rem", fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
              {RETRIEVAL_PRESETS[retrievalQuality].description}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.4rem", marginBottom: "0.65rem" }}>
            <label style={{ fontSize: "0.74rem", color: "var(--text-secondary)", display: "flex", gap: "0.45rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={citationsRequired}
                onChange={(e) => setCitationsRequired(e.target.checked)}
              />
              Require citations in final answer
            </label>
            <label style={{ fontSize: "0.74rem", color: "var(--text-secondary)", display: "flex", gap: "0.45rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={abstainEnabled}
                onChange={(e) => setAbstainEnabled(e.target.checked)}
              />
              Enable abstention on weak evidence
            </label>
          </div>

          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", display: "block", marginBottom: "0.25rem" }}>
              Prompt Guardrail Strength: {guardrailLevel === 1 ? "Relaxed" : guardrailLevel === 2 ? "Balanced" : "Strict"}
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={guardrailLevel}
              onChange={(e) => setGuardrailLevel(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            background: "var(--bg-tertiary)",
          }}
        >
          <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            Risk Snapshot
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.45rem",
              marginBottom: "0.6rem",
            }}
          >
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.45rem", padding: "0.45rem" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Hallucination Risk</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: riskColor }}>{model.risk}%</div>
            </div>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.45rem", padding: "0.45rem" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Groundedness</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#22c55e" }}>{model.groundedness}%</div>
            </div>
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            <strong style={{ color: "var(--text-primary)" }}>Expected behavior:</strong> {model.outcome}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
            {model.recommendation.map((item, idx) => (
              <div key={idx}>- {item}</div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          border: "1px solid rgba(217, 119, 6,0.28)",
          background: "rgba(217, 119, 6,0.08)",
          borderRadius: "var(--radius-sm)",
          padding: "0.65rem 0.75rem",
        }}
      >
        <div style={{ fontSize: "0.72rem", color: "#a5b4fc", fontWeight: 700, marginBottom: "0.25rem" }}>
          Sample Output
        </div>
        <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {sampleAnswer}
        </div>
      </div>
    </div>
  );
}
