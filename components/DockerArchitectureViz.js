"use client";

import { useMemo, useState } from "react";

const SCENARIOS = {
  reproducibility: {
    label: "Reproducibility",
    title: "Why teams adopt Docker",
    summary:
      "Docker replaces per-machine setup drift with one portable runtime definition that can move through local dev, CI, and deployment.",
    stages: [
      { title: "Source + config", detail: "Application code, dependency manifests, startup assumptions." },
      { title: "Docker image", detail: "Versioned runtime artifact built once and shared safely." },
      { title: "Containers", detail: "Same image started on laptops, CI, staging, and production." },
    ],
    takeaways: [
      "Manual setup becomes executable infrastructure.",
      "Debugging shifts from many ad-hoc machines to one declared environment.",
      "This is especially valuable when ML and data stacks depend on system libraries.",
    ],
    metrics: { portability: 5, isolation: 4, startupSpeed: 5 },
  },
  layers: {
    label: "Image layers",
    title: "How Docker layering works",
    summary:
      "Each Dockerfile instruction usually creates a cacheable layer. Order stable steps early so rebuilds stay fast.",
    stages: [
      { title: "Base image", detail: "OS userspace + runtime baseline such as Python or Node." },
      { title: "Dependencies", detail: "Install libraries from requirements or package manifests." },
      { title: "Application code", detail: "Copy the fast-changing source last to preserve cache." },
    ],
    takeaways: [
      "Small source edits should not reinstall the entire dependency stack.",
      "Layer order affects developer feedback loops and CI speed.",
      "In AI services, large runtime stacks make caching even more valuable.",
    ],
    metrics: { portability: 4, isolation: 4, startupSpeed: 4 },
  },
  compose: {
    label: "Compose stack",
    title: "A local multi-service architecture",
    summary:
      "Compose turns a group of cooperating containers into one declarative local system with shared networking and persistent state.",
    stages: [
      { title: "API service", detail: "Model-serving or application container with published port." },
      { title: "Stateful dependency", detail: "Database, cache, vector store, or object-store emulator." },
      { title: "Shared network + volume", detail: "Service discovery plus durable data where needed." },
    ],
    takeaways: [
      "One file can describe ports, env vars, volumes, and service dependencies.",
      "Service names often act as hostnames within the stack.",
      "Compose is ideal for rehearsing systems before heavier orchestration.",
    ],
    metrics: { portability: 5, isolation: 4, startupSpeed: 4 },
  },
  networking: {
    label: "Networking",
    title: "Traffic paths in Docker",
    summary:
      "Networking determines how containers talk to each other, the host machine, and external systems.",
    stages: [
      { title: "Host -> published port", detail: "Browser or CLI reaches a service through port mapping." },
      { title: "Container -> container", detail: "Services talk over a shared bridge or custom network." },
      { title: "Container -> outside world", detail: "External APIs, databases, registries, telemetry sinks." },
    ],
    takeaways: [
      "Internal service communication and external exposure are separate concerns.",
      "Custom bridge networks make local systems easier to reason about.",
      "Many production incidents are connectivity or config issues, not app-code issues.",
    ],
    metrics: { portability: 4, isolation: 5, startupSpeed: 5 },
  },
};

