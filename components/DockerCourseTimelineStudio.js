"use client";

import { useMemo, useState } from "react";

const CHAPTERS = [
  {
    id: "intro",
    timestamp: "00:01:40",
    title: "Introduction to Docker",
    transcriptFocus: [
      "It works on my machine problem in team setups.",
      "Environment drift across Node/Mongo versions.",
      "Why containerization improves reproducibility.",
    ],
    architecture: "Code + deps -> image -> container -> same behavior in dev/CI/prod",
    dsScenario:
      "A fraud model API behaves differently between laptop and server because Python package versions differ.",
  },
  {
    id: "install",
    timestamp: "00:14:50",
    title: "Docker Installation",
    transcriptFocus: [
      "Install is successful only when daemon path is healthy.",
      "CLI-only validation is incomplete.",
      "hello-world check validates end-to-end flow.",
    ],
    architecture: "docker CLI -> docker daemon -> image pull/build -> container runtime",
    dsScenario:
      "A data engineer can build images but cannot run containers because daemon permissions are missing.",
  },
  {
    id: "commands",
    timestamp: "00:21:00",
    title: "Docker Commands",
    transcriptFocus: [
      "Image and container lifecycle commands.",
      "Practical command usage for run, logs, exec.",
      "Operational command fluency for debugging.",
    ],
    architecture: "build path + run path + debug path",
    dsScenario:
      "A recommendation API crash is diagnosed quickly via ps, logs, inspect, and exec.",
  },
  {
    id: "layers",
    timestamp: "00:34:13",
    title: "Docker Image Layers",
    transcriptFocus: [
      "How Dockerfile instructions create layers.",
      "Why cache behavior affects build speed.",
      "Layer ordering strategy for faster rebuilds.",
    ],
    architecture: "stable layers first -> volatile layers later",
    dsScenario:
      "Rebuilding an NLP serving image should not reinstall all dependencies when only source code changed.",
  },
  {
    id: "ports",
    timestamp: "00:37:08",
    title: "Port Binding",
    transcriptFocus: [
      "Map host traffic to container service port.",
      "Container can run yet still be unreachable.",
      "Listener and mapping alignment is critical.",
    ],
    architecture: "client -> host port -> mapped container port -> app listener",
    dsScenario:
      "A model endpoint is live in container but inaccessible until host:container mapping is corrected.",
  },
  {
    id: "troubleshoot",
    timestamp: "00:42:45",
    title: "Troubleshoot Commands and Logs",
    transcriptFocus: [
      "Log-driven diagnosis flow.",
      "Config and runtime metadata checks via inspect.",
      "In-container checks with exec for root-cause clarity.",
    ],
    architecture: "state check -> logs -> inspect -> exec -> resource review",
    dsScenario:
      "A pipeline worker starts but fails silently because an env variable for model path is missing.",
  },
  {
    id: "vm",
    timestamp: "00:45:30",
    title: "Docker vs Virtual Machine",
    transcriptFocus: [
      "Container vs VM isolation model differences.",
      "Lightweight startup and resource profile of containers.",
      "When VM isolation is still relevant.",
    ],
    architecture: "guest OS stack (VM) vs shared host kernel (container)",
    dsScenario:
      "Real-time inference APIs run in containers, while legacy analytics tools may remain VM-bound.",
  },
  {
    id: "develop",
    timestamp: "00:48:43",
    title: "Developing with Docker",
    transcriptFocus: [
      "Daily development workflows with Docker.",
      "Environment consistency while iterating quickly.",
      "Using mounts and env configs in local loops.",
    ],
    architecture: "host code mount + container runtime + companion services",
    dsScenario:
      "Notebook code updates live through bind mounts while dependencies stay pinned inside container.",
  },
  {
    id: "compose",
    timestamp: "01:07:17",
    title: "Docker Compose",
    transcriptFocus: [
      "Declarative management of multi-container systems.",
      "Service coordination in one compose file.",
      "Local integration parity before release.",
    ],
    architecture: "compose.yaml -> api + db + cache + shared network/volumes",
    dsScenario:
      "Run API, Postgres, Redis, and MLflow locally in one command for integration testing.",
  },
  {
    id: "dockerize",
    timestamp: "01:20:53",
    title: "Dockerizing Our Application",
    transcriptFocus: [
      "Create Dockerfile from app runtime assumptions.",
      "Package app and dependencies into image artifact.",
      "Run and validate same artifact across environments.",
    ],
    architecture: "source + Dockerfile -> image tag -> containerized app runtime",
    dsScenario:
      "A FastAPI model service image is validated once, then promoted unchanged to staging and production.",
  },
  {
    id: "hub",
    timestamp: "01:35:00",
    title: "Publishing Images to Docker Hub",
    transcriptFocus: [
      "Tagging and pushing images to registry.",
      "Pull-based environment promotion.",
      "Rollback readiness through versioned tags.",
    ],
    architecture: "build -> tag -> push -> pull in staging/prod",
    dsScenario:
      "A sentiment model API uses immutable tags tied to model version for reliable rollback.",
  },
  {
    id: "volumes",
    timestamp: "01:39:40",
    title: "Docker Volumes",
    transcriptFocus: [
      "Container lifecycle vs data lifecycle separation.",
      "Named, anonymous, and bind mount differences.",
      "Volume cleanup and persistence management.",
    ],
    architecture: "ephemeral container + durable volume contract",
    dsScenario:
      "Vector database state persists across container recreations using named volumes.",
  },
  {
    id: "network",
    timestamp: "01:59:45",
    title: "Docker Networks",
    transcriptFocus: [
      "Bridge, host, and none drivers.",
      "Container-to-container and host connectivity rules.",
      "Custom bridge networks for cleaner service communication.",
    ],
    architecture: "API container <-> DB container on custom bridge; only API published externally",
    dsScenario:
      "RAG API and vector store communicate internally while public traffic reaches only the API port.",
  },
];

