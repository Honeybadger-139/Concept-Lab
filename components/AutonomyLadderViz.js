"use client";

import { useMemo, useState } from "react";

const LEVELS = [
  {
    id: 0,
    title: "L0 - Deterministic workflow",
    architecture: "Code-only routing, no LLM control over execution.",
    decisionRights: "Application code decides every branch.",
    useCases: "Compliance checks, fixed transformations, strict approval flows.",
    risks: "Low flexibility for ambiguous requests.",
    guardrails: "Unit tests, contract tests, deterministic runbooks.",
    metrics: { flexibility: 1, predictability: 5, safetyEffort: 1, runtimeCost: 1 },
  },
  {
    id: 1,
    title: "L1 - Single-call assistant",
    architecture: "One prompt in, one model answer out.",
    decisionRights: "LLM writes text, app controls all actions.",
    useCases: "Drafting, summarization, low-risk support text.",
    risks: "Hallucination and style drift.",
    guardrails: "Prompt templates, output validators, safe fallback messaging.",
    metrics: { flexibility: 2, predictability: 4, safetyEffort: 2, runtimeCost: 2 },
  },
  {
    id: 2,
    title: "L2 - Structured chain",
    architecture: "Fixed multi-step sequence (retrieve -> compose -> answer).",
    decisionRights: "LLM reasons inside steps; route is deterministic.",
    useCases: "RAG FAQ, report generation, standard ticket triage.",
    risks: "Breaks on out-of-distribution edge cases.",
    guardrails: "Step-level metrics, strict schemas, deterministic retries.",
    metrics: { flexibility: 3, predictability: 4, safetyEffort: 2, runtimeCost: 3 },
  },
  {
    id: 3,
    title: "L3 - Tool-aware assistant",
    architecture: "LLM can choose among approved tools under policy limits.",
    decisionRights: "Model decides which tool, app controls permissions.",
    useCases: "Data lookup, calculator calls, API-backed support workflows.",
    risks: "Wrong tool selection or over-calling tools.",
    guardrails: "Tool schema constraints, timeout budgets, audit logs.",
    metrics: { flexibility: 4, predictability: 3, safetyEffort: 3, runtimeCost: 3 },
  },
  {
    id: 4,
    title: "L4 - Agent loop",
    architecture: "Plan -> act -> observe -> revise loop with bounded retries.",
    decisionRights: "Model chooses iterative actions with graph guards.",
    useCases: "Complex troubleshooting, research workflows, multi-step reasoning.",
    risks: "Runaway loops, latency and cost spikes.",
    guardrails: "Loop counters, confidence thresholds, escalation nodes.",
    metrics: { flexibility: 5, predictability: 2, safetyEffort: 4, runtimeCost: 4 },
  },
  {
    id: 5,
    title: "L5 - Multi-agent orchestration",
    architecture: "Specialized agents delegate work and merge outcomes.",
    decisionRights: "Distributed decision-making across agent roles.",
    useCases: "Long-horizon tasks, deep research, program-level automation.",
    risks: "Highest complexity and hardest debugging surface.",
    guardrails: "Role contracts, policy engine, centralized tracing.",
    metrics: { flexibility: 5, predictability: 1, safetyEffort: 5, runtimeCost: 5 },
  },
];

