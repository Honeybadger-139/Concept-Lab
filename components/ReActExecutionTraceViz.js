"use client";

import { useMemo, useState } from "react";

const SCENARIOS = {
  current_time: {
    query: "What is the current time?",
    tool: "get_system_time",
    thought: "I need a tool because the LLM cannot know realtime clock state from its training data.",
    actionInput: "default format",
    observation: "2026-03-17 22:25:04",
    final: "The current time is 2026-03-17 22:25:04.",
    loops: 1,
  },
  time_in_london: {
    query: "You are in India. What is the current time in London?",
    tool: "get_system_time",
    thought: "First get system time in India, then convert it using the known timezone offset.",
    actionInput: "time-only format",
    observation: "India time 22:25:04",
    final: "Based on India time, the current time in London is approximately 16:55:04.",
    loops: 2,
  },
};

const STAGES = [
  {
    label: "Prompt initialization",
    detail: "LangChain builds the ReAct prompt with the user question plus the tool names and descriptions.",
    color: "#d97706",
  },
  {
    label: "Reason",
    detail: "The LLM decides what it needs to know before taking an action.",
    color: "#38bdf8",
  },
  {
    label: "Tool suggestion",
    detail: "The LLM emits the tool name and proposed arguments in the ReAct format.",
    color: "#f59e0b",
  },
  {
    label: "Framework intercept",
    detail: "LangChain reads the model output, detects that a tool call is requested, and runs Python code rather than asking the model to execute the tool itself.",
    color: "#22c55e",
  },
  {
    label: "Observation",
    detail: "The tool result is sent back into the prompt so the LLM can continue reasoning or finalize.",
    color: "#fbbf24",
  },
  {
    label: "Final answer",
    detail: "Once enough evidence exists, the loop ends and the agent returns the answer to the user.",
    color: "#14b8a6",
  },
];

export default function ReActExecutionTraceViz() {
  const [scenarioKey, setScenarioKey] = useState("current_time");
  const [showPromptContract, setShowPromptContract] = useState(true);

  const scenario = SCENARIOS[scenarioKey];

  const promptContract = useMemo(() => {
    return `Question: ${scenario.query}\nThought: think about what to do\nAction: choose one of [${scenario.tool}]\nAction Input: arguments for the tool\nObservation: tool result\n... repeat if needed ...\nFinal Answer: respond to the user once the task is solved`;
  }, [scenario.query, scenario.tool]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        This trace shows what LangChain is actually doing during a ReAct agent run: the model suggests the next tool action, and the framework executes that tool in Python before returning the observation back to the model.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.75rem" }}>
        {Object.entries(SCENARIOS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenarioKey(key)}
            style={{
              borderRadius: "999px",
              border: scenarioKey === key ? "1px solid #14b8a6" : "1px solid var(--glass-border)",
              background: scenarioKey === key ? "rgba(20,184,166,0.14)" : "var(--bg-tertiary)",
              color: scenarioKey === key ? "#5eead4" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.query}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.45rem" }}>
            <div>
              <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700 }}>Execution trace</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.12rem" }}>Loop count: {scenario.loops}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowPromptContract((prev) => !prev)}
              style={{ borderRadius: "999px", border: "1px solid rgba(20,184,166,0.35)", background: "rgba(20,184,166,0.08)", color: "#5eead4", padding: "0.3rem 0.7rem", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
            >
              {showPromptContract ? "Hide prompt contract" : "Show prompt contract"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {STAGES.map((stage, index) => (
              <div key={stage.label} style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "999px", background: `${stage.color}22`, border: `1px solid ${stage.color}66`, color: stage.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, borderRadius: "10px", border: `1px solid ${stage.color}33`, background: `${stage.color}12`, padding: "0.55rem 0.65rem" }}>
                  <div style={{ fontSize: "0.8rem", color: stage.color, fontWeight: 700, marginBottom: "0.15rem" }}>{stage.label}</div>
                  <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.45 }}>{stage.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Scenario details
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <p style={{ margin: "0 0 0.35rem" }}><strong style={{ color: "var(--text-primary)" }}>Thought:</strong> {scenario.thought}</p>
            <p style={{ margin: "0 0 0.35rem" }}><strong style={{ color: "var(--text-primary)" }}>Tool:</strong> {scenario.tool}</p>
            <p style={{ margin: "0 0 0.35rem" }}><strong style={{ color: "var(--text-primary)" }}>Action input:</strong> {scenario.actionInput}</p>
            <p style={{ margin: "0 0 0.35rem" }}><strong style={{ color: "var(--text-primary)" }}>Observation:</strong> {scenario.observation}</p>
            <p style={{ margin: 0 }}><strong style={{ color: "var(--text-primary)" }}>Final answer:</strong> {scenario.final}</p>
          </div>
        </div>
      </div>

      {showPromptContract && (
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            ReAct prompt contract
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#fcd34d", lineHeight: 1.55 }}>{promptContract}</pre>
        </div>
      )}
    </div>
  );
}
