"use client";

import { useEffect, useMemo, useState } from "react";

const STAGES = ["reason", "select", "execute", "observe", "decide"];

const STAGE_LABELS = {
  reason: "Reason",
  select: "Select tool",
  execute: "Execute tool",
  observe: "Observe output",
  decide: "Decide next route",
};

const SCENARIOS = [
  {
    id: "timezone",
    name: "Time conversion question",
    userQuery: "What time is it in London if my system is running in India?",
    tool: "get_system_time",
    successObservation: "Tool returned structured IST timestamp.",
    failObservation: "Tool timeout while reading host clock.",
    finalSuccess: "Final answer includes converted London time and method.",
    finalFallback: "Unable to fetch reliable timestamp. Return graceful fallback message.",
  },
  {
    id: "policy",
    name: "Policy lookup question",
    userQuery: "What is our reimbursement cap for international travel?",
    tool: "search_policy_docs",
    successObservation: "Top-ranked policy chunk retrieved with section id.",
    failObservation: "No relevant policy chunks found above confidence threshold.",
    finalSuccess: "Answer cites policy section and confidence explanation.",
    finalFallback: "Escalate to human reviewer due to low confidence retrieval.",
  },
  {
    id: "math",
    name: "Computation question",
    userQuery: "Calculate 18% tax on 1499 and round to nearest integer.",
    tool: "calculator",
    successObservation: "Calculator returned deterministic numeric output.",
    failObservation: "Calculator threw parse error for malformed expression.",
    finalSuccess: "Answer returns value plus intermediate arithmetic steps.",
    finalFallback: "Return constrained fallback and ask user to rephrase expression.",
  },
];

function getAttemptOutcome(mode, attempt) {
  if (mode === "always_success") return true;
  if (mode === "fail_once") return attempt >= 2;
  return false;
}

