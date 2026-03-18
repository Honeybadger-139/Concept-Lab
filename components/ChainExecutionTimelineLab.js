"use client";

import { useMemo, useState } from "react";

const MODES = {
  sequential: {
    title: "Sequential Execution",
    summary: "Each stage waits for the previous stage to finish because the next input depends on the previous output.",
    steps: [
      { label: "Generate facts", duration: 3, color: "#38bdf8" },
      { label: "Prepare translation input", duration: 2, color: "#f59e0b" },
      { label: "Translate to target language", duration: 3, color: "#22c55e" },
      { label: "Validate and publish", duration: 2, color: "#fbbf24" },
    ],
    advice: "Keep stages narrow. If a stage only reformats data, make that explicit so debugging is cheap.",
    failureModes: [
      "One broken intermediate schema can halt the entire pipeline.",
      "Latency compounds because every step sits on the critical path.",
      "Side effects should occur only after validation, otherwise retries can duplicate output.",
    ],
  },
  parallel: {
    title: "Parallel Execution",
    summary: "One shared input fans out into independent branches, then a merge step combines the branch outputs.",
    steps: [
      { label: "Create shared summary", duration: 2, color: "#38bdf8" },
      { label: "Plot analysis branch", duration: 4, color: "#22c55e", lane: 0 },
      { label: "Character analysis branch", duration: 4, color: "#f59e0b", lane: 1 },
      { label: "Merge final blog draft", duration: 2, color: "#fbbf24" },
    ],
    advice: "Only parallelize truly independent work. Otherwise merge logic becomes the new bottleneck.",
    failureModes: [
      "Branch outputs may conflict in tone, length, or structure.",
      "One slow branch can erase the latency benefit of fan-out.",
      "You need an explicit policy for partial failure: wait, fallback, or return partial output.",
    ],
  },
  conditional: {
    title: "Conditional Routing",
    summary: "A router classifies the request, then only one specialized branch executes.",
    steps: [
      { label: "Classify feedback", duration: 2, color: "#38bdf8" },
      { label: "Positive response", duration: 3, color: "#22c55e", route: "positive" },
      { label: "Negative response", duration: 3, color: "#ef4444", route: "negative" },
      { label: "Escalate to human", duration: 2, color: "#f59e0b", route: "escalate" },
    ],
    advice: "Treat routing as a measurable classifier. Low-confidence routes need a fallback path, not blind trust.",
    failureModes: [
      "Misclassification sends users down the wrong business workflow.",
      "Branches that return different schemas make downstream UI logic brittle.",
      "Unmonitored routers drift over time and create inconsistent treatment for similar inputs.",
    ],
  },
};

const REQUESTS = {
  sequential: [
    { label: "French animal facts", route: "sequential", note: "Output from one stage becomes the next stage's input." },
    { label: "Multi-step email writer", route: "sequential", note: "Useful when quality checks must happen in a fixed order." },
  ],
  parallel: [
    { label: "Movie critique", route: "parallel", note: "Plot and character analysis can run at the same time." },
    { label: "Multi-channel content", route: "parallel", note: "One knowledge packet can feed several channel-specific branches." },
  ],
  conditional: [
    { label: "Customer review", route: "negative", note: "Bad sentiment goes to the apology branch." },
    { label: "Escalation candidate", route: "escalate", note: "Severe complaints skip generic automation and go to a human queue." },
  ],
};

function totalDuration(mode, activeRoute) {
  const data = MODES[mode];

  if (mode === "parallel") {
    return 2 + 4 + 2;
  }

  if (mode === "conditional") {
    return 2 + (activeRoute === "escalate" ? 2 : 3);
  }

  return data.steps.reduce((sum, step) => sum + step.duration, 0);
}

