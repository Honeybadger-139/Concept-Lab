"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: "support",
    name: "Support policy workflow",
    steps: [
      {
        node: "START",
        route: "start",
        updates: { input: "How much can I claim for international travel?" },
        note: "Run begins with user query and empty execution memory.",
      },
      {
        node: "reason",
        route: "START -> reason",
        updates: {
          agent_outcome: "AgentAction(tool=search_policy_docs)",
          confidence: 0.41,
        },
        note: "Reasoning node chooses retrieval because policy evidence is missing.",
      },
      {
        node: "act",
        route: "reason -> act",
        updates: {
          intermediate_steps: "+ (search_policy_docs, section=TRAVEL-42)",
          last_tool_latency_ms: 710,
        },
        note: "Tool call result is appended for traceable reasoning context.",
      },
      {
        node: "reason",
        route: "act -> reason",
        updates: {
          agent_outcome: "AgentFinish(answer + citation)",
          confidence: 0.89,
        },
        note: "Reasoning sees sufficient evidence and emits finish outcome.",
      },
      {
        node: "END",
        route: "reason -> END",
        updates: {
          status: "completed",
          total_steps: 4,
        },
        note: "Run exits with final answer and stable state snapshot.",
      },
    ],
  },
  {
    id: "incident",
    name: "Incident triage with retry",
    steps: [
      {
        node: "START",
        route: "start",
        updates: { input: "Investigate failed payment spike in EU region" },
        note: "Run begins with objective and retry budget = 2.",
      },
      {
        node: "reason",
        route: "START -> reason",
        updates: {
          agent_outcome: "AgentAction(tool=query_metrics)",
          retry_count: 0,
        },
        note: "Reasoning requests telemetry data first.",
      },
      {
        node: "act",
        route: "reason -> act",
        updates: {
          intermediate_steps: "+ (query_metrics, timeout_error)",
          retry_count: 1,
        },
        note: "Tool timeout is captured as structured observation.",
      },
      {
        node: "reason",
        route: "act -> reason",
        updates: {
          agent_outcome: "AgentAction(tool=query_metrics, fallback_region_scope)",
          confidence: 0.32,
        },
        note: "Second attempt narrows request to reduce payload size.",
      },
      {
        node: "act",
        route: "reason -> act",
        updates: {
          intermediate_steps: "+ (query_metrics, anomaly_score=0.93)",
          retry_count: 1,
        },
        note: "Fallback query succeeds and appends anomaly observation.",
      },
      {
        node: "reason",
        route: "act -> reason",
        updates: {
          agent_outcome: "AgentFinish(escalate_to_human)",
          risk_level: "high",
        },
        note: "Model decides high-risk incident requires human escalation.",
      },
      {
        node: "END",
        route: "reason -> END",
        updates: { status: "escalated", total_steps: 6 },
        note: "Run terminates with escalation and complete trace history.",
      },
    ],
  },
];

const GRAPH_LAYOUT = [
  { id: "START", x: 70, y: 60, color: "#38bdf8" },
  { id: "reason", x: 290, y: 60, color: "#22c55e" },
  { id: "act", x: 510, y: 60, color: "#f59e0b" },
  { id: "END", x: 730, y: 60, color: "#fbbf24" },
];

function NodeBox({ node, active }) {
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width="130"
        height="46"
        rx="10"
        fill={active ? `${node.color}33` : "rgba(15,23,42,0.92)"}
        stroke={active ? "#22d3ee" : "rgba(148,163,184,0.45)"}
        strokeWidth={active ? 2.2 : 1.3}
      />
      <text x={node.x + 65} y={node.y + 28} textAnchor="middle" fill="#dbeafe" fontSize="12" fontWeight="700">
        {node.id}
      </text>
    </g>
  );
}

export default function StateGraphFlowViz() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState(0);

  const scenario = useMemo(() => SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0], [scenarioId]);
  const current = scenario.steps[stepIndex];

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, scenario.steps.length - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));
  const reset = () => setStepIndex(0);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Explore how state evolves per node. Each step applies deterministic state updates, and edges stay explicit for debugging and audits.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <select
          value={scenarioId}
          onChange={(event) => {
            setScenarioId(event.target.value);
            setStepIndex(0);
          }}
          style={{
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            padding: "0.4rem 0.55rem",
            fontSize: "0.8rem",
          }}
        >
          {SCENARIOS.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            padding: "0.4rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: stepIndex === 0 ? "not-allowed" : "pointer",
            opacity: stepIndex === 0 ? 0.6 : 1,
          }}
        >
          Prev
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={stepIndex >= scenario.steps.length - 1}
          style={{
            border: "none",
            borderRadius: "8px",
            background: "#d97706",
            color: "white",
            padding: "0.4rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: stepIndex >= scenario.steps.length - 1 ? "not-allowed" : "pointer",
            opacity: stepIndex >= scenario.steps.length - 1 ? 0.6 : 1,
          }}
        >
          Next
        </button>

        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary)",
            padding: "0.4rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", overflow: "hidden", background: "#0b1020" }}>
        <svg viewBox="0 0 920 180" width="100%" height="auto" role="img" aria-label="StateGraph flow">
          <defs>
            <marker id="stategraph-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="rgba(148,163,184,0.65)" />
            </marker>
          </defs>

          <line x1="200" y1="83" x2="290" y2="83" stroke="rgba(148,163,184,0.5)" strokeWidth="1.6" markerEnd="url(#stategraph-arrow)" />
          <line x1="420" y1="83" x2="510" y2="83" stroke="rgba(148,163,184,0.5)" strokeWidth="1.6" markerEnd="url(#stategraph-arrow)" />
          <line x1="640" y1="83" x2="730" y2="83" stroke="rgba(148,163,184,0.5)" strokeWidth="1.6" markerEnd="url(#stategraph-arrow)" />
          <path d="M575 112 C575 154, 350 154, 350 112" fill="none" stroke="rgba(148,163,184,0.45)" strokeDasharray="5 4" strokeWidth="1.5" markerEnd="url(#stategraph-arrow)" />

          {GRAPH_LAYOUT.map((node) => (
            <NodeBox key={node.id} node={node} active={current.node === node.id} />
          ))}

          <text x="465" y="153" fill="#94a3b8" fontSize="11" textAnchor="middle">retry loop (conditional)</text>
        </svg>
      </div>

      <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.7rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
            Current step
          </div>
          <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 700 }}>
            {stepIndex + 1} / {scenario.steps.length} - {current.node}
          </div>
          <div style={{ marginTop: "0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            Route: <code>{current.route}</code>
          </div>
          <div style={{ marginTop: "0.45rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {current.note}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "0.35rem" }}>
            State updates
          </div>
          <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.5 }}>
            {Object.entries(current.updates).map(([key, value]) => (
              <li key={key}><code>{key}</code>: {String(value)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
