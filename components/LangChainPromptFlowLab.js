"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const TEMPLATE_VARS = [
  {
    label: "user_context",
    detail: "Profile, task history, and policy guards that personalize tone and filter disallowed actions.",
    example: "user_context.preferences = { goal: \"scale support\" }",
  },
  {
    label: "session_state",
    detail: "Runtime slots such as channel, locale, and previous tool outputs used for branching.",
    example: "session_state.handoff = { agent: \"fallback\" }",
  },
  {
    label: "explicit_requirements",
    detail: "Business rules, output schema names, and confidence thresholds that the parser must enforce.",
    example: "explicit_requirements.schema = BulkPlan",
  },
];

const FLOW_STEPS = [
  {
    title: "Template Variables",
    text: "Populate structured input (context, goals, guardrails) before rendering."
  },
  {
    title: "Prompt Rendering",
    text: "Apply templates (LCEL prompt, system + user) and inject formatting helpers."
  },
  {
    title: "Model Call",
    text: "Pass tokens to GPT-4o/Claude/Anthropic with temperature, best-of, and stop sequences."
  },
  {
    title: "Structured Parser",
    text: "JSONSchema/Pydantic enforced parser validates fields, reroutes retries on mismatch."
  },
  {
    title: "Output Route",
    text: "Emit plan into UI, database, or downstream tool network with telemetry."
  },
];

const RETRY_IMPACT = {
  passive: {
    label: "Fast path",
    reliability: 78,
    recall: 72,
    latency: "420 ms",
    note: "No extra retries/validation; rely on base parser heuristics."
  },
  guarded: {
    label: "Validation + retries",
    reliability: 92,
    recall: 86,
    latency: "670 ms",
    note: "Schema validation gates rerouting + retries/fan-out to evaluator chain."
  }
};

export default function LangChainPromptFlowLab() {
  const theme = useChartTheme();
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true);

  const renderContext = useMemo(() => {
    const context = {
      customer: "Ops automation",
      goal: "decrease ticket cycle time by 42%",
      tone: "decisive, high-trust",
      fallback: "escalate to on-call if parser fails twice",
    };

    const template = `SYSTEM: You are a planning assistant for ${context.customer}. TASK: deliver an actionable plan to ${context.goal}. STYLE: ${context.tone}. FALLBACK: ${context.fallback}.`;
    return { template, values: context };
  }, []);

  const activeImpact = guardrailsEnabled ? RETRY_IMPACT.guarded : RETRY_IMPACT.passive;
  const reliabilityProgress = `${activeImpact.reliability}%`;

  if (!theme) return null;

  return (
    <section style={{ fontFamily: "var(--font-body)", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.78rem" }}>
          LangChain prompt/template flow – trace how variables become prompts, how the model is called, and how structured parser results are routed.
        </p>
        <h3 style={{ margin: "0.25rem 0" }}>Prompt Flow + Reliability Simulation</h3>
      </header>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {TEMPLATE_VARS.map((item) => (
          <article
            key={item.label}
            style={{
              flex: "1 1 250px",
              padding: "0.85rem",
              borderRadius: "12px",
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ fontSize: "0.72rem", color: theme.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Variable
            </div>
            <strong style={{ fontSize: "0.95rem" }}>{item.label}</strong>
            <p style={{ margin: "0.35rem 0", fontSize: "0.78rem", lineHeight: 1.5, color: theme.label }}>{item.detail}</p>
            <code style={{ fontSize: "0.75rem", background: theme.surface3, padding: "0.25rem 0.4rem", borderRadius: "6px", display: "block" }}>
              {item.example}
            </code>
          </article>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ borderRadius: "12px", border: `1px solid ${theme.border}`, background: theme.surface3, padding: "0.9rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: "0.9rem" }}>Rendered Prompt</strong>
            <span style={{ fontSize: "0.7rem", color: theme.muted }}>Shadows: locale + policy</span>
          </div>
          <pre
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.79rem",
              whiteSpace: "pre-wrap",
              lineHeight: 1.4,
              color: theme.label,
            }}
          >
            {renderContext.template}
          </pre>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "14px", border: `1px solid ${theme.border}`, padding: "0.7rem 0.9rem", background: theme.surface }}>
          <strong style={{ fontSize: "0.9rem" }}>Guardrail toggle</strong>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: theme.label }}>
            <input
              type="checkbox"
              checked={guardrailsEnabled}
              onChange={() => setGuardrailsEnabled((prev) => !prev)}
            />
            Add validator + retries
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px", borderRadius: "12px", border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.7rem" }}>
            <div style={{ fontSize: "0.7rem", color: theme.muted }}>Reliability</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{reliabilityProgress}</div>
            <div style={{ height: "6px", borderRadius: "999px", background: theme.surface2, overflow: "hidden" }}>
              <div
                style={{
                  width: `${activeImpact.reliability}%`,
                  height: "6px",
                  background: guardrailsEnabled ? "#22c55e" : "#f97316",
                  transition: "width 220ms ease",
                }}
              />
            </div>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: theme.muted2 }}>{activeImpact.note}</p>
          </div>

          <div style={{ flex: "1 1 200px", borderRadius: "12px", border: `1px solid ${theme.border}`, background: theme.surface, padding: "0.7rem" }}>
            <div style={{ fontSize: "0.7rem", color: theme.muted }}>Expected recall</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>{activeImpact.recall}%</div>
            <div style={{ fontSize: "0.7rem", color: theme.muted2 }}>Latency ≈ {activeImpact.latency}</div>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: "16px", padding: "0.6rem", background: theme.surface2, border: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
          {FLOW_STEPS.map((step, index) => (
            <div key={step.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "110px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: `1px solid ${theme.border}`,
                  background: index === 2 ? theme.surface3 : theme.surface,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </div>
              <strong style={{ fontSize: "0.78rem", marginTop: "0.45rem" }}>{step.title}</strong>
              <p style={{ fontSize: "0.7rem", color: theme.muted2, lineHeight: 1.4 }}>{step.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", color: theme.muted, fontSize: "0.72rem" }}>
          <span>→</span>
          <span>Signal: template → model → parser</span>
          <span>Retries / validation forks are shown in the reliability tile (toggle-enabled).</span>
        </div>
      </div>
    </section>
  );
}