function Metric({ label, value, color }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--text-tertiary)",
          marginBottom: "0.2rem",
        }}
      >
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: "rgba(148,163,184,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * 20}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function DockerArchitectureViz() {
  const [activeId, setActiveId] = useState("reproducibility");
  const scenario = SCENARIOS[activeId];

  const comparison = useMemo(() => {
    if (activeId === "reproducibility") {
      return {
        leftLabel: "Manual machine setup",
        leftNote: "Fast to begin, hard to keep aligned across many environments.",
        rightLabel: "Dockerized runtime",
        rightNote: "Slight upfront effort, much better repeatability and team scaling.",
      };
    }

    if (activeId === "layers") {
      return {
        leftLabel: "Poor Dockerfile ordering",
        leftNote: "Every code edit can invalidate expensive install steps.",
        rightLabel: "Cache-aware Dockerfile",
        rightNote: "Stable layers are reused and rebuild loops stay much shorter.",
      };
    }

    if (activeId === "compose") {
      return {
        leftLabel: "Many manual run commands",
        leftNote: "Harder to review, share, and restart consistently.",
        rightLabel: "Compose-defined stack",
        rightNote: "Ports, volumes, services, and networks are declared in one place.",
      };
    }

    return {
      leftLabel: "Implicit connectivity assumptions",
      leftNote: "Services may be running but still unreachable for subtle reasons.",
      rightLabel: "Explicit network design",
      rightNote: "You can reason about internal traffic, published ports, and isolation separately.",
    };
  }, [activeId]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Explore the architecture patterns behind Docker instead of memorizing commands in isolation.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {Object.entries(SCENARIOS).map(([id, item]) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveId(id)}
              style={{
                borderRadius: 999,
                border: active ? "1px solid #06b6d4" : "1px solid var(--glass-border)",
                background: active ? "rgba(6,182,212,0.12)" : "var(--bg-tertiary)",
                color: active ? "#67e8f9" : "var(--text-secondary)",
                padding: "0.45rem 0.8rem",
                fontSize: "0.74rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 14,
          background: "linear-gradient(180deg, rgba(8,13,26,0.92), rgba(14,21,37,0.92))",
          padding: "0.9rem",
        }}
      >
        <div style={{ marginBottom: "0.8rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#67e8f9", marginBottom: "0.28rem" }}>
            {scenario.title}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {scenario.summary}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.65rem",
            marginBottom: "0.9rem",
          }}
        >
          {scenario.stages.map((stage, index) => (
            <div key={stage.title} style={{ display: "flex", alignItems: "stretch", gap: "0.5rem" }}>
              <div
                style={{
                  flex: 1,
                  border: "1px solid rgba(103,232,249,0.2)",
                  borderRadius: 12,
                  background: "rgba(15,23,42,0.68)",
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "#67e8f9", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                  Step {index + 1}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.28rem" }}>
                  {stage.title}
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {stage.detail}
                </div>
              </div>
              {index < scenario.stages.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    alignSelf: "center",
                    color: "#67e8f9",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    paddingTop: "0.2rem",
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "0.8rem",
          }}
        >
          <div
            style={{
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              background: "rgba(15,23,42,0.58)",
              padding: "0.8rem",
            }}
          >
            <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.45rem", fontWeight: 700 }}>
              Architectural Takeaways
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6 }}>
              {scenario.takeaways.map((item) => (
                <li key={item} style={{ marginBottom: "0.25rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              background: "rgba(15,23,42,0.58)",
              padding: "0.8rem",
            }}
          >
            <Metric label="Portability" value={scenario.metrics.portability} color="linear-gradient(90deg, #22d3ee, #0891b2)" />
            <Metric label="Isolation" value={scenario.metrics.isolation} color="linear-gradient(90deg, #67e8f9, #0ea5e9)" />
            <Metric label="Operational speed" value={scenario.metrics.startupSpeed} color="linear-gradient(90deg, #facc15, #f59e0b)" />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "0.9rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.7rem",
        }}
      >
        {[comparison.leftLabel, comparison.rightLabel].map((label, index) => (
          <div
            key={label}
            style={{
              borderRadius: 12,
              border: `1px solid ${index === 0 ? "rgba(248,113,113,0.22)" : "rgba(34,197,94,0.22)"}`,
              background: index === 0 ? "rgba(127,29,29,0.14)" : "rgba(20,83,45,0.14)",
              padding: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: index === 0 ? "#fca5a5" : "#86efac", marginBottom: "0.28rem" }}>
              {label}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {index === 0 ? comparison.leftNote : comparison.rightNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
