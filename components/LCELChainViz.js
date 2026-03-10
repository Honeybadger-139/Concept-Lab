"use client";

/**
 * LCELChainViz — visual demo of LangChain Expression Language (LCEL)
 *
 * Shows how the pipe operator (|) chains components together,
 * and lets the user add/remove steps to see the chain grow.
 */

import { useState } from "react";

const COMPONENTS = [
  {
    id: "prompt",
    label: "ChatPromptTemplate",
    icon: "📝",
    color: "#6366f1",
    desc: 'Formats variables into a structured prompt. e.g. "You are {role}. Answer: {question}"',
    code: 'ChatPromptTemplate.from_messages([\n  ("system", "You are {role}."),\n  ("human", "{question}")\n])',
  },
  {
    id: "model",
    label: "ChatOpenAI",
    icon: "🤖",
    color: "#10b981",
    desc: "Sends the prompt to the LLM and returns an AIMessage with the response.",
    code: 'ChatOpenAI(model="gpt-4o-mini")',
  },
  {
    id: "parser",
    label: "StrOutputParser",
    icon: "🔤",
    color: "#f59e0b",
    desc: "Extracts the plain text string from the AIMessage. Without it you get the full object.",
    code: "StrOutputParser()",
  },
];

const EXAMPLE_RESULT = `"RAG stands for Retrieval-Augmented Generation.
It combines LLMs with external knowledge retrieval
to produce accurate, grounded answers."`;

export default function LCELChainViz() {
  const [activeSteps, setActiveSteps] = useState(["prompt", "model", "parser"]);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);

  const toggleStep = (id) => {
    setOutput(null);
    if (activeSteps.includes(id)) {
      if (activeSteps.length === 1) return; // keep at least one
      setActiveSteps(activeSteps.filter(s => s !== id));
    } else {
      // Insert at original position
      const order = COMPONENTS.map(c => c.id);
      setActiveSteps(order.filter(s => activeSteps.includes(s) || s === id));
    }
  };

  const runChain = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setRunning(false);
      setOutput(EXAMPLE_RESULT);
    }, 1400);
  };

  const chain = activeSteps.map(id => COMPONENTS.find(c => c.id === id));

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>
        LCEL uses the <strong style={{ color: "var(--text-primary)" }}>pipe operator (|)</strong> to
        chain components. Each component&apos;s output becomes the next component&apos;s input.
        Toggle components on/off, then hit Run to simulate execution.
      </p>

      {/* Component toggles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {COMPONENTS.map(comp => {
          const on = activeSteps.includes(comp.id);
          return (
            <button
              key={comp.id}
              onClick={() => toggleStep(comp.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "99px",
                border: `1px solid ${on ? comp.color : "var(--glass-border)"}`,
                background: on ? `${comp.color}1a` : "var(--bg-tertiary)",
                color: on ? comp.color : "var(--text-tertiary)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {comp.icon} {comp.label}
            </button>
          );
        })}
      </div>

      {/* Chain diagram */}
      <div style={{
        background: "#0a0f1e",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--glass-border)",
        padding: "1.25rem",
        marginBottom: "1rem",
      }}>
        {/* Python code representation */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#c4b5fd", marginBottom: "1rem" }}>
          <span style={{ color: "var(--text-tertiary)" }}># Build the chain with LCEL</span>
          <br />
          <span style={{ color: "#60a5fa" }}>chain</span>
          <span style={{ color: "var(--text-primary)" }}> = </span>
          {chain.map((comp, i) => (
            <span key={comp.id}>
              <span style={{ color: comp.color }}>{comp.label}</span>
              {i < chain.length - 1 && (
                <span style={{ color: "#f59e0b" }}> | </span>
              )}
            </span>
          ))}
        </div>

        {/* Visual pipeline */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.25rem" }}>
          {/* Input */}
          <div style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.15)",
            fontSize: "0.78rem",
            color: "var(--text-tertiary)",
          }}>
            {"{"} role, question {"}"}
          </div>

          {chain.map((comp, i) => (
            <span key={comp.id} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>→</span>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                background: `${comp.color}1a`,
                border: `1px solid ${comp.color}55`,
                fontSize: "0.8rem",
                color: comp.color,
                fontWeight: 600,
              }}>
                {comp.icon} {comp.label}
              </div>
            </span>
          ))}

          <span style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>→</span>
          <div style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(16,185,129,0.1)",
            border: "1px dashed rgba(16,185,129,0.3)",
            fontSize: "0.78rem",
            color: "#10b981",
          }}>
            {activeSteps.includes("parser") ? "str" : "AIMessage"}
          </div>
        </div>
      </div>

      {/* Step detail cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
        {chain.map((comp, i) => (
          <div key={comp.id} style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-tertiary)",
            border: `1px solid ${comp.color}33`,
            borderLeft: `3px solid ${comp.color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: comp.color }}>
                {i + 1}. {comp.icon} {comp.label}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "0 0 0.5rem" }}>
              {comp.desc}
            </p>
            <code style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "#c4b5fd",
              background: "#0a0f1e",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              whiteSpace: "pre",
              overflowX: "auto",
            }}>
              {comp.code}
            </code>
          </div>
        ))}
      </div>

      {/* Run button + output */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={runChain}
          disabled={running}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            border: "none",
            background: running ? "var(--bg-tertiary)" : "#6366f1",
            color: running ? "var(--text-tertiary)" : "white",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: running ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {running ? "⚡ Running chain…" : "▶ Run chain.invoke()"}
        </button>

        {output && (
          <div style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.25)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            color: "#6ee7b7",
            whiteSpace: "pre-wrap",
          }}>
            {output}
          </div>
        )}
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-sm)",
        background: "rgba(167,139,250,0.07)",
        borderLeft: "3px solid var(--accent-tertiary)",
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
      }}>
        <strong style={{ color: "var(--accent-tertiary)" }}>Senior insight:</strong>{" "}
        LCEL&apos;s composability is not just syntactic sugar. It enables streaming (every step
        gets called with <code style={{ fontSize: "0.8em", background: "rgba(99,102,241,0.15)", padding: "0.1em 0.3em", borderRadius: "3px" }}>stream()</code>), parallel execution of multiple chains,
        and built-in observability with LangSmith — all without changing your chain code.
      </div>
    </div>
  );
}
