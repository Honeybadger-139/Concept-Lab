"use client";

import { useMemo, useState } from "react";

const OS_OPTIONS = [
  { id: "mac", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "windows", label: "Windows" },
];

export default function DockerInstallReadinessLab() {
  const [os, setOs] = useState("mac");
  const [daemonUp, setDaemonUp] = useState(false);
  const [virtEnabled, setVirtEnabled] = useState(false);
  const [groupAccess, setGroupAccess] = useState(false);
  const [helloWorldPass, setHelloWorldPass] = useState(false);

  const assessment = useMemo(() => {
    const checks = [
      { ok: daemonUp, label: "Docker daemon is running" },
      { ok: virtEnabled, label: "Virtualization support is enabled" },
      { ok: groupAccess, label: "User has required Docker permissions" },
      { ok: helloWorldPass, label: "hello-world test succeeded" },
    ];

    const passCount = checks.filter((item) => item.ok).length;
    const score = Math.round((passCount / checks.length) * 100);

    let status = "Not Ready";
    let color = "#fca5a5";
    let nextStep =
      "Start with daemon status and run `docker info`; most installation issues are daemon or permissions related.";

    if (score >= 75) {
      status = "Almost Ready";
      color = "#fcd34d";
      nextStep =
        "Run end-to-end validation (`docker version`, `docker info`, `docker run hello-world`) and capture baseline setup docs.";
    }

    if (score === 100) {
      status = "Ready";
      color = "#86efac";
      nextStep =
        "Pin this setup as your team baseline and move to image build + local runtime validation.";
    }

    return { checks, score, status, color, nextStep };
  }, [daemonUp, groupAccess, helloWorldPass, virtEnabled]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Validate Docker installation readiness before starting real development work.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {OS_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setOs(option.id)}
            style={{
              borderRadius: 999,
              border: os === option.id ? "1px solid #22d3ee" : "1px solid var(--glass-border)",
              background: os === option.id ? "rgba(6,182,212,0.14)" : "var(--bg-tertiary)",
              color: os === option.id ? "#67e8f9" : "var(--text-secondary)",
              padding: "0.42rem 0.8rem",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {option.label}
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
            { label: "Docker daemon running", value: daemonUp, set: setDaemonUp },
            { label: "Virtualization ready", value: virtEnabled, set: setVirtEnabled },
            { label: "User permission/group access", value: groupAccess, set: setGroupAccess },
            { label: "`hello-world` validation passed", value: helloWorldPass, set: setHelloWorldPass },
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
            marginBottom: "0.6rem",
          }}
        >
          <div style={{ fontSize: "0.76rem", color: assessment.color, fontWeight: 800, marginBottom: "0.2rem" }}>
            {assessment.status} ({assessment.score}%)
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{assessment.nextStep}</div>
        </div>

        <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
          Platform focus: {os === "mac" ? "Docker Desktop + virtualization framework checks" : os === "linux" ? "daemon + socket permissions + cgroup compatibility" : "Docker Desktop + WSL2 backend + resource limits"}
        </div>
      </div>
    </div>
  );
}
