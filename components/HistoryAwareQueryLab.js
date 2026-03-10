"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: "gpu",
    title: "Tech earnings follow-up",
    history: [
      "User: Tell me about Nvidia's Hopper architecture.",
      "Assistant: Hopper introduced major data-center GPU improvements and strong AI throughput gains.",
    ],
    followUp: "What is their revenue from it?",
    rewritten: "What revenue did Nvidia report that is associated with Hopper-era GPU demand?",
  },
  {
    id: "policy",
    title: "Policy clarification",
    history: [
      "User: Explain our enterprise cancellation policy.",
      "Assistant: Annual plans are non-cancellable after the first 30 days except contractually approved exceptions.",
    ],
    followUp: "Does that apply to startups too?",
    rewritten: "Does the enterprise annual-plan cancellation policy also apply to startup-tier accounts?",
  },
  {
    id: "medical",
    title: "Clinical trial thread",
    history: [
      "User: Summarize trial outcomes for Drug X in Stage 3.",
      "Assistant: Stage 3 showed efficacy improvement with notable adverse events in subgroup B.",
    ],
    followUp: "How severe were those?",
    rewritten: "How severe were adverse events for subgroup B in Drug X Stage 3 trial results?",
  },
];

export default function HistoryAwareQueryLab() {
  const [scenarioId, setScenarioId] = useState("gpu");
  const [rewriteEnabled, setRewriteEnabled] = useState(true);
  const [historyWindow, setHistoryWindow] = useState(2);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  const result = useMemo(() => {
    const effectiveHistory = scenario.history.slice(-historyWindow);
    const queryForRetrieval = rewriteEnabled ? scenario.rewritten : scenario.followUp;
    const estimatedRecall = rewriteEnabled
      ? 84 + Math.min(historyWindow, 2) * 4
      : 38 + Math.min(historyWindow, 2) * 5;
    const risk = rewriteEnabled ? "Low-Medium" : "High";
    const note = rewriteEnabled
      ? "Standalone query likely retrieves the correct entity-specific chunks."
      : "Ambiguous pronouns may retrieve unrelated context.";

    return { effectiveHistory, queryForRetrieval, estimatedRecall, risk, note };
  }, [scenario, rewriteEnabled, historyWindow]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.83rem", color: "var(--text-secondary)" }}>
        Test how query rewriting changes retrieval quality in multi-turn conversations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "0.7rem", background: "var(--bg-tertiary)" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.45rem" }}>
            Scenario
          </div>
          <select
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.35rem 0.45rem",
              borderRadius: "0.45rem",
              border: "1px solid var(--glass-border)",
              background: "transparent",
              color: "var(--text-primary)",
              marginBottom: "0.55rem",
            }}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#111" }}>
                {s.title}
              </option>
            ))}
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.45rem" }}>
            <input type="checkbox" checked={rewriteEnabled} onChange={(e) => setRewriteEnabled(e.target.checked)} />
            Enable query rewriting
          </label>

          <label style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>
            History window: {historyWindow} turn(s)
          </label>
          <input
            type="range"
            min={1}
            max={2}
            step={1}
            value={historyWindow}
            onChange={(e) => setHistoryWindow(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "0.7rem", background: "var(--bg-tertiary)" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            Conversation Context
          </div>
          {result.effectiveHistory.map((line, idx) => (
            <div key={idx} style={{ fontSize: "0.73rem", color: "var(--text-secondary)", marginBottom: "0.25rem", lineHeight: 1.45 }}>
              {line}
            </div>
          ))}
          <div style={{ marginTop: "0.45rem", padding: "0.45rem", borderRadius: "0.4rem", border: "1px solid var(--glass-border)", fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Follow-up:</strong> {scenario.followUp}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "0.7rem", background: "var(--bg-tertiary)" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            Retrieval Query
          </div>
          <div style={{ fontSize: "0.74rem", color: "#c7d2fe", lineHeight: 1.5, marginBottom: "0.55rem" }}>
            {result.queryForRetrieval}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.45rem", padding: "0.4rem" }}>
              <div style={{ fontSize: "0.66rem", color: "var(--text-tertiary)" }}>Estimated Recall</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#22c55e" }}>{result.estimatedRecall}%</div>
            </div>
            <div style={{ border: "1px solid var(--glass-border)", borderRadius: "0.45rem", padding: "0.4rem" }}>
              <div style={{ fontSize: "0.66rem", color: "var(--text-tertiary)" }}>Ambiguity Risk</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: result.risk === "High" ? "#ef4444" : "#f59e0b" }}>{result.risk}</div>
            </div>
          </div>

          <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
            {result.note}
          </div>
        </div>
      </div>
    </div>
  );
}
