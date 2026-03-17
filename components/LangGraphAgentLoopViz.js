"use client";

import { useEffect, useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const AUTONOMY_MODES = {
  guided: {
    label: "Guided",
    threshold: 0.82,
    selfRetries: 0,
    plannerBias: 0.02,
    routeHint: "Escalate quickly when evidence is weak.",
  },
  balanced: {
    label: "Balanced",
    threshold: 0.68,
    selfRetries: 1,
    plannerBias: 0.08,
    routeHint: "Retry once, then stop if confidence is still low.",
  },
  autonomous: {
    label: "Autonomous",
    threshold: 0.56,
    selfRetries: 3,
    plannerBias: 0.15,
    routeHint: "Use the full retry budget before stopping.",
  },
};

const LOOP_NODES = [
  { id: "state", label: "State", x: 120, y: 116, w: 144, h: 54, color: "#38bdf8", detail: "Shared state stores the user goal, attempts, tool output, and route decision." },
  { id: "reason", label: "Reason", x: 340, y: 48, w: 144, h: 54, color: "#22c55e", detail: "The planner reads the latest state and chooses the next action." },
  { id: "tool", label: "Tool Call", x: 580, y: 48, w: 150, h: 54, color: "#f59e0b", detail: "A tool is called with the current plan and inputs from state." },
  { id: "observe", label: "Observe", x: 820, y: 116, w: 150, h: 54, color: "#a855f7", detail: "Tool output is written back into state as an observation." },
  { id: "route", label: "Route", x: 580, y: 206, w: 144, h: 54, color: "#f97316", detail: "The graph decides whether to continue the loop or stop." },
  { id: "end", label: "Stop / Answer", x: 340, y: 206, w: 166, h: 54, color: "#14b8a6", detail: "The run ends with either a final answer or a safe stop condition." },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function edgeId(from, to) {
  return `${from}->${to}`;
}

function confidenceForAttempt(signalQuality, modeKey, attempt) {
  const base = signalQuality / 100;
  const attemptBoost = (attempt - 1) * 0.12;
  const modeBoost = AUTONOMY_MODES[modeKey].plannerBias;
  return clamp(base + attemptBoost + modeBoost, 0.05, 0.99);
}

function reasonLabel(modeKey, attempt) {
  if (modeKey === "guided") {
    return attempt === 1
      ? "Planner checks state and asks for strong evidence before trusting a tool result."
      : "Guided mode would prefer handing off instead of retrying on its own.";
  }

  if (modeKey === "balanced") {
    return attempt === 1
      ? "Planner uses one normal tool pass before deciding whether a retry is worth it."
      : "Planner reformulates the same request once with stricter expectations.";
  }

  return attempt === 1
    ? "Planner starts autonomously and is willing to self-correct after weak evidence."
    : "Planner adjusts the next tool call using the last observation and keeps looping.";
}

function buildTrace(modeKey, retryBudget, signalQuality) {
  const mode = AUTONOMY_MODES[modeKey];
  const selfRetryLimit = Math.min(retryBudget, mode.selfRetries);
  const trace = [];
  let route = "continue";
  let lastConfidence = 0;

  trace.push({
    nodeId: "state",
    title: "State initialized",
    summary: "The graph creates shared state with the user task, attempt counter, and policy settings.",
    attempt: 0,
    route: "start",
    confidence: null,
  });

  for (let attempt = 1; attempt <= retryBudget + 1; attempt += 1) {
    const confidence = confidenceForAttempt(signalQuality, modeKey, attempt);
    lastConfidence = confidence;

    trace.push({
      nodeId: "reason",
      title: `Attempt ${attempt}: reason over state`,
      summary: reasonLabel(modeKey, attempt),
      attempt,
      route: "plan",
      confidence,
    });

    trace.push({
      nodeId: "tool",
      title: `Attempt ${attempt}: call tool`,
      summary: "The graph sends the current plan to a tool and waits for structured output.",
      attempt,
      route: "tool",
      confidence,
    });

    trace.push({
      nodeId: "observe",
      title: `Attempt ${attempt}: observe result`,
      summary: confidence >= mode.threshold
        ? `Observation quality is high enough to trust (${Math.round(confidence * 100)} percent confidence).`
        : `Observation quality is weak (${Math.round(confidence * 100)} percent confidence), so the router must decide whether to loop.`,
      attempt,
      route: "observe",
      confidence,
    });

    const shouldContinue = confidence < mode.threshold && attempt <= selfRetryLimit;
    route = shouldContinue ? "continue" : "stop";

    trace.push({
      nodeId: "route",
      title: `Attempt ${attempt}: route decision`,
      summary: shouldContinue
        ? "Router chooses continue. State is updated with the failed observation and the loop tries again."
        : confidence >= mode.threshold
          ? "Router chooses stop. The graph has enough confidence to produce the final answer."
          : "Router chooses stop. Retry policy is exhausted or this autonomy mode does not allow more self-retries.",
      attempt,
      route,
      confidence,
    });

    if (!shouldContinue) {
      trace.push({
        nodeId: "end",
        title: confidence >= mode.threshold ? "Run finished with final answer" : "Run finished with safe stop",
        summary: confidence >= mode.threshold
          ? "The graph exits the loop and returns a final response built from the latest state."
          : "The graph stops cleanly instead of looping forever. A real system may ask for clarification or escalate.",
        attempt,
        route: confidence >= mode.threshold ? "answer" : "fallback",
        confidence,
      });
      break;
    }
  }

  return {
    trace,
    lastConfidence,
    threshold: mode.threshold,
    selfRetryLimit,
    finalRoute: route,
  };
}

function nodeById(id) {
  return LOOP_NODES.find((node) => node.id === id) || LOOP_NODES[0];
}

function Card({ title, value, hint, accent, theme }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        background: theme.surface2,
        padding: "0.8rem 0.9rem",
      }}
    >
      <div style={{ fontSize: "0.72rem", color: theme.muted2, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.3rem" }}>
        {title}
      </div>
      <div style={{ fontSize: "0.95rem", color: accent || theme.label, fontWeight: 700, marginBottom: hint ? "0.25rem" : 0 }}>
        {value}
      </div>
      {hint ? <div style={{ fontSize: "0.78rem", color: theme.muted }}>{hint}</div> : null}
    </div>
  );
}

export default function LangGraphAgentLoopViz() {
  const theme = useChartTheme();
  const [modeKey, setModeKey] = useState("balanced");
  const [retryBudget, setRetryBudget] = useState(2);
  const [signalQuality, setSignalQuality] = useState(42);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState("route");

  const result = useMemo(() => buildTrace(modeKey, retryBudget, signalQuality), [modeKey, retryBudget, signalQuality]);
  const { trace, threshold, selfRetryLimit, finalRoute, lastConfidence } = result;
  const currentStep = trace[Math.min(stepIndex, trace.length - 1)];
  const selectedNode = nodeById(selectedNodeId);
  const activeEdge = stepIndex > 0 ? edgeId(trace[stepIndex - 1].nodeId, trace[stepIndex].nodeId) : null;
  const remainingRetries = Math.max(selfRetryLimit - Math.max((currentStep.attempt || 1) - 1, 0), 0);

  useEffect(() => {
    if (!playing) return undefined;
    if (stepIndex >= trace.length - 1) {
      setPlaying(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, trace.length - 1));
    }, 900);

    return () => clearTimeout(timer);
  }, [playing, stepIndex, trace.length]);

  if (!theme) return <div style={{ height: 560 }} />;

  const resetRun = () => {
    setStepIndex(0);
    setPlaying(false);
  };

  const activeNodeId = currentStep.nodeId;
  const predictedRoute = currentStep.confidence == null
    ? "pending"
    : currentStep.confidence >= threshold
      ? "stop"
      : currentStep.attempt <= selfRetryLimit
        ? "continue"
        : "stop";
  const routeLabel = currentStep.nodeId === "route" || currentStep.nodeId === "end" ? currentStep.route : predictedRoute;
  const confidenceLabel = currentStep.confidence == null ? "not scored yet" : `${Math.round(currentStep.confidence * 100)} percent`;

  const edges = [
    { id: edgeId("state", "reason"), path: "M192 116 C230 90, 260 78, 340 75", label: "read state" },
    { id: edgeId("reason", "tool"), path: "M484 75 L580 75", label: "plan action" },
    { id: edgeId("tool", "observe"), path: "M730 75 C780 76, 808 92, 820 116", label: "tool result" },
    { id: edgeId("observe", "route"), path: "M820 170 C804 200, 752 224, 652 233", label: "write observation" },
    { id: edgeId("route", "reason"), path: "M580 233 C500 260, 410 210, 372 102", label: "continue loop" },
    { id: edgeId("route", "end"), path: "M580 233 L506 233", label: "stop" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: theme.muted }}>
        Interactive LangGraph loop for beginner topics. It shows how shared state moves through reason, tool call, observe, and route decisions until the graph either continues or stops.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem", marginBottom: "0.9rem" }}>
        <div style={{ borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.8rem 0.9rem" }}>
          <div style={{ fontSize: "0.74rem", color: theme.muted2, marginBottom: "0.45rem" }}>Autonomy mode</div>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {Object.entries(AUTONOMY_MODES).map(([key, mode]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setModeKey(key);
                  resetRun();
                }}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${modeKey === key ? "#38bdf8" : theme.btnBorder}`,
                  background: modeKey === key ? "rgba(56,189,248,0.16)" : theme.btnBg,
                  color: modeKey === key ? theme.label : theme.btnText,
                  padding: "0.42rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.55rem", fontSize: "0.78rem", color: theme.muted }}>
            {AUTONOMY_MODES[modeKey].routeHint}
          </div>
        </div>

        <div style={{ borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.8rem 0.9rem" }}>
          <label style={{ display: "block", fontSize: "0.74rem", color: theme.muted2, marginBottom: "0.35rem" }}>
            Retry budget
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={retryBudget}
            onChange={(event) => {
              setRetryBudget(Number(event.target.value));
              resetRun();
            }}
            style={{ width: "100%", accentColor: "#38bdf8" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: theme.muted }}>
            <span>0 retries</span>
            <span style={{ color: theme.label, fontWeight: 700 }}>{retryBudget}</span>
            <span>3 retries</span>
          </div>
        </div>

        <div style={{ borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.8rem 0.9rem" }}>
          <label style={{ display: "block", fontSize: "0.74rem", color: theme.muted2, marginBottom: "0.35rem" }}>
            Tool signal quality
          </label>
          <input
            type="range"
            min={20}
            max={80}
            step={1}
            value={signalQuality}
            onChange={(event) => {
              setSignalQuality(Number(event.target.value));
              resetRun();
            }}
            style={{ width: "100%", accentColor: "#22c55e" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: theme.muted }}>
            <span>Noisy result</span>
            <span style={{ color: theme.label, fontWeight: 700 }}>{signalQuality}</span>
            <span>Strong result</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
        <button
          type="button"
          onClick={() => setPlaying((prev) => !prev)}
          style={{
            border: "none",
            borderRadius: 10,
            background: "#2563eb",
            color: "#f8fafc",
            padding: "0.48rem 0.95rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {playing ? "Pause" : "Play loop"}
        </button>
        <button
          type="button"
          onClick={() => setStepIndex((prev) => Math.min(prev + 1, trace.length - 1))}
          disabled={stepIndex >= trace.length - 1}
          style={{
            border: `1px solid ${theme.btnBorder}`,
            borderRadius: 10,
            background: theme.btnBg,
            color: theme.btnText,
            padding: "0.48rem 0.95rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: stepIndex >= trace.length - 1 ? "not-allowed" : "pointer",
            opacity: stepIndex >= trace.length - 1 ? 0.55 : 1,
          }}
        >
          Next step
        </button>
        <button
          type="button"
          onClick={resetRun}
          style={{
            border: `1px solid ${theme.btnBorder}`,
            borderRadius: 10,
            background: "transparent",
            color: theme.muted,
            padding: "0.48rem 0.95rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bg, overflow: "hidden" }}>
        <svg viewBox="0 0 980 310" width="100%" height="auto" role="img" aria-label="LangGraph loop visual">
          <defs>
            <marker id="loop-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0 0 L0 10 L10 5 Z" fill={theme.muted2} />
            </marker>
            <marker id="loop-arrow-active" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0 0 L0 10 L10 5 Z" fill="#22d3ee" />
            </marker>
          </defs>

          <rect x="0" y="0" width="980" height="310" fill={theme.bg} />

          {edges.map((edge) => {
            const isActive = activeEdge === edge.id;
            const labelPos = edge.id === edgeId("route", "reason")
              ? { x: 455, y: 180 }
              : edge.id === edgeId("route", "end")
                ? { x: 544, y: 222 }
                : edge.id === edgeId("observe", "route")
                  ? { x: 770, y: 210 }
                  : edge.id === edgeId("tool", "observe")
                    ? { x: 790, y: 90 }
                    : edge.id === edgeId("reason", "tool")
                      ? { x: 532, y: 62 }
                      : { x: 248, y: 58 };

            return (
              <g key={edge.id}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke={isActive ? "#22d3ee" : theme.rule}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={edge.id === edgeId("route", "reason") ? "5 5" : undefined}
                  markerEnd={isActive ? "url(#loop-arrow-active)" : "url(#loop-arrow)"}
                />
                <text x={labelPos.x} y={labelPos.y} textAnchor="middle" fontSize="12" fill={isActive ? "#67e8f9" : theme.muted2}>
                  {edge.label}
                </text>
              </g>
            );
          })}

          {LOOP_NODES.map((node) => {
            const isActive = activeNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            return (
              <g key={node.id} onClick={() => setSelectedNodeId(node.id)} style={{ cursor: "pointer" }}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="16"
                  fill={isActive ? `${node.color}24` : isSelected ? `${node.color}18` : theme.surface}
                  stroke={isActive ? "#22d3ee" : isSelected ? node.color : theme.border}
                  strokeWidth={isActive ? 3 : 1.5}
                />
                <text x={node.x + node.w / 2} y={node.y + 24} textAnchor="middle" fill={theme.label} fontSize="13" fontWeight="700">
                  {node.label}
                </text>
                <text x={node.x + node.w / 2} y={node.y + 40} textAnchor="middle" fill={theme.muted} fontSize="11">
                  {node.id === "route" ? "continue or stop" : node.id === "state" ? "shared memory" : "graph step"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: "0.9rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.7rem" }}>
        <Card
          title="Current step"
          value={currentStep.title}
          hint={currentStep.summary}
          accent="#e2e8f0"
          theme={theme}
        />
        <Card
          title="Observation confidence"
          value={confidenceLabel}
          hint={`Router threshold for ${AUTONOMY_MODES[modeKey].label.toLowerCase()} mode: ${Math.round(threshold * 100)} percent`}
          accent="#22c55e"
          theme={theme}
        />
        <Card
          title="Retries left"
          value={currentStep.attempt ? `${remainingRetries}` : `${selfRetryLimit}`}
          hint={`This mode may self-retry up to ${selfRetryLimit} time(s).`}
          accent="#f59e0b"
          theme={theme}
        />
        <Card
          title="Current route"
          value={routeLabel}
          hint={routeLabel === "continue" ? "The router is expected to loop again." : routeLabel === "pending" ? "The router has not made a decision yet." : "The graph is heading toward a stop condition."}
          accent={routeLabel === "continue" ? "#f97316" : "#14b8a6"}
          theme={theme}
        />
      </div>

      <div style={{ marginTop: "0.9rem", display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(260px, 0.9fr)", gap: "0.8rem" }}>
        <div style={{ borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.85rem 0.95rem" }}>
          <div style={{ fontSize: "0.76rem", color: theme.muted2, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.45rem" }}>
            Why the behavior changes
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.05rem", color: theme.muted, fontSize: "0.82rem", lineHeight: 1.6 }}>
            <li>Autonomy mode changes how much confidence the router demands before it will stop.</li>
            <li>Retry budget controls how many times the graph can re-enter the loop after a weak observation.</li>
            <li>Tool signal quality acts like real-world tool reliability: better outputs make the graph stop sooner.</li>
            <li>LangGraph is useful because this loop is explicit and inspectable instead of hidden inside one model call.</li>
          </ul>
        </div>

        <div style={{ borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.85rem 0.95rem" }}>
          <div style={{ fontSize: "0.76rem", color: theme.muted2, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.45rem" }}>
            Selected node
          </div>
          <div style={{ fontSize: "0.94rem", color: theme.label, fontWeight: 700, marginBottom: "0.35rem" }}>
            {selectedNode.label}
          </div>
          <div style={{ fontSize: "0.82rem", color: theme.muted, lineHeight: 1.6 }}>
            {selectedNode.detail}
          </div>
          <div style={{ marginTop: "0.7rem", fontSize: "0.78rem", color: theme.muted2 }}>
            Latest run ended with {finalRoute === "stop" ? "a stop decision" : "another loop"} at approximately {Math.round(lastConfidence * 100)} percent confidence.
          </div>
        </div>
      </div>
    </div>
  );
}
