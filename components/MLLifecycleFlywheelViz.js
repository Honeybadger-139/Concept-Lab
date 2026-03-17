"use client";

import { useMemo, useState } from "react";

const STAGES = [
  { key: "scope", label: "Scope", note: "Define goal, users, and metric" },
  { key: "data", label: "Collect Data", note: "Gather and label representative inputs" },
  { key: "train", label: "Train + Eval", note: "Build baseline and run diagnostics" },
  { key: "deploy", label: "Deploy", note: "Serve model with reliability controls" },
  { key: "monitor", label: "Monitor", note: "Track drift, latency, and quality" },
  { key: "update", label: "Update", note: "Retrain or patch as world changes" },
];

export default function MLLifecycleFlywheelViz() {
  const [active, setActive] = useState("scope");
  const [drift, setDrift] = useState(35);
  const [incidentRate, setIncidentRate] = useState(12);

  const health = useMemo(() => {
    const reliability = Math.max(0, 100 - incidentRate * 3);
    const retrainUrgency = Math.min(100, drift * 0.8 + incidentRate * 1.2);
    return { reliability, retrainUrgency };
  }, [drift, incidentRate]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        A production ML system is a loop, not a one-time training event. Strong teams keep the full cycle healthy: scope, data, train, deploy, monitor, and update.
      </p>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.35rem" }}>Lifecycle flywheel</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem" }}>
          {STAGES.map((stage) => {
            const selected = active === stage.key;
            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => setActive(stage.key)}
                style={{
                  borderRadius: "10px",
                  border: selected ? "1px solid #3b82f6" : "1px solid rgba(148,163,184,0.22)",
                  background: selected ? "rgba(59,130,246,0.14)" : "rgba(15,23,42,0.75)",
                  color: selected ? "#dbeafe" : "#cbd5e1",
                  padding: "0.55rem 0.65rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{stage.label}</div>
                <div style={{ marginTop: "0.18rem", fontSize: "0.72rem", lineHeight: 1.45 }}>{stage.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Data drift signal: {drift}%
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={drift}
              onChange={(event) => setDrift(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
            Incident rate (per month): {incidentRate}
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={incidentRate}
              onChange={(event) => setIncidentRate(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Operational indicators
          </div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div style={{ borderRadius: "10px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", padding: "0.5rem 0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700 }}>System reliability</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>{health.reliability.toFixed(1)}%</div>
            </div>
            <div style={{ borderRadius: "10px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", padding: "0.5rem 0.6rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700 }}>Retrain urgency</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>{health.retrainUrgency.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Active-stage focus
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {STAGES.find((stage) => stage.key === active)?.note}. Keep this connected to the rest of the flywheel: each stage should produce artifacts that make the next stage easier, safer, and more reproducible.
        </p>
      </div>
    </div>
  );
}
