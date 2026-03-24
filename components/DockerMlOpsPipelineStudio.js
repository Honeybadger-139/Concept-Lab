"use client";

import { useMemo, useState } from "react";

const STAGES = [
  {
    id: "local",
    title: "Local Dev",
    goal: "Build and run the service with real dependencies before sharing.",
    artifact: "Image tag: fraud-api:dev-local",
    risk: "Undocumented local-only assumptions.",
  },
  {
    id: "ci",
    title: "CI Validation",
    goal: "Rebuild image from scratch, run tests, and verify runtime contract.",
    artifact: "Image tag: fraud-api:ci-<commit>",
    risk: "Flaky integration tests or missing env contracts.",
  },
  {
    id: "registry",
    title: "Registry",
    goal: "Publish immutable artifacts that can be promoted consistently.",
    artifact: "Image tag: fraud-api:1.7.3",
    risk: "Weak traceability when teams rely on latest.",
  },
  {
    id: "staging",
    title: "Staging",
    goal: "Validate networking, storage, and downstream service connectivity.",
    artifact: "Deployment candidate for production.",
    risk: "Hidden config mismatch (ports, hostnames, secrets).",
  },
  {
    id: "prod",
    title: "Production",
    goal: "Serve traffic with rollback-ready versioned release.",
    artifact: "Live replicas with health checks.",
    risk: "No rollback path for model/runtime regressions.",
  },
];

const FAILURE_SCENARIOS = {
  none: {
    label: "No active incident",
    impact: "Pipeline is healthy and promotion can continue.",
    recommendation:
      "Keep release metadata (image tag, commit SHA, model version) captured for auditability.",
  },
  config: {
    label: "Runtime configuration mismatch",
    impact:
      "Container starts in staging but requests fail due to wrong DB host or missing env values.",
    recommendation:
      "Diff staging vs production runtime config and validate env contract before promotion.",
  },
  dependency: {
    label: "Dependency reachability failure",
    impact:
      "API is alive but cannot reach database/cache/vector store over network path.",
    recommendation:
      "Verify service network, published ports, dependency health, and DNS/service naming.",
  },
  model: {
    label: "Model artifact drift",
    impact:
      "Container deploys successfully but serves old or incompatible model artifact.",
    recommendation:
      "Pin model version in release metadata and enforce startup-time model checksum validation.",
  },
};

export default function DockerMlOpsPipelineStudio() {
  const [activeStage, setActiveStage] = useState("staging");
  const [scenario, setScenario] = useState("none");

  const selectedStage = STAGES.find((stage) => stage.id === activeStage) ?? STAGES[0];
  const selectedScenario = FAILURE_SCENARIOS[scenario];

  const guardrailScore = useMemo(() => {
    const base = activeStage === "prod" ? 82 : activeStage === "staging" ? 74 : 66;
    if (scenario === "none") return base + 14;
    if (scenario === "config") return base - 22;
    if (scenario === "dependency") return base - 26;
    return base - 30;
  }, [activeStage, scenario]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        End-to-end architecture view for Dockerized data-science services from local build to production release.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem", marginBottom: "0.8rem" }}>
        {STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => setActiveStage(stage.id)}
            style={{
              borderRadius: 10,
              border: activeStage === stage.id ? "1px solid #22d3ee" : "1px solid var(--glass-border)",
              background: activeStage === stage.id ? "rgba(6,182,212,0.14)" : "rgba(15,23,42,0.7)",
              color: activeStage === stage.id ? "#67e8f9" : "var(--text-secondary)",
              padding: "0.5rem 0.55rem",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {stage.title}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          background: "var(--bg-secondary)",
          padding: "0.85rem",
          marginBottom: "0.8rem",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.28rem" }}>
          {selectedStage.title}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "0.45rem" }}>
          {selectedStage.goal}
        </div>
        <div style={{ fontSize: "0.76rem", color: "#93c5fd", marginBottom: "0.28rem" }}>
          Artifact: {selectedStage.artifact}
        </div>
        <div style={{ fontSize: "0.76rem", color: "#fdba74" }}>Primary risk: {selectedStage.risk}</div>
      </div>

      <div style={{ border: "1px dashed var(--glass-border)", borderRadius: 12, padding: "0.7rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.76rem", color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.45rem" }}>
          Interaction scenario
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.55rem" }}>
          {Object.entries(FAILURE_SCENARIOS).map(([id, item]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScenario(id)}
              style={{
                borderRadius: 999,
                border: scenario === id ? "1px solid #f59e0b" : "1px solid var(--glass-border)",
                background: scenario === id ? "rgba(245,158,11,0.13)" : "rgba(15,23,42,0.7)",
                color: scenario === id ? "#fcd34d" : "var(--text-secondary)",
                padding: "0.4rem 0.7rem",
                fontSize: "0.73rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "0.35rem" }}>
          {selectedScenario.impact}
        </div>
        <div style={{ fontSize: "0.77rem", color: "#86efac", lineHeight: 1.55 }}>
          Recovery action: {selectedScenario.recommendation}
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 10,
          background: "rgba(15,23,42,0.66)",
          padding: "0.65rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.6rem",
        }}
      >
        <div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "0.2rem" }}>
            Guardrail Score
          </div>
          <div style={{ fontSize: "1.02rem", color: "var(--text-primary)", fontWeight: 800 }}>{guardrailScore}</div>
        </div>
        <div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "0.2rem" }}>
            Promotion Path
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            local {"->"} CI {"->"} registry {"->"} staging {"->"} production
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: "0.2rem" }}>
            Rollback Baseline
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Promote only versioned image tags with linked model/version metadata.
          </div>
        </div>
      </div>
    </div>
  );
}
