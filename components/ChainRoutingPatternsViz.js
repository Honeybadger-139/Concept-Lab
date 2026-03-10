"use client";

import { useMemo, useState } from "react";

const MODES = {
  sequential: {
    title: "Sequential Chain",
    summary: "Fixed step-by-step execution where each stage depends on the previous output.",
    nodes: ["Input", "Prompt", "Model", "Parser", "Output"],
    metrics: { latency: "Medium", reliability: "High", complexity: "Low" },
    useCases: ["Standard answer generation", "Deterministic transformation workflows"],
  },
  parallel: {
    title: "Parallel Chain",
    summary: "Independent branches execute concurrently and merge into one final synthesis step.",
    nodes: ["Input", "Branch A", "Branch B", "Branch C", "Merge", "Output"],
    metrics: { latency: "Low", reliability: "Medium", complexity: "Medium" },
    useCases: ["Multi-signal extraction", "Entity + sentiment + intent in one pass"],
  },
  conditional: {
    title: "Conditional Chain",
    summary: "Runtime router selects the best branch based on query type or quality signal.",
    nodes: ["Input", "Router", "Path A", "Path B", "Path C", "Output"],
    metrics: { latency: "Variable", reliability: "High", complexity: "High" },
    useCases: ["FAQ vs analysis route split", "Cost-aware model selection"],
  },
};

function Metric({ name, value }) {
  return (
    <div style={{
      border: "1px solid var(--glass-border)",
      borderRadius: "8px",
      padding: "0.4rem 0.5rem",
      background: "var(--bg-tertiary)",
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
    }}>
      <strong style={{ color: "var(--text-primary)" }}>{name}:</strong> {value}
    </div>
  );
}

export default function ChainRoutingPatternsViz() {
  const [mode, setMode] = useState("sequential");
  const [animate, setAnimate] = useState(true);

  const data = MODES[mode];

  const linkIndexes = useMemo(() => {
    const links = [];
    for (let i = 0; i < data.nodes.length - 1; i += 1) links.push(i);
    return links;
  }, [data.nodes.length]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Compare common LangChain routing patterns and observe how architecture affects latency, reliability, and complexity.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {Object.entries(MODES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #6366f1" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(99,102,241,0.12)" : "var(--bg-tertiary)",
              color: mode === key ? "#818cf8" : "var(--text-secondary)",
              padding: "0.34rem 0.7rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.title}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setAnimate((prev) => !prev)}
          style={{
            borderRadius: "999px",
            border: "1px solid var(--glass-border)",
            background: "transparent",
            color: "var(--text-secondary)",
            padding: "0.34rem 0.7rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {animate ? "Pause flow" : "Animate flow"}
        </button>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#0b1020", padding: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem" }}>
          {data.nodes.map((node, index) => (
            <div key={node} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div style={{
                minWidth: "92px",
                textAlign: "center",
                borderRadius: "8px",
                border: "1px solid rgba(129,140,248,0.45)",
                background: "rgba(99,102,241,0.16)",
                color: "#e2e8f0",
                padding: "0.35rem 0.5rem",
                fontSize: "0.76rem",
                fontWeight: 700,
              }}>
                {node}
              </div>
              {index < data.nodes.length - 1 && (
                <div style={{
                  color: animate ? "#22d3ee" : "#64748b",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  opacity: animate ? 1 : 0.55,
                  transition: "opacity 0.2s ease",
                }}>
                  {linkIndexes.includes(index) ? "→" : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.72rem" }}>
        <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.35rem" }}>{data.title}</div>
        <p style={{ margin: "0 0 0.55rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{data.summary}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.45rem", marginBottom: "0.55rem" }}>
          <Metric name="Latency" value={data.metrics.latency} />
          <Metric name="Reliability" value={data.metrics.reliability} />
          <Metric name="Complexity" value={data.metrics.complexity} />
        </div>

        <div style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
          Good fits
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {data.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
