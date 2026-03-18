"use client";

import { useEffect, useMemo, useState } from "react";

const GRAPH_NODES = [
  { id: "input", label: "Input Router", x: 60, y: 110, color: "#60a5fa", detail: "Normalizes user intent and initializes shared graph state." },
  { id: "planner", label: "Planner", x: 250, y: 110, color: "#22c55e", detail: "Chooses the next best action based on current state and policy." },
  { id: "retriever", label: "Retriever", x: 450, y: 55, color: "#f59e0b", detail: "Fetches supporting context from docs, knowledge base, or vector store." },
  { id: "tool", label: "Tool Executor", x: 450, y: 165, color: "#f97316", detail: "Calls external tools and APIs with strict schema and timeout controls." },
  { id: "validator", label: "Quality Gate", x: 670, y: 110, color: "#a855f7", detail: "Scores confidence, policy safety, and completeness before final output." },
  { id: "human", label: "Human Review", x: 880, y: 55, color: "#ef4444", detail: "Manual approval path for high-risk or low-confidence outcomes." },
  { id: "responder", label: "Final Responder", x: 880, y: 170, color: "#14b8a6", detail: "Builds the final grounded response and citations for the user." },
  { id: "end", label: "END", x: 1080, y: 110, color: "#94a3b8", detail: "Execution completed and state snapshot stored for observability." },
];

const EDGES = [
  ["input", "planner", "start"],
  ["planner", "retriever", "needs context"],
  ["planner", "tool", "needs action"],
  ["retriever", "validator", "evidence"],
  ["tool", "validator", "observation"],
  ["validator", "responder", "confident"],
  ["validator", "retriever", "low confidence"],
  ["validator", "human", "high risk"],
  ["human", "responder", "approved"],
  ["responder", "end", "finish"],
];

const SCENARIOS = {
  "Support question (happy path)": ["input", "planner", "retriever", "validator", "responder", "end"],
  "Low confidence loop": ["input", "planner", "retriever", "validator", "retriever", "validator", "responder", "end"],
  "High risk escalation": ["input", "planner", "tool", "validator", "human", "responder", "end"],
};

function edgeKey(from, to) {
  return `${from}->${to}`;
}

export default function LangGraphArchitectureViz() {
  const scenarioNames = Object.keys(SCENARIOS);
  const [scenario, setScenario] = useState(scenarioNames[0]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState("planner");

  const path = SCENARIOS[scenario];
  const selectedNode = GRAPH_NODES.find((node) => node.id === selectedNodeId) || GRAPH_NODES[0];

  const activeNodeId = path[Math.min(stepIndex, path.length - 1)];
  const activeEdgeId = stepIndex < path.length - 1 ? edgeKey(path[stepIndex], path[stepIndex + 1]) : null;

  const nodeMap = useMemo(() => {
    return GRAPH_NODES.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    if (stepIndex >= path.length - 1) {
      setPlaying(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, path.length - 1));
    }, 900);

    return () => clearTimeout(timer);
  }, [playing, stepIndex, path]);

  const resetPath = () => {
    setStepIndex(0);
    setPlaying(false);
  };

  const nextStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, path.length - 1));
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Architecture graph for LangGraph orchestration with explicit routing, retry loops, and escalation.
        Select a scenario and run the flow to see how node state transitions happen.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.9rem" }}>
        <select
          value={scenario}
          onChange={(event) => {
            setScenario(event.target.value);
            setStepIndex(0);
            setPlaying(false);
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
          {scenarioNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          style={{
            border: "none",
            borderRadius: "8px",
            background: "#d97706",
            color: "white",
            padding: "0.42rem 0.8rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={stepIndex >= path.length - 1}
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            padding: "0.42rem 0.8rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: stepIndex >= path.length - 1 ? "not-allowed" : "pointer",
            opacity: stepIndex >= path.length - 1 ? 0.6 : 1,
          }}
        >
          Next step
        </button>

        <button
          type="button"
          onClick={resetPath}
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary)",
            padding: "0.42rem 0.8rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", overflow: "hidden", background: "#0b1020" }}>
        <svg viewBox="0 0 1160 230" width="100%" height="auto" role="img" aria-label="LangGraph architecture graph">
          <defs>
            <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="rgba(148,163,184,0.65)" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="#22d3ee" />
            </marker>
          </defs>

          {EDGES.map(([fromId, toId, label]) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];
            const active = activeEdgeId === edgeKey(fromId, toId);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={edgeKey(fromId, toId)}>
                <line
                  x1={from.x + 66}
                  y1={from.y + 22}
                  x2={to.x - 8}
                  y2={to.y + 22}
                  stroke={active ? "#22d3ee" : "rgba(148,163,184,0.45)"}
                  strokeWidth={active ? 2.5 : 1.5}
                  markerEnd={active ? "url(#arrow-active)" : "url(#arrow-default)"}
                />
                <text x={midX} y={midY - 8} fill={active ? "#67e8f9" : "rgba(148,163,184,0.95)"} fontSize="11" textAnchor="middle">
                  {label}
                </text>
              </g>
            );
          })}

          {GRAPH_NODES.map((node) => {
            const isActive = node.id === activeNodeId;
            const isSelected = node.id === selectedNodeId;

            return (
              <g key={node.id} onClick={() => setSelectedNodeId(node.id)} style={{ cursor: "pointer" }}>
                <rect
                  x={node.x - 66}
                  y={node.y}
                  width="132"
                  height="44"
                  rx="10"
                  fill={isActive ? `${node.color}33` : isSelected ? `${node.color}22` : "rgba(15,23,42,0.9)"}
                  stroke={isActive ? "#22d3ee" : isSelected ? node.color : "rgba(148,163,184,0.45)"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 26}
                  fill={isActive ? "#e2e8f0" : "#cbd5e1"}
                  fontSize="12"
                  fontWeight={isActive ? 700 : 600}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{
        marginTop: "0.8rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "0.75rem",
      }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.65rem 0.75rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-tertiary)", marginBottom: "0.3rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Current step
          </div>
          <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>
            {stepIndex + 1} / {path.length}: {activeNodeId}
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {GRAPH_NODES.find((node) => node.id === activeNodeId)?.detail}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.65rem 0.75rem" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-tertiary)", marginBottom: "0.3rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Selected node details
          </div>
          <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 700 }}>
            {selectedNode.label}
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {selectedNode.detail}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "0.85rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        <strong style={{ color: "var(--text-primary)" }}>Architecture note:</strong> this visualization deliberately shows
        two non-linear patterns that are hard to express in simple chains: (1) confidence-based loopbacks and
        (2) risk-based human escalation.
      </div>
    </div>
  );
}