export default function ChainExecutionTimelineLab() {
  const [mode, setMode] = useState("sequential");
  const [requestIndex, setRequestIndex] = useState(0);
  const [retryPolicy, setRetryPolicy] = useState("retry-once");

  const request = REQUESTS[mode][requestIndex] ?? REQUESTS[mode][0];
  const duration = useMemo(() => totalDuration(mode, request.route), [mode, request.route]);
  const data = MODES[mode];

  const bars = useMemo(() => {
    if (mode === "parallel") {
      return [
        [
          { label: "Shared summary", duration: 2, color: "#38bdf8" },
          { label: "Plot analysis", duration: 4, color: "#22c55e" },
          { label: "Merge", duration: 2, color: "#fbbf24" },
        ],
        [
          { label: "Shared summary", duration: 2, color: "#38bdf8", ghost: true },
          { label: "Character analysis", duration: 4, color: "#f59e0b" },
          { label: "Merge", duration: 2, color: "#fbbf24", ghost: true },
        ],
      ];
    }

    if (mode === "conditional") {
      const selected = request.route === "negative" ? "Negative response" : request.route === "escalate" ? "Escalate to human" : "Positive response";
      return [[
        { label: "Classify feedback", duration: 2, color: "#38bdf8" },
        { label: selected, duration: selected === "Escalate to human" ? 2 : 3, color: selected === "Negative response" ? "#ef4444" : selected === "Escalate to human" ? "#f59e0b" : "#22c55e" },
      ]];
    }

    return [[...data.steps]];
  }, [data.steps, mode, request.route]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Use this lab to compare how LangChain orchestration patterns affect critical-path latency, merge complexity, and failure handling.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.8rem" }}>
        {Object.entries(MODES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setMode(key);
              setRequestIndex(0);
            }}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #d97706" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(217, 119, 6,0.15)" : "var(--bg-tertiary)",
              color: mode === key ? "#a5b4fc" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.title}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem", marginBottom: "0.85rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Example request</div>
          <div style={{ fontSize: "0.84rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.2rem" }}>{request.label}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{request.note}</div>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Critical path</div>
          <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 800 }}>{duration} time units</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{data.summary}</div>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.7rem" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Retry policy</div>
          <select
            value={retryPolicy}
            onChange={(event) => setRetryPolicy(event.target.value)}
            style={{
              marginTop: "0.15rem",
              borderRadius: "8px",
              border: "1px solid var(--glass-border)",
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              padding: "0.32rem 0.45rem",
              width: "100%",
            }}
          >
            <option value="retry-once">Retry once</option>
            <option value="fail-fast">Fail fast</option>
            <option value="fallback-branch">Fallback branch</option>
          </select>
          <div style={{ marginTop: "0.35rem", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {retryPolicy === "fallback-branch"
              ? "Best for routes where a lightweight backup path is acceptable."
              : retryPolicy === "fail-fast"
                ? "Useful when partial results are dangerous or side effects must stay atomic."
                : "A good default for transient model or network errors."}
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem", marginBottom: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
          <div>
            <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700 }}>{data.title}</div>
            <div style={{ fontSize: "0.79rem", color: "#cbd5e1", marginTop: "0.12rem" }}>{data.summary}</div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {REQUESTS[mode].map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setRequestIndex(index)}
                style={{
                  borderRadius: "999px",
                  border: requestIndex === index ? "1px solid #22d3ee" : "1px solid rgba(148,163,184,0.25)",
                  background: requestIndex === index ? "rgba(34,211,238,0.14)" : "rgba(15,23,42,0.8)",
                  color: requestIndex === index ? "#67e8f9" : "#cbd5e1",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {bars.map((lane, laneIndex) => (
            <div key={`lane-${laneIndex}`} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div style={{ width: "70px", fontSize: "0.74rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {bars.length > 1 ? `Lane ${laneIndex + 1}` : "Timeline"}
              </div>
              <div style={{ display: "flex", flex: 1, gap: "0.28rem" }}>
                {lane.map((step) => (
                  <div
                    key={`${laneIndex}-${step.label}`}
                    style={{
                      flex: step.duration,
                      opacity: step.ghost ? 0.35 : 1,
                      borderRadius: "9px",
                      border: `1px solid ${step.color}66`,
                      background: `${step.color}22`,
                      padding: "0.5rem 0.45rem",
                      minHeight: "64px",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: step.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {step.duration}u
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#f8fafc", fontWeight: 700, lineHeight: 1.3 }}>{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Architecture Guidance
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{data.advice}</p>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Failure Modes
          </div>
          <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {data.failureModes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
