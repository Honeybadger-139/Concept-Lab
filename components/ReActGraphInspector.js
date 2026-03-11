"use client";

import { useMemo, useState } from "react";

const CONFIGS = [
  {
    id: "happy",
    name: "Happy path",
    steps: [
      { stage: "reason", output: "AgentAction(search_docs, query='refund policy')", latencyMs: 820, tokens: 320 },
      { stage: "act", output: "search_docs returned 3 ranked chunks", latencyMs: 610, tokens: 0 },
      { stage: "reason", output: "AgentFinish(answer + citation)", latencyMs: 780, tokens: 290 },
      { stage: "end", output: "Workflow terminated", latencyMs: 0, tokens: 0 },
    ],
  },
  {
    id: "retry",
    name: "Retry loop",
    steps: [
      { stage: "reason", output: "AgentAction(get_live_price, symbol='BTC')", latencyMs: 840, tokens: 330 },
      { stage: "act", output: "tool timeout", latencyMs: 2200, tokens: 0, error: true },
      { stage: "reason", output: "AgentAction(get_live_price, fallback_provider=true)", latencyMs: 790, tokens: 310 },
      { stage: "act", output: "price fetched successfully", latencyMs: 900, tokens: 0 },
      { stage: "reason", output: "AgentFinish(answer + stale-data warning)", latencyMs: 770, tokens: 275 },
      { stage: "end", output: "Workflow terminated", latencyMs: 0, tokens: 0 },
    ],
  },
  {
    id: "escalate",
    name: "Escalate to HITL",
    steps: [
      { stage: "reason", output: "AgentAction(check_policy, domain='legal')", latencyMs: 860, tokens: 340 },
      { stage: "act", output: "policy confidence = 0.46", latencyMs: 650, tokens: 0 },
      { stage: "reason", output: "AgentFinish(escalate_to_human)", latencyMs: 735, tokens: 260 },
      { stage: "end", output: "Escalation route selected", latencyMs: 0, tokens: 0 },
    ],
  },
];

const STAGE_COLORS = {
  reason: "#22c55e",
  act: "#f59e0b",
  end: "#a78bfa",
};

function sum(items, pick) {
  return items.reduce((acc, item) => acc + pick(item), 0);
}

export default function ReActGraphInspector() {
  const [configId, setConfigId] = useState(CONFIGS[0].id);
  const [cursor, setCursor] = useState(0);

  const config = useMemo(() => CONFIGS.find((item) => item.id === configId) || CONFIGS[0], [configId]);
  const current = config.steps[cursor];

  const totalLatency = sum(config.steps.slice(0, cursor + 1), (item) => item.latencyMs);
  const totalTokens = sum(config.steps.slice(0, cursor + 1), (item) => item.tokens);
  const loopDepth = config.steps.slice(0, cursor + 1).filter((item) => item.stage === "reason").length;

  const reset = () => setCursor(0);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Inspect ReAct control flow at run-time: reason outputs, action execution results, loop depth, and cumulative latency/token cost.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <select
          value={configId}
          onChange={(event) => {
            setConfigId(event.target.value);
            setCursor(0);
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
          {CONFIGS.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setCursor((prev) => Math.max(prev - 1, 0))}
          disabled={cursor === 0}
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            padding: "0.4rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: cursor === 0 ? "not-allowed" : "pointer",
            opacity: cursor === 0 ? 0.6 : 1,
          }}
        >
          Prev
        </button>

        <button
          type="button"
          onClick={() => setCursor((prev) => Math.min(prev + 1, config.steps.length - 1))}
          disabled={cursor >= config.steps.length - 1}
          style={{
            border: "none",
            borderRadius: "8px",
            background: "#6366f1",
            color: "white",
            padding: "0.4rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: cursor >= config.steps.length - 1 ? "not-allowed" : "pointer",
            opacity: cursor >= config.steps.length - 1 ? 0.6 : 1,
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

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem" }}>
          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "9px", padding: "0.55rem" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Step</div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>{cursor + 1} / {config.steps.length}</div>
          </div>
          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "9px", padding: "0.55rem" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Loop depth</div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>{loopDepth}</div>
          </div>
          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "9px", padding: "0.55rem" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Cumulative latency</div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>{totalLatency} ms</div>
          </div>
          <div style={{ border: "1px solid var(--glass-border)", borderRadius: "9px", padding: "0.55rem" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Cumulative tokens</div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>{totalTokens}</div>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", overflow: "hidden", background: "#0b1020", marginBottom: "0.75rem" }}>
        <svg viewBox="0 0 900 120" width="100%" height="auto" role="img" aria-label="ReAct loop flow">
          <defs>
            <marker id="react-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="rgba(148,163,184,0.65)" />
            </marker>
          </defs>
          {config.steps.map((step, index) => {
            const x = 50 + index * 135;
            const active = index === cursor;
            const color = STAGE_COLORS[step.stage] || "#94a3b8";
            return (
              <g key={`${step.stage}-${index}`}>
                {index < config.steps.length - 1 && (
                  <line x1={x + 108} y1={56} x2={x + 135} y2={56} stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" markerEnd="url(#react-arrow)" />
                )}
                <rect
                  x={x}
                  y={32}
                  width="108"
                  height="48"
                  rx="10"
                  fill={active ? `${color}33` : "rgba(15,23,42,0.95)"}
                  stroke={active ? "#22d3ee" : "rgba(148,163,184,0.45)"}
                  strokeWidth={active ? 2.2 : 1.2}
                />
                <text x={x + 54} y={54} textAnchor="middle" fill="#dbeafe" fontSize="11" fontWeight="700">{step.stage.toUpperCase()}</text>
                <text x={x + 54} y={70} textAnchor="middle" fill="#94a3b8" fontSize="10">#{index + 1}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.75rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Current stage output
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.3rem" }}>
          {current.stage.toUpperCase()}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: "0.45rem" }}>
          {current.output}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          <span>latency: <code>{current.latencyMs}ms</code></span>
          <span>tokens: <code>{current.tokens}</code></span>
          {current.error && <span style={{ color: "#fca5a5" }}>error observed</span>}
        </div>
      </div>
    </div>
  );
}
