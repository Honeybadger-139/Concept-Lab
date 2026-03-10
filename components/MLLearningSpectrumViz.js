"use client";

import { useMemo, useState } from "react";

const MODES = [
  {
    id: "supervised",
    title: "Supervised Learning",
    color: "#3b82f6",
    slogan: "Learn from labelled examples (X -> Y).",
    when: [
      "You have historical data with reliable labels.",
      "You need measurable prediction quality in production.",
      "You can define explicit targets (price, class, risk score).",
    ],
    limits: [
      "Label collection can be expensive and slow.",
      "Label drift causes silent performance decay.",
    ],
    examples: [
      "House price regression",
      "Tumor benign/malignant classification",
      "Ad click-through prediction",
    ],
  },
  {
    id: "unsupervised",
    title: "Unsupervised Learning",
    color: "#f59e0b",
    slogan: "Discover hidden structure without labels.",
    when: [
      "You have lots of raw data but no labels.",
      "You need segmentation or pattern discovery.",
      "You are exploring unknown behavior in a new domain.",
    ],
    limits: [
      "Evaluation is harder than supervised setups.",
      "Clusters can be unstable across parameter settings.",
    ],
    examples: [
      "Customer segmentation",
      "News clustering",
      "Anomaly detection in transactions",
    ],
  },
  {
    id: "reinforcement",
    title: "Reinforcement Learning",
    color: "#10b981",
    slogan: "Learn by acting and receiving rewards.",
    when: [
      "Decision quality depends on sequential actions.",
      "There is a clear reward signal over time.",
      "Simulation or controlled exploration is feasible.",
    ],
    limits: [
      "Sample efficiency and safety are major challenges.",
      "Reward mis-specification can produce bad behavior.",
    ],
    examples: [
      "Game-playing agents",
      "Dynamic bidding policies",
      "Robotics control",
    ],
  },
];

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

export default function MLLearningSpectrumViz() {
  const [active, setActive] = useState("supervised");
  const [labelAvailability, setLabelAvailability] = useState(4);
  const [taskSequential, setTaskSequential] = useState(2);
  const [patternUnknown, setPatternUnknown] = useState(3);

  const activeMode = MODES.find((mode) => mode.id === active) || MODES[0];

  const recommendation = useMemo(() => {
    let supervised = labelAvailability * 2 + (6 - patternUnknown);
    let unsupervised = patternUnknown * 2 + (6 - labelAvailability);
    let reinforcement = taskSequential * 2 + Math.floor((patternUnknown + 1) / 2);

    if (labelAvailability <= 2) supervised -= 2;
    if (taskSequential >= 4) reinforcement += 2;

    const scores = { supervised, unsupervised, reinforcement };
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];

    return {
      winner,
      scores,
      confidence: clamp(sorted[0][1] - sorted[1][1], 0, 8),
    };
  }, [labelAvailability, taskSequential, patternUnknown]);

  const recommendedMode = MODES.find((m) => m.id === recommendation.winner) || MODES[0];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Compare learning paradigms and use the framing controls to estimate which approach best fits a problem.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setActive(mode.id)}
            style={{
              borderRadius: "999px",
              border: active === mode.id ? `1px solid ${mode.color}` : "1px solid var(--glass-border)",
              background: active === mode.id ? `${mode.color}1f` : "var(--bg-tertiary)",
              color: active === mode.id ? mode.color : "var(--text-secondary)",
              padding: "0.35rem 0.7rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {mode.title}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.75rem", marginBottom: "0.85rem" }}>
        <div style={{ fontSize: "0.9rem", color: activeMode.color, fontWeight: 700, marginBottom: "0.25rem" }}>{activeMode.title}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.6rem" }}>{activeMode.slogan}</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>
              Best when
            </div>
            <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {activeMode.when.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>
              Limits
            </div>
            <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {activeMode.limits.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>
              Examples
            </div>
            <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {activeMode.examples.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "rgba(15,23,42,0.55)", padding: "0.75rem" }}>
        <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.55rem" }}>Problem framing helper</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Label availability: {labelAvailability}
            <input type="range" min={1} max={5} value={labelAvailability} onChange={(e) => setLabelAvailability(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Sequential decisions needed: {taskSequential}
            <input type="range" min={1} max={5} value={taskSequential} onChange={(e) => setTaskSequential(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Unknown pattern discovery needed: {patternUnknown}
            <input type="range" min={1} max={5} value={patternUnknown} onChange={(e) => setPatternUnknown(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginTop: "0.65rem", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
          Recommended starting point: <strong style={{ color: recommendedMode.color }}>{recommendedMode.title}</strong>
          <br />
          Confidence gap: {recommendation.confidence}/8 (higher means clearer fit).
        </div>
      </div>
    </div>
  );
}
