"use client";

import { useMemo, useState } from "react";

const MODES = {
  api: {
    label: "Run API",
    title: "Publish a web or model API",
    explanation:
      "Use this when a containerized service needs to be reachable from your host machine through a published port.",
    baseImage: "scoring-api:1.0",
    checklist: [
      "Confirm the application listens on the container port, not only on localhost.",
      "Publish a host port with `-p`.",
      "Tag the image clearly so rollback is possible.",
    ],
  },
  debug: {
    label: "Debug",
    title: "Inspect a failing container",
    explanation:
      "The fastest debugging loop is usually logs first, then interactive shell access if the process is still alive.",
    baseImage: "feature-pipeline:dev",
    checklist: [
      "Check whether the process exited or is still alive.",
      "Read logs before changing anything.",
      "Inspect environment variables, files, and network assumptions from inside the container if needed.",
    ],
  },
  volume: {
    label: "Persist data",
    title: "Mount storage into the container",
    explanation:
      "Use named volumes for Docker-managed persistence or bind mounts for development-time host file sharing.",
    baseImage: "postgres:16",
    checklist: [
      "Choose named volume for durable service state.",
      "Choose bind mount when host files should remain the source of truth.",
      "Avoid treating mutable state as part of the image.",
    ],
  },
  compose: {
    label: "Compose stack",
    title: "Bring up a local multi-service system",
    explanation:
      "Compose is best when your app depends on another service such as a database, cache, or tracking system.",
    baseImage: "compose.yaml",
    checklist: [
      "Describe services declaratively instead of chaining long `docker run` commands.",
      "Keep shared config visible in one file.",
      "Use service names for internal communication where appropriate.",
    ],
  },
};

function TerminalBlock({ title, body }) {
  return (
    <div
      style={{
        border: "1px solid var(--glass-border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#09101d",
      }}
    >
      <div
        style={{
          padding: "0.45rem 0.65rem",
          fontSize: "0.72rem",
          color: "var(--text-tertiary)",
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(15,23,42,0.85)",
        }}
      >
        {title}
      </div>
      <pre
        style={{
          margin: 0,
          padding: "0.8rem",
          overflowX: "auto",
          color: "#c4f1ff",
          fontSize: "0.8rem",
          lineHeight: 1.55,
          fontFamily: "var(--font-mono)",
        }}
      >
        <code>{body}</code>
      </pre>
    </div>
  );
}

export default function DockerCommandWorkbench() {
  const [mode, setMode] = useState("api");
  const [image, setImage] = useState("scoring-api:1.0");
  const [name, setName] = useState("scoring-api");
  const [hostPort, setHostPort] = useState("8000");
  const [containerPort, setContainerPort] = useState("8000");
  const [envKey, setEnvKey] = useState("MODEL_NAME");
  const [envValue, setEnvValue] = useState("fraud_v3");
  const [volumeName, setVolumeName] = useState("pgdata");
  const [mountPath, setMountPath] = useState("/var/lib/postgresql/data");

  const active = MODES[mode];

  const generated = useMemo(() => {
    if (mode === "api") {
      return {
        primary: `docker run -d --name ${name} -p ${hostPort}:${containerPort} -e ${envKey}=${envValue} ${image}`,
        support: `docker ps\ndocker logs -f ${name}\ndocker exec -it ${name} sh`,
      };
    }

    if (mode === "debug") {
      return {
        primary: `docker ps -a\ndocker logs ${name}\ndocker inspect ${name}`,
        support: `# If the container is still running\ndocker exec -it ${name} sh\n\n# Common checks\nprintenv\nls -la\nnetstat -tulpn 2>/dev/null || ss -tulpn`,
      };
    }

    if (mode === "volume") {
      return {
        primary: `docker run -d --name ${name} -v ${volumeName}:${mountPath} ${image}`,
        support: `# Development bind mount example\ndocker run -it --rm --name ${name}-dev -v $(pwd):/app ${image} sh`,
      };
    }

    return {
      primary: `docker compose up -d\n\ndocker compose ps\ndocker compose logs -f`,
      support: `services:\n  api:\n    image: ${image}\n    ports:\n      - "${hostPort}:${containerPort}"\n    environment:\n      ${envKey}: ${envValue}`,
    };
  }, [containerPort, envKey, envValue, hostPort, image, mode, mountPath, name, volumeName]);

  const diagnosticNote = useMemo(() => {
    if (mode === "api") {
      return "If the API is 'running' but unreachable, check whether the app is actually listening on the container port and whether the published host port matches your browser or client request.";
    }
    if (mode === "debug") {
      return "Logs tell you whether the process died. `inspect` tells you how the container was configured. `exec` lets you validate assumptions from inside the runtime.";
    }
    if (mode === "volume") {
      return "Use a named volume when the state belongs to the service lifecycle. Use a bind mount when the host files should stay editable and visible outside Docker.";
    }
    return "Compose is strongest when you need repeatability across multiple services. Think of it as infrastructure configuration for your local stack.";
  }, [mode]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Build a Docker command sequence by scenario and use it as a mental model for container operations.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {Object.entries(MODES).map(([id, item]) => {
          const activeMode = id === mode;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                setImage(item.baseImage);
              }}
              style={{
                borderRadius: 999,
                border: activeMode ? "1px solid #f59e0b" : "1px solid var(--glass-border)",
                background: activeMode ? "rgba(245,158,11,0.12)" : "var(--bg-tertiary)",
                color: activeMode ? "#fcd34d" : "var(--text-secondary)",
                padding: "0.45rem 0.78rem",
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
          background: "var(--bg-secondary)",
          padding: "0.9rem",
        }}
      >
        <div style={{ marginBottom: "0.85rem" }}>
          <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#fcd34d", marginBottom: "0.28rem" }}>
            {active.title}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {active.explanation}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "0.65rem",
            marginBottom: "0.9rem",
          }}
        >
          {[
            { label: "Image / source", value: image, setter: setImage },
            { label: "Container name", value: name, setter: setName },
            { label: "Host port", value: hostPort, setter: setHostPort },
            { label: "Container port", value: containerPort, setter: setContainerPort },
            { label: "Env key", value: envKey, setter: setEnvKey },
            { label: "Env value", value: envValue, setter: setEnvValue },
            { label: "Volume name", value: volumeName, setter: setVolumeName },
            { label: "Mount path", value: mountPath, setter: setMountPath },
          ].map((field) => (
            <label key={field.label} style={{ display: "grid", gap: "0.25rem", fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
              <span>{field.label}</span>
              <input
                value={field.value}
                onChange={(event) => field.setter(event.target.value)}
                style={{
                  border: "1px solid var(--glass-border)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  borderRadius: 8,
                  padding: "0.45rem 0.55rem",
                  fontSize: "0.8rem",
                }}
              />
            </label>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "0.8rem",
          }}
        >
          <TerminalBlock title="Primary Command Flow" body={generated.primary} />
          <TerminalBlock title={mode === "compose" ? "Compose Snippet" : "Follow-up Debugging"} body={generated.support} />
        </div>
      </div>

      <div
        style={{
          marginTop: "0.9rem",
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
            Thinking Checklist
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6 }}>
            {active.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            border: "1px solid rgba(245,158,11,0.22)",
            borderRadius: 12,
            background: "rgba(120,53,15,0.14)",
            padding: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fcd34d", marginBottom: "0.35rem" }}>
            Interpretation
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {diagnosticNote}
          </div>
        </div>
      </div>
    </div>
  );
}
