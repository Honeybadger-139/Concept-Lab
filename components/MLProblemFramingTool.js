"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: "house_price",
    question: "Predict house sale price from size, bedrooms, and location features.",
    answer: "supervised_regression",
    why: "Target is continuous numeric value, and historical labelled sales data exists.",
  },
  {
    id: "tumor_detection",
    question: "Classify tumors as benign or malignant from medical features.",
    answer: "supervised_classification",
    why: "Output is a discrete class label with available labelled examples.",
  },
  {
    id: "news_grouping",
    question: "Group thousands of news articles into event clusters without labels.",
    answer: "unsupervised_clustering",
    why: "No labels are provided; goal is structure discovery by similarity.",
  },
  {
    id: "fraud_outlier",
    question: "Flag unusual card transactions not matching normal spending patterns.",
    answer: "unsupervised_anomaly",
    why: "Rare/novel fraud patterns require learning normal baseline and detecting deviations.",
  },
  {
    id: "ad_bidding",
    question: "Learn real-time bidding strategy over repeated actions with delayed reward.",
    answer: "reinforcement_learning",
    why: "Sequential decision process with reward feedback is best framed as RL.",
  },
];

const OPTIONS = [
  { id: "supervised_regression", label: "Supervised (Regression)" },
  { id: "supervised_classification", label: "Supervised (Classification)" },
  { id: "unsupervised_clustering", label: "Unsupervised (Clustering)" },
  { id: "unsupervised_anomaly", label: "Unsupervised (Anomaly Detection)" },
  { id: "reinforcement_learning", label: "Reinforcement Learning" },
];

export default function MLProblemFramingTool() {
  const [currentId, setCurrentId] = useState(SCENARIOS[0].id);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === currentId) || SCENARIOS[0],
    [currentId],
  );

  const status = selected
    ? selected === scenario.answer
      ? "correct"
      : "wrong"
    : "idle";

  const submitAnswer = () => {
    if (!selected) return;

    setScore((prev) => ({
      correct: prev.correct + (selected === scenario.answer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextScenario = () => {
    const index = SCENARIOS.findIndex((item) => item.id === currentId);
    const next = SCENARIOS[(index + 1) % SCENARIOS.length];
    setCurrentId(next.id);
    setSelected("");
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Practice framing ML problems correctly before choosing models or writing code.
      </p>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.35rem", fontWeight: 700 }}>
          Scenario
        </div>
        <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "0.7rem" }}>{scenario.question}</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          {OPTIONS.map((option) => {
            const active = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelected(option.id)}
                style={{
                  borderRadius: "9px",
                  border: active ? "1px solid #3b82f6" : "1px solid var(--glass-border)",
                  background: active ? "rgba(59,130,246,0.14)" : "transparent",
                  color: active ? "#93c5fd" : "var(--text-secondary)",
                  padding: "0.45rem 0.55rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.7rem" }}>
        <button
          type="button"
          onClick={submitAnswer}
          disabled={!selected}
          style={{
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            padding: "0.4rem 0.75rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.6,
          }}
        >
          Check answer
        </button>

        <button
          type="button"
          onClick={nextScenario}
          style={{
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
            background: "transparent",
            color: "var(--text-secondary)",
            padding: "0.4rem 0.75rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Next scenario
        </button>

        <div style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-tertiary)", alignSelf: "center" }}>
          Score: {score.correct}/{score.total}
        </div>
      </div>

      {status !== "idle" && (
        <div style={{
          border: `1px solid ${status === "correct" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
          background: status === "correct" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)",
          borderRadius: "10px",
          padding: "0.65rem 0.75rem",
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          lineHeight: 1.45,
        }}>
          <strong style={{ color: status === "correct" ? "#22c55e" : "#f87171" }}>
            {status === "correct" ? "Correct." : "Not quite."}
          </strong>{" "}
          {scenario.why}
        </div>
      )}
    </div>
  );
}
