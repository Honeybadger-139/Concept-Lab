"use client";

import { useMemo, useState } from "react";

const SCENARIOS = {
  history: {
    title: "Message Roles And History",
    summary:
      "LangChain conversations are explicit message arrays. The model only knows what you send in the current request.",
    timeline: [
      { label: "SystemMessage", color: "#fbbf24", detail: "Defines role, tone, and operating constraints." },
      { label: "HumanMessage", color: "#60a5fa", detail: "Carries the user's current question or instruction." },
      { label: "AIMessage", color: "#10b981", detail: "Stores the assistant reply so later turns can refer back to it." },
      { label: "Next HumanMessage", color: "#60a5fa", detail: "Arrives with the earlier messages replayed as context." },
    ],
    risks: [
      "Dropping the system message changes behavior unexpectedly.",
      "Duplicating prior turns can over-weight earlier instructions.",
      "Long conversations eventually exceed the context window and need trimming or summarization.",
    ],
    takeaway:
      "Conversation memory is simulated by replaying structured messages, not by relying on hidden model memory.",
  },
  loop: {
    title: "Local Real-Time Conversation Loop",
    summary:
      "A terminal chat app is usually a simple while-loop that keeps mutating one chat_history list in memory.",
    timeline: [
      { label: "Prompt User", color: "#f59e0b", detail: "Read one query from stdin or the UI input box." },
      { label: "Append Human", color: "#60a5fa", detail: "Push the new HumanMessage into chat_history." },
      { label: "Invoke Model", color: "#22c55e", detail: "Send the full message list to the provider." },
      { label: "Append AI", color: "#10b981", detail: "Save the AI reply so follow-up questions inherit context." },
    ],
    risks: [
      "Memory disappears on process restart because the history lives only in RAM.",
      "If multiple users share one list, conversations bleed into each other.",
      "Missing an exit condition or cancellation path produces poor CLI and UI behavior.",
    ],
    takeaway:
      "This loop is the conceptual bridge between a demo script and a real chat product.",
  },
  cloud: {
    title: "Cloud-Persisted Session History",
    summary:
      "Production chat systems load prior turns from storage, invoke the model, then write the new turn back under a stable session key.",
    timeline: [
      { label: "session_id", color: "#f97316", detail: "Choose the conversation bucket before any model call happens." },
      { label: "Load Messages", color: "#38bdf8", detail: "Fetch prior messages from Redis, Firestore, SQL, or another store." },
      { label: "Generate Reply", color: "#22c55e", detail: "Run the model using restored history plus the new input." },
      { label: "Persist Turn", color: "#eab308", detail: "Write the latest human and AI messages back to storage." },
    ],
    risks: [
      "Out-of-order writes can corrupt chronology if concurrent requests share a session.",
      "PII retention without TTLs or governance becomes a compliance problem quickly.",
      "Partial failures require idempotent writes so a retry does not duplicate messages.",
    ],
    takeaway:
      "Durable chat products are really small state machines built around identity, persistence, and replay.",
  },
};

function MetricCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid var(--glass-border)",
        borderRadius: "10px",
        background: "var(--bg-tertiary)",
        padding: "0.55rem 0.65rem",
      }}
    >
      <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function LangChainMemoryFlowViz() {
  const [mode, setMode] = useState("history");
  const [turns, setTurns] = useState(4);
  const [storage, setStorage] = useState("Firestore");

  const scenario = SCENARIOS[mode];

  const metrics = useMemo(() => {
    const messageCount = mode === "history" ? turns : turns * 2 + 1;
    const persistence = mode === "cloud" ? "Durable" : "Volatile";
    const scaling = mode === "cloud" ? "Multi-session ready" : "Single-process";

    return {
      messageCount: `${messageCount} messages`,
      persistence,
      scaling,
    };
  }, [mode, turns]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Explore how LangChain chat applications move from a simple message list to a durable session architecture. Each view shows the state object the model actually sees.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.8rem" }}>
        {Object.entries(SCENARIOS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #10b981" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(16,185,129,0.14)" : "var(--bg-tertiary)",
              color: mode === key ? "#34d399" : "var(--text-secondary)",
              padding: "0.36rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.title}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.85rem" }}>
        <MetricCard label="History Size" value={metrics.messageCount} />
        <MetricCard label="Persistence" value={metrics.persistence} />
        <MetricCard label="Deployment Shape" value={metrics.scaling} />
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.88rem", color: "#ecfeff", fontWeight: 700, marginBottom: "0.35rem" }}>{scenario.title}</div>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>{scenario.summary}</p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "0.38rem" }}>
          {scenario.timeline.map((step, index) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "0.38rem", flex: "1 1 180px", minWidth: "180px" }}>
              <div
                style={{
                  flex: 1,
                  borderRadius: "10px",
                  border: `1px solid ${step.color}55`,
                  background: `${step.color}18`,
                  padding: "0.55rem 0.6rem",
                }}
              >
                <div style={{ fontSize: "0.74rem", color: step.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Step {index + 1}
                </div>
                <div style={{ fontSize: "0.84rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.2rem" }}>{step.label}</div>
                <div style={{ fontSize: "0.76rem", color: "#cbd5e1", lineHeight: 1.45 }}>{step.detail}</div>
              </div>
              {index < scenario.timeline.length - 1 && (
                <div style={{ color: "#22d3ee", fontWeight: 800, fontSize: "0.88rem" }}>{"->"}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0.75rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
              Session Controls
            </div>
            <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Turns
                <input type="range" min="2" max="8" value={turns} onChange={(event) => setTurns(Number(event.target.value))} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Store
                <select
                  value={storage}
                  onChange={(event) => setStorage(event.target.value)}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid var(--glass-border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    padding: "0.24rem 0.45rem",
                  }}
                >
                  <option>Firestore</option>
                  <option>Redis</option>
                  <option>Postgres</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{ border: "1px dashed var(--glass-border)", borderRadius: "10px", padding: "0.7rem", background: "rgba(15,23,42,0.45)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.35rem" }}>Representative payload</div>
            <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#fcd34d", whiteSpace: "pre-wrap" }}>{`session_id: user-42\nstorage: ${storage}\nmessages:\n  - system: You are a helpful assistant.\n  - human: Summarize the last release.\n  - ai: The release added evaluation dashboards.\n  - human: What changed for monitoring?\n  ${mode === "cloud" ? "- persisted_at: 2026-03-17T11:20:00Z" : "- lifecycle: process-memory only"}`}</pre>
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
            Failure Modes To Watch
          </div>
          <ul style={{ margin: "0 0 0.65rem", paddingLeft: "1rem", fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {scenario.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(16,185,129,0.08)", borderLeft: "3px solid #10b981", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "#34d399" }}>Design takeaway:</strong> {scenario.takeaway}
          </div>
        </div>
      </div>
    </div>
  );
}