export default function DockerCourseTimelineStudio() {
  const [activeId, setActiveId] = useState("intro");
  const [difficulty, setDifficulty] = useState("intermediate");

  const active = useMemo(
    () => CHAPTERS.find((chapter) => chapter.id === activeId) ?? CHAPTERS[0],
    [activeId]
  );

  const recommendation =
    difficulty === "beginner"
      ? "Focus on flow comprehension: image, container, ports, logs, and compose."
      : difficulty === "intermediate"
        ? "Practice scenario drills: build, debug, compose, publish, rollback."
        : "Evaluate release safety and reproducibility decisions under failure conditions.";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Structured Docker journey map with data-science deployment scenarios.
      </p>

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {[
          { id: "beginner", label: "Beginner" },
          { id: "intermediate", label: "Intermediate" },
          { id: "interview", label: "Interview Prep" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setDifficulty(item.id)}
            style={{
              borderRadius: 999,
              border: difficulty === item.id ? "1px solid #22d3ee" : "1px solid var(--glass-border)",
              background: difficulty === item.id ? "rgba(6,182,212,0.14)" : "var(--bg-tertiary)",
              color: difficulty === item.id ? "#67e8f9" : "var(--text-secondary)",
              padding: "0.42rem 0.75rem",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "var(--bg-secondary)",
          padding: "0.8rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.45rem" }}>
          Choose subsection
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: "0.48rem" }}>
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => setActiveId(chapter.id)}
              style={{
                textAlign: "left",
                borderRadius: 10,
                border: activeId === chapter.id ? "1px solid #22d3ee" : "1px solid var(--glass-border)",
                background: activeId === chapter.id ? "rgba(6,182,212,0.14)" : "rgba(15,23,42,0.62)",
                color: activeId === chapter.id ? "#67e8f9" : "var(--text-secondary)",
                padding: "0.5rem 0.6rem",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "0.71rem", fontWeight: 800, marginBottom: "0.22rem" }}>{`Module ${index + 1}`}</div>
              <div style={{ fontSize: "0.76rem", lineHeight: 1.35 }}>{chapter.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "rgba(15,23,42,0.62)",
          padding: "0.8rem",
        }}
      >
        <div style={{ fontSize: "0.82rem", color: "#67e8f9", fontWeight: 800, marginBottom: "0.3rem" }}>{active.title}</div>

        <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", marginBottom: "0.3rem" }}>
          Key learning points
        </div>
        <ul style={{ margin: "0 0 0.62rem", paddingLeft: "1.05rem", color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: 1.5 }}>
          {active.transcriptFocus.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div
          style={{
            border: "1px solid rgba(34,211,238,0.22)",
            borderRadius: 10,
            background: "rgba(8,47,73,0.2)",
            padding: "0.6rem",
            marginBottom: "0.55rem",
          }}
        >
          <div style={{ fontSize: "0.74rem", color: "#67e8f9", fontWeight: 700, marginBottom: "0.2rem" }}>Architecture Flow</div>
          <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {active.architecture}
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(34,197,94,0.24)",
            borderRadius: 10,
            background: "rgba(20,83,45,0.18)",
            padding: "0.6rem",
            marginBottom: "0.55rem",
          }}
        >
          <div style={{ fontSize: "0.74rem", color: "#86efac", fontWeight: 700, marginBottom: "0.2rem" }}>
            Data Science Interaction Example
          </div>
          <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {active.dsScenario}
          </div>
        </div>

        <div style={{ fontSize: "0.76rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
          Learning mode recommendation: <span style={{ color: "#fcd34d" }}>{recommendation}</span>
        </div>
      </div>
    </div>
  );
}
