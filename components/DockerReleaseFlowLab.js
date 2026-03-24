"use client";

import { useMemo, useState } from "react";

const TAG_STRATEGIES = {
  strict: {
    label: "Immutable semantic tags",
    description: "Use app+model version tags and never mutate released tags.",
  },
  mixed: {
    label: "Semantic + latest",
    description: "Versioned tags exist, but teams also depend on latest for convenience.",
  },
  latestOnly: {
    label: "Latest only",
    description: "No stable tag contract; deployments depend on mutable references.",
  },
};

export default function DockerReleaseFlowLab() {
  const [strategy, setStrategy] = useState("strict");
  const [ciValidated, setCiValidated] = useState(true);
  const [stagingValidated, setStagingValidated] = useState(true);
  const [rollbackTagged, setRollbackTagged] = useState(true);

  const risk = useMemo(() => {
    let score = 0;
    if (strategy === "latestOnly") score += 45;
    if (strategy === "mixed") score += 20;
    if (!ciValidated) score += 25;
    if (!stagingValidated) score += 20;
    if (!rollbackTagged) score += 30;

    if (score <= 20) return { label: "Low Risk", color: "#86efac", score };
    if (score <= 50) return { label: "Moderate Risk", color: "#fcd34d", score };
    return { label: "High Risk", color: "#fca5a5", score };
  }, [ciValidated, rollbackTagged, stagingValidated, strategy]);

  const recommendation =
    risk.score <= 20
      ? "Promotion path is healthy. Keep immutable tag policy and release metadata discipline."
      : risk.score <= 50
        ? "Improve validation gating: enforce CI + staging pass before promotion and keep rollback tag ready."
        : "Stop promotion. Move away from mutable tags and restore deterministic release/rollback controls.";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Simulate Docker image release governance and assess deployment risk.
      </p>

      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {Object.entries(TAG_STRATEGIES).map(([id, item]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStrategy(id)}
            style={{
              textAlign: "left",
              borderRadius: 10,
              border: strategy === id ? "1px solid #22d3ee" : "1px solid var(--glass-border)",
              background: strategy === id ? "rgba(6,182,212,0.14)" : "rgba(15,23,42,0.65)",
              color: strategy === id ? "#67e8f9" : "var(--text-secondary)",
              padding: "0.52rem 0.65rem",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, marginBottom: "0.2rem" }}>{item.label}</div>
            <div style={{ fontSize: "0.74rem", lineHeight: 1.45 }}>{item.description}</div>
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "var(--bg-secondary)",
          padding: "0.8rem",
        }}
      >
        <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.7rem" }}>
          {[
            { label: "CI validation passed", value: ciValidated, set: setCiValidated },
            { label: "Staging validation passed", value: stagingValidated, set: setStagingValidated },
            { label: "Rollback image tag prepared", value: rollbackTagged, set: setRollbackTagged },
          ].map((item) => (
            <label
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                padding: "0.45rem 0.6rem",
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                background: "rgba(15,23,42,0.62)",
              }}
            >
              <input type="checkbox" checked={item.value} onChange={(event) => item.set(event.target.checked)} />
              {item.label}
            </label>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: 10,
            background: "rgba(15,23,42,0.7)",
            padding: "0.62rem",
            marginBottom: "0.55rem",
          }}
        >
          <div style={{ fontSize: "0.76rem", color: risk.color, fontWeight: 800, marginBottom: "0.2rem" }}>
            {risk.label} (score: {risk.score})
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{recommendation}</div>
        </div>

        <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
          Promotion sequence: build {"->"} tag {"->"} push {"->"} staging verify {"->"} production deploy {"->"} fallback to previous stable tag if needed.
        </div>
      </div>
    </div>
  );
}
