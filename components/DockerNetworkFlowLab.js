"use client";

import { useMemo, useState } from "react";

const MODES = {
  bridge: {
    label: "Bridge network",
    summary:
      "Containers communicate over an isolated bridge while selected ports are published to the host.",
    strengths: [
      "Good default for multi-service apps on one host.",
      "Keeps internal communication explicit and scoped.",
      "Works well with Compose service discovery patterns.",
    ],
    caution:
      "A running container is not externally reachable unless port publishing is configured correctly.",
  },
  host: {
    label: "Host network",
    summary:
      "Container shares the host network namespace. Useful in specific low-latency or system-level scenarios.",
    strengths: [
      "No separate container network namespace overhead.",
      "Can simplify certain host-integrated network workloads.",
      "Useful for advanced diagnostics in some environments.",
    ],
    caution:
      "Reduces isolation and increases risk of port conflicts and unclear service boundaries.",
  },
  none: {
    label: "None network",
    summary:
      "Container has no external networking. Suitable for strict isolation or offline-style processing jobs.",
    strengths: [
      "Strong isolation from external systems.",
      "Useful for controlled compute jobs without network dependency.",
      "Can enforce safer boundaries for sensitive workflows.",
    ],
    caution:
      "No outbound API/database access unless networking is added later.",
  },
};

function FlowCard({ title, detail, active }) {
  return (
    <div
      style={{
        border: active ? "1px solid rgba(6,182,212,0.35)" : "1px solid var(--glass-border)",
        borderRadius: 12,
        background: active ? "rgba(8,47,73,0.18)" : "rgba(15,23,42,0.6)",
        padding: "0.7rem",
      }}
    >
      <div style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.25rem" }}>
        {title}
      </div>
      <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        {detail}
      </div>
    </div>
  );
}

export default function DockerNetworkFlowLab() {
  const [mode, setMode] = useState("bridge");
  const [publishPort, setPublishPort] = useState(true);
  const [sameNetwork, setSameNetwork] = useState(true);
  const [dependencyHealthy, setDependencyHealthy] = useState(true);

  const selected = MODES[mode];

  const diagnosis = useMemo(() => {
    if (mode === "none") {
      return {
        status: "isolated",
        color: "#facc15",
        message:
          "Container is intentionally isolated. Network calls will fail by design until networking is enabled.",
      };
    }

    if (mode === "host") {
      return {
        status: "host-shared",
        color: "#86efac",
        message:
          "Service shares host networking. Verify host-level port usage and avoid assumptions about container isolation.",
      };
    }

    if (!publishPort) {
      return {
        status: "internal-only",
        color: "#fdba74",
        message:
          "Container may be reachable internally but not from the host/browser because no port is published.",
      };
    }

    if (!sameNetwork) {
      return {
        status: "network-mismatch",
        color: "#fca5a5",
        message:
          "Service-to-service calls may fail because containers are not on the same bridge/custom network.",
      };
    }

    if (!dependencyHealthy) {
      return {
        status: "downstream-failure",
        color: "#fca5a5",
        message:
          "Primary service can be up while downstream dependency is unavailable. Check DB/cache/vector-store connectivity.",
      };
    }

    return {
      status: "healthy",
      color: "#86efac",
      message:
        "Traffic path is coherent: host can reach published service, and internal dependencies are on the same network.",
    };
  }, [dependencyHealthy, mode, publishPort, sameNetwork]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Explore Docker traffic flow and debug common connectivity failures in multi-container systems.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {Object.entries(MODES).map(([id, m]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            style={{
              borderRadius: 999,
              border: mode === id ? "1px solid #06b6d4" : "1px solid var(--glass-border)",
              background: mode === id ? "rgba(6,182,212,0.12)" : "var(--bg-tertiary)",
              color: mode === id ? "#67e8f9" : "var(--text-secondary)",
              padding: "0.42rem 0.8rem",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "var(--bg-secondary)",
          padding: "0.85rem",
        }}
      >
        <div style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {selected.summary}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem", marginBottom: "0.85rem" }}>
          <FlowCard title="Host -> Service" detail={publishPort ? "Published port allows host/browser entry." : "No published port. External clients cannot enter."} active={publishPort} />
          <FlowCard title="Service -> Dependency" detail={sameNetwork ? "Containers share network path." : "Network mismatch blocks internal DNS/traffic."} active={sameNetwork} />
          <FlowCard title="Dependency Health" detail={dependencyHealthy ? "Downstream service is reachable." : "Dependency unavailable or misconfigured."} active={dependencyHealthy} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.6rem", marginBottom: "0.85rem" }}>
          {[
            { label: "Publish host port", value: publishPort, setter: setPublishPort, disabled: mode === "none" },
            { label: "Containers on same network", value: sameNetwork, setter: setSameNetwork, disabled: mode !== "bridge" },
            { label: "Dependency healthy", value: dependencyHealthy, setter: setDependencyHealthy, disabled: mode === "none" },
          ].map((control) => (
            <label
              key={control.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                fontSize: "0.8rem",
                color: control.disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                padding: "0.5rem 0.6rem",
                background: "rgba(15,23,42,0.55)",
              }}
            >
              <input
                type="checkbox"
                checked={control.value}
                disabled={control.disabled}
                onChange={(event) => control.setter(event.target.checked)}
              />
              {control.label}
            </label>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--glass-border)",
            borderRadius: 10,
            background: "rgba(15,23,42,0.65)",
            padding: "0.65rem",
          }}
        >
          <div style={{ fontSize: "0.78rem", color: diagnosis.color, fontWeight: 800, marginBottom: "0.25rem", textTransform: "uppercase" }}>
            Status: {diagnosis.status}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {diagnosis.message}
          </div>
        </div>

        <div style={{ marginTop: "0.8rem", border: "1px dashed var(--glass-border)", borderRadius: 10, padding: "0.6rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.25rem" }}>
            Bridge-mode strengths
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {selected.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div style={{ marginTop: "0.45rem", fontSize: "0.76rem", color: "#fdba74" }}>
            {selected.caution}
          </div>
        </div>
      </div>
    </div>
  );
}