function MetricBar({ label, value, inverted = false }) {
  const normalized = inverted ? 6 - value : value;
  const width = `${Math.max(5, Math.min(100, normalized * 20))}%`;

  return (
    <div style={{ marginBottom: "0.45rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-tertiary)", marginBottom: "0.2rem" }}>
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div style={{ width: "100%", height: "7px", borderRadius: "999px", background: "rgba(148,163,184,0.2)", overflow: "hidden" }}>
        <div
          style={{
            width,
            height: "100%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #38bdf8, #818cf8)",
          }}
        />
      </div>
    </div>
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function AutonomyLadderViz() {
  const [selectedLevel, setSelectedLevel] = useState(2);
  const [taskAmbiguity, setTaskAmbiguity] = useState(3);
  const [externalActions, setExternalActions] = useState(2);
  const [riskSensitivity, setRiskSensitivity] = useState(4);
  const [latencySensitivity, setLatencySensitivity] = useState(3);

  const level = LEVELS[selectedLevel];

  const recommendation = useMemo(() => {
    let suggested = Math.round((taskAmbiguity + externalActions) / 2);

    if (riskSensitivity >= 4) suggested = Math.min(suggested, 2);
    if (latencySensitivity >= 4) suggested = Math.min(suggested, 3);
    if (taskAmbiguity >= 4 && externalActions >= 4 && riskSensitivity <= 3) suggested = Math.max(suggested, 4);

    suggested = clamp(suggested, 0, 5);

    return {
      level: suggested,
      title: LEVELS[suggested].title,
      reason:
        suggested <= 2
          ? "Keep architecture simple and deterministic until measurable gaps appear."
          : suggested <= 3
            ? "Controlled tool use can improve quality while keeping operational risk manageable."
            : "Task complexity justifies graph-level loops and stronger observability controls.",
    };
  }, [taskAmbiguity, externalActions, riskSensitivity, latencySensitivity]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Autonomy ladder visualization: compare architectural behavior from L0 to L5 and inspect the control-cost tradeoff.
      </p>

      <div style={{ marginBottom: "0.8rem" }}>
        <input
          type="range"
          min={0}
          max={5}
          value={selectedLevel}
          onChange={(event) => setSelectedLevel(Number(event.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{level.title}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.7rem", marginBottom: "0.8rem" }}>
        {LEVELS.map((item) => {
          const active = item.id === selectedLevel;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedLevel(item.id)}
              style={{
                textAlign: "left",
                borderRadius: "10px",
                border: active ? "1px solid #6366f1" : "1px solid var(--glass-border)",
                background: active ? "rgba(99,102,241,0.12)" : "var(--bg-tertiary)",
                color: "var(--text-primary)",
                padding: "0.65rem 0.75rem",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>{item.title}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.35 }}>{item.architecture}</div>
            </button>
          );
        })}
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-tertiary)", marginBottom: "0.3rem", fontWeight: 700 }}>
              Decision rights
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{level.decisionRights}</div>

            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-tertiary)", margin: "0.7rem 0 0.3rem", fontWeight: 700 }}>
              Best fit
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{level.useCases}</div>

            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-tertiary)", margin: "0.7rem 0 0.3rem", fontWeight: 700 }}>
              Main risk + guardrails
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              <strong style={{ color: "var(--text-primary)" }}>Risk:</strong> {level.risks}
              <br />
              <strong style={{ color: "var(--text-primary)" }}>Guardrails:</strong> {level.guardrails}
            </div>
          </div>

          <div>
            <MetricBar label="Flexibility" value={level.metrics.flexibility} />
            <MetricBar label="Predictability" value={level.metrics.predictability} />
            <MetricBar label="Safety effort" value={level.metrics.safetyEffort} />
            <MetricBar label="Runtime cost" value={level.metrics.runtimeCost} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "0.9rem", border: "1px solid var(--glass-border)", borderRadius: "12px", background: "rgba(15,23,42,0.55)", padding: "0.75rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
          Interactive autonomy chooser
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Task ambiguity: {taskAmbiguity}
            <input type="range" min={1} max={5} value={taskAmbiguity} onChange={(e) => setTaskAmbiguity(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            External actions needed: {externalActions}
            <input type="range" min={1} max={5} value={externalActions} onChange={(e) => setExternalActions(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Risk sensitivity: {riskSensitivity}
            <input type="range" min={1} max={5} value={riskSensitivity} onChange={(e) => setRiskSensitivity(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Latency sensitivity: {latencySensitivity}
            <input type="range" min={1} max={5} value={latencySensitivity} onChange={(e) => setLatencySensitivity(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginTop: "0.65rem", fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
          <strong style={{ color: "#818cf8" }}>Suggested baseline:</strong> {recommendation.title}
          <br />
          {recommendation.reason}
        </div>
      </div>
    </div>
  );
}
