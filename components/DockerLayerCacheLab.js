"use client";

import { useMemo, useState } from "react";

const STEP_LIBRARY = {
  base: {
    id: "base",
    label: "FROM base image",
    stability: "stable",
    note: "Changes rarely unless runtime major version changes.",
  },
  workdir: {
    id: "workdir",
    label: "WORKDIR /app",
    stability: "stable",
    note: "Mostly static path declaration.",
  },
  copyReq: {
    id: "copyReq",
    label: "COPY requirements.txt .",
    stability: "medium",
    note: "Changes only when dependencies change.",
  },
  runInstall: {
    id: "runInstall",
    label: "RUN pip install -r requirements.txt",
    stability: "medium",
    note: "Expensive step; should be cache-friendly.",
  },
  copySrc: {
    id: "copySrc",
    label: "COPY . .",
    stability: "volatile",
    note: "Frequent app code edits invalidate this step often.",
  },
  cmd: {
    id: "cmd",
    label: "CMD [\"uvicorn\", ...]",
    stability: "medium",
    note: "Occasionally changes with runtime entrypoint updates.",
  },
};

const GOOD_ORDER = ["base", "workdir", "copyReq", "runInstall", "copySrc", "cmd"];
const BAD_ORDER = ["base", "copySrc", "copyReq", "runInstall", "workdir", "cmd"];

function getStabilityWeight(stability) {
  if (stability === "stable") return 3;
  if (stability === "medium") return 2;
  return 1;
}

export default function DockerLayerCacheLab() {
  const [orderMode, setOrderMode] = useState("good");
  const [sourceChanged, setSourceChanged] = useState(true);
  const [requirementsChanged, setRequirementsChanged] = useState(false);
  const [baseChanged, setBaseChanged] = useState(false);

  const stepOrder = orderMode === "good" ? GOOD_ORDER : BAD_ORDER;

  const simulation = useMemo(() => {
    const invalidators = new Set();
    if (sourceChanged) invalidators.add("copySrc");
    if (requirementsChanged) {
      invalidators.add("copyReq");
      invalidators.add("runInstall");
    }
    if (baseChanged) invalidators.add("base");

    let cacheBroken = false;
    let rebuilt = 0;
    let cached = 0;
    const details = stepOrder.map((stepId) => {
      const step = STEP_LIBRARY[stepId];
      if (invalidators.has(stepId)) cacheBroken = true;
      if (cacheBroken) {
        rebuilt += 1;
      } else {
        cached += 1;
      }
      return {
        ...step,
        status: cacheBroken ? "rebuilt" : "cached",
      };
    });

    const score =
      details.reduce((acc, step, idx) => {
        const weight = getStabilityWeight(step.stability);
        const positionBonus = details.length - idx;
        return acc + weight * positionBonus;
      }, 0) +
      cached * 4 -
      rebuilt * 2;

    return {
      details,
      rebuilt,
      cached,
      score,
    };
  }, [baseChanged, requirementsChanged, sourceChanged, stepOrder]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Simulate Docker layer cache behavior by changing Dockerfile order and edit patterns.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
        <button
          type="button"
          onClick={() => setOrderMode("good")}
          style={{
            borderRadius: 999,
            border: orderMode === "good" ? "1px solid #22c55e" : "1px solid var(--glass-border)",
            background: orderMode === "good" ? "rgba(34,197,94,0.12)" : "var(--bg-tertiary)",
            color: orderMode === "good" ? "#86efac" : "var(--text-secondary)",
            padding: "0.42rem 0.8rem",
            fontSize: "0.74rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Cache-Friendly Order
        </button>
        <button
          type="button"
          onClick={() => setOrderMode("bad")}
          style={{
            borderRadius: 999,
            border: orderMode === "bad" ? "1px solid #f97316" : "1px solid var(--glass-border)",
            background: orderMode === "bad" ? "rgba(249,115,22,0.12)" : "var(--bg-tertiary)",
            color: orderMode === "bad" ? "#fdba74" : "var(--text-secondary)",
            padding: "0.42rem 0.8rem",
            fontSize: "0.74rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Cache-Poor Order
        </button>
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "var(--bg-secondary)",
          padding: "0.85rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.65rem", marginBottom: "0.85rem" }}>
          {[
            { label: "Source code changed", value: sourceChanged, setter: setSourceChanged },
            { label: "Dependencies changed", value: requirementsChanged, setter: setRequirementsChanged },
            { label: "Base image changed", value: baseChanged, setter: setBaseChanged },
          ].map((control) => (
            <label
              key={control.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                padding: "0.5rem 0.6rem",
                background: "rgba(15,23,42,0.55)",
              }}
            >
              <input
                type="checkbox"
                checked={control.value}
                onChange={(event) => control.setter(event.target.checked)}
              />
              {control.label}
            </label>
          ))}
        </div>

        <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.85rem" }}>
          {simulation.details.map((step, idx) => (
            <div
              key={step.id}
              style={{
                display: "grid",
                gridTemplateColumns: "28px minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "0.6rem",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                padding: "0.48rem 0.55rem",
                background: step.status === "cached" ? "rgba(22,163,74,0.1)" : "rgba(249,115,22,0.1)",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  background: "rgba(148,163,184,0.25)",
                }}
              >
                {idx + 1}
              </span>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 700 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>{step.note}</div>
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: step.status === "cached" ? "#86efac" : "#fdba74",
                  textTransform: "uppercase",
                }}
              >
                {step.status}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
          <div
            style={{
              border: "1px solid rgba(22,163,74,0.25)",
              borderRadius: 10,
              background: "rgba(20,83,45,0.16)",
              padding: "0.55rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#86efac", fontWeight: 800, marginBottom: "0.2rem" }}>
              Cached Layers
            </div>
            <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 800 }}>
              {simulation.cached}
            </div>
          </div>
          <div
            style={{
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 10,
              background: "rgba(124,45,18,0.18)",
              padding: "0.55rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#fdba74", fontWeight: 800, marginBottom: "0.2rem" }}>
              Rebuilt Layers
            </div>
            <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 800 }}>
              {simulation.rebuilt}
            </div>
          </div>
          <div
            style={{
              border: "1px solid var(--glass-border)",
              borderRadius: 10,
              background: "rgba(15,23,42,0.58)",
              padding: "0.55rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 800, marginBottom: "0.2rem" }}>
              Cache Efficiency Score
            </div>
            <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 800 }}>
              {simulation.score}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