export default function AgentToolLoopSimulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [failureMode, setFailureMode] = useState("fail_once");
  const [maxAttempts, setMaxAttempts] = useState(2);

  const [stageIndex, setStageIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [lastExecutionSuccess, setLastExecutionSuccess] = useState(null);
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const scenario = useMemo(() => {
    return SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  }, [scenarioId]);

  const currentStage = STAGES[stageIndex];

  const reset = () => {
    setStageIndex(0);
    setAttempt(1);
    setLastExecutionSuccess(null);
    setStatus("idle");
    setLogs([]);
    setIsAutoRunning(false);
  };

  const appendLog = (message) => {
    setLogs((prev) => [...prev, message]);
  };

  const step = () => {
    if (status === "done") return;

    const stage = STAGES[stageIndex];

    if (status === "idle") {
      setStatus("running");
      appendLog(`Start run. Query: "${scenario.userQuery}"`);
    }

    if (stage === "reason") {
      appendLog(`Attempt ${attempt}: Agent reasons about intent and required evidence.`);
      setStageIndex(1);
      return;
    }

    if (stage === "select") {
      appendLog(`Attempt ${attempt}: Agent selects tool ${scenario.tool}.`);
      setStageIndex(2);
      return;
    }

    if (stage === "execute") {
      const success = getAttemptOutcome(failureMode, attempt);
      setLastExecutionSuccess(success);
      appendLog(`Attempt ${attempt}: Tool execution ${success ? "succeeded" : "failed"}.`);
      setStageIndex(3);
      return;
    }

    if (stage === "observe") {
      appendLog(`Attempt ${attempt}: Observation -> ${lastExecutionSuccess ? scenario.successObservation : scenario.failObservation}`);
      setStageIndex(4);
      return;
    }

    if (stage === "decide") {
      if (lastExecutionSuccess) {
        appendLog(`Decision: confidence acceptable. ${scenario.finalSuccess}`);
        setStatus("done");
        setIsAutoRunning(false);
        return;
      }

      if (attempt < maxAttempts) {
        const nextAttempt = attempt + 1;
        appendLog(`Decision: retry route activated (attempt ${nextAttempt}/${maxAttempts}).`);
        setAttempt(nextAttempt);
        setStageIndex(0);
        return;
      }

      appendLog(`Decision: max attempts reached. ${scenario.finalFallback}`);
      setStatus("done");
      setIsAutoRunning(false);
    }
  };

  useEffect(() => {
    if (!isAutoRunning) return undefined;
    if (status === "done") {
      setIsAutoRunning(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      step();
    }, 750);

    return () => clearTimeout(timer);
  }, [isAutoRunning, status, stageIndex, attempt, lastExecutionSuccess, failureMode, maxAttempts, scenarioId]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Interactive simulator for the agent loop: Reason &rarr; Select Tool &rarr; Execute &rarr; Observe &rarr; Decide.
        Change failure mode and retry budget to see how routing and fallback behavior changes.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.55rem", marginBottom: "0.8rem" }}>
        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Scenario
          <select
            value={scenarioId}
            onChange={(event) => {
              setScenarioId(event.target.value);
              reset();
            }}
            style={{ width: "100%", marginTop: "0.22rem", padding: "0.38rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
          >
            {SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Tool outcome mode
          <select
            value={failureMode}
            onChange={(event) => {
              setFailureMode(event.target.value);
              reset();
            }}
            style={{ width: "100%", marginTop: "0.22rem", padding: "0.38rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
          >
            <option value="always_success">Always success</option>
            <option value="fail_once">Fail first attempt, then recover</option>
            <option value="always_fail">Always fail</option>
          </select>
        </label>

        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Max attempts
          <input
            type="range"
            min={1}
            max={4}
            value={maxAttempts}
            onChange={(event) => {
              setMaxAttempts(Number(event.target.value));
              reset();
            }}
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
          <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>{maxAttempts}</span>
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
        <button
          type="button"
          onClick={step}
          disabled={status === "done"}
          style={{ border: "none", borderRadius: "8px", background: "#d97706", color: "white", padding: "0.4rem 0.8rem", fontSize: "0.8rem", fontWeight: 700, cursor: status === "done" ? "not-allowed" : "pointer", opacity: status === "done" ? 0.6 : 1 }}
        >
          Run one step
        </button>

        <button
          type="button"
          onClick={() => setIsAutoRunning((prev) => !prev)}
          disabled={status === "done"}
          style={{ border: "1px solid var(--glass-border)", borderRadius: "8px", background: "var(--bg-tertiary)", color: "var(--text-primary)", padding: "0.4rem 0.8rem", fontSize: "0.8rem", fontWeight: 600, cursor: status === "done" ? "not-allowed" : "pointer", opacity: status === "done" ? 0.6 : 1 }}
        >
          {isAutoRunning ? "Pause auto-run" : "Auto-run"}
        </button>

        <button
          type="button"
          onClick={reset}
          style={{ border: "1px solid var(--glass-border)", borderRadius: "8px", background: "transparent", color: "var(--text-secondary)", padding: "0.4rem 0.8rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
        >
          Reset
        </button>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.7rem", marginBottom: "0.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.45rem" }}>
          {STAGES.map((stage, index) => {
            const active = index === stageIndex && status !== "done";
            return (
              <div key={stage} style={{ borderRadius: "8px", border: active ? "1px solid #22d3ee" : "1px solid var(--glass-border)", background: active ? "rgba(34,211,238,0.12)" : "transparent", padding: "0.45rem 0.55rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginBottom: "0.2rem" }}>Stage {index + 1}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{STAGE_LABELS[stage]}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "0.65rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          Current attempt: <strong style={{ color: "var(--text-primary)" }}>{attempt}</strong> / {maxAttempts}
          {status === "done" ? " | Run complete" : ` | Current stage: ${STAGE_LABELS[currentStage]}`}
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#0b1020", padding: "0.7rem" }}>
        <div style={{ fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "0.45rem" }}>
          Execution trace
        </div>
        <div style={{ maxHeight: "200px", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "0.77rem", lineHeight: 1.45, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
          {logs.length === 0 ? "No execution yet. Run one step or auto-run to generate trace." : logs.join("\n")}
        </div>
      </div>
    </div>
  );
}
