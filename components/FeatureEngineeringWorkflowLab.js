"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const SCENARIOS = {
  housing: {
    title: "House Price Prediction",
    raw: [
      { name: "square_feet", type: "numeric", value: "1850", note: "Core size signal" },
      { name: "neighborhood", type: "categorical", value: "Downtown", note: "Location quality proxy" },
      { name: "built_year", type: "numeric", value: "2008", note: "Age-related depreciation" },
      { name: "sale_date", type: "time", value: "2026-01-14", note: "Can create time-aware market features" },
      { name: "sale_price_bucket", type: "leaky", value: "high", note: "Derived from the target. Must never enter training." },
    ],
    examples: [
      "Scale size and age only if the chosen model is distance-based or gradient-sensitive.",
      "Convert neighborhood into one-hot columns or learned embeddings depending on data size.",
      "Generate house_age = sale_year - built_year after splitting so the logic is reproducible in production.",
    ],
  },
  spam: {
    title: "Spam Email Detection",
    raw: [
      { name: "subject_length", type: "numeric", value: "58", note: "Length can separate normal mail from blasts" },
      { name: "sender_domain", type: "categorical", value: "promo.example", note: "Useful but sparse feature" },
      { name: "contains_offer", type: "binary", value: "yes", note: "Keyword-derived indicator" },
      { name: "message_timestamp", type: "time", value: "2026-03-17 09:42", note: "Can support hour-of-day features" },
      { name: "moderator_label_hint", type: "leaky", value: "spam", note: "This is effectively the answer and would leak the label." },
    ],
    examples: [
      "Tokenize subject/body separately when header language carries strong signal.",
      "Map rare sender domains into an 'other' bucket to avoid brittle one-hot columns.",
      "Fit text vocabularies on training data only so validation simulates future unseen mail.",
    ],
  },
  churn: {
    title: "Customer Churn Prediction",
    raw: [
      { name: "tenure_months", type: "numeric", value: "14", note: "Longer tenure often lowers churn risk" },
      { name: "plan_type", type: "categorical", value: "pro", note: "Contract structure changes behavior" },
      { name: "monthly_spend", type: "numeric", value: "79", note: "Captures value and usage intensity" },
      { name: "support_tickets_last_30d", type: "numeric", value: "4", note: "Recent friction indicator" },
      { name: "cancelation_form_started", type: "leaky", value: "true", note: "Appears just before churn and leaks future intent." },
    ],
    examples: [
      "Create spend_per_month_of_tenure only when it is defined the same way online and offline.",
      "Handle missing usage data explicitly instead of silently filling with global means.",
      "Validate the transform pipeline on future time windows because churn drift is common.",
    ],
  },
};

const STEP_META = [
  { id: "raw", label: "1. Raw Data", color: "#38bdf8" },
  { id: "transform", label: "2. Transform", color: "#fbbf24" },
  { id: "validate", label: "3. Validate", color: "#facc15" },
  { id: "train", label: "4. Train", color: "#22c55e" },
];

export default function FeatureEngineeringWorkflowLab() {
  const [scenarioId, setScenarioId] = useState("housing");
  const [activeStep, setActiveStep] = useState("raw");
  const [state, setState] = useState({
    scaleNumeric: true,
    encodeCategoricals: true,
    dropIdentifiers: true,
    fitOnTrainOnly: true,
    addLeakyFeature: false,
    handleUnseenCategories: true,
    validateNulls: true,
  });
  const t = useChartTheme();

  const scenario = SCENARIOS[scenarioId];

  const derived = useMemo(() => {
    const leakageWarnings = [];
    const validationWarnings = [];

    if (state.addLeakyFeature) {
      leakageWarnings.push("A target-derived feature is entering the pipeline. Validation scores will look better than production reality.");
    }
    if (!state.fitOnTrainOnly) {
      leakageWarnings.push("Transform statistics are being fit on the full dataset. This lets validation examples influence preprocessing.");
    }
    if (!state.dropIdentifiers) {
      validationWarnings.push("Identifier-like columns can create memorization instead of generalization.");
    }
    if (!state.handleUnseenCategories) {
      validationWarnings.push("Serving may fail when a new category appears and the encoder has no fallback bucket.");
    }
    if (!state.validateNulls) {
      validationWarnings.push("Null handling is undefined. Production pipelines often break here before the model is even called.");
    }

    const readiness =
      state.scaleNumeric &&
      state.encodeCategoricals &&
      state.dropIdentifiers &&
      state.fitOnTrainOnly &&
      !state.addLeakyFeature &&
      state.handleUnseenCategories &&
      state.validateNulls;

    return {
      leakageWarnings,
      validationWarnings,
      readiness,
      transformedFeatures: scenario.raw
        .filter((feature) => !(feature.type === "leaky" && !state.addLeakyFeature))
        .map((feature) => {
          if (feature.type === "categorical" && state.encodeCategoricals) {
            return `${feature.name} -> one_hot(*)`;
          }
          if (feature.type === "numeric" && state.scaleNumeric) {
            return `${feature.name} -> scaled`;
          }
          if (feature.type === "time") {
            return `${feature.name} -> calendar features`;
          }
          return `${feature.name} -> passthrough`;
        }),
    };
  }, [scenario, state]);

  if (!t) return <div style={{ height: 360 }} />;

  const stepDetail = {
    raw: {
      title: "Raw inputs before modeling",
      text: "Inspect what the business system produces before any model-friendly cleanup. This is where target leakage, unstable IDs, missing values, and timestamp traps become visible.",
    },
    transform: {
      title: "Transform into model-ready features",
      text: "Build deterministic transforms that can run identically during training and serving. Every transform must answer: what is fit, where is it fit, and how is it reused online?",
    },
    validate: {
      title: "Validate the pipeline, not just the model",
      text: "Check leakage, schema drift, unseen categories, and null handling before training. A weak validation layer is how technically correct code still fails in production.",
    },
    train: {
      title: "Train on safe, reproducible features",
      text: "Only after transforms and guards are stable should the model train. The goal is not only higher accuracy, but a pipeline that behaves the same in evaluation and real use.",
    },
  }[activeStep];

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        Move through a practical feature-engineering workflow and test whether the pipeline stays safe against leakage and deployment-time surprises.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.9rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
          {Object.entries(SCENARIOS).map(([id, item]) => {
            const selected = id === scenarioId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setScenarioId(id)}
                style={{
                  border: `1px solid ${selected ? "#38bdf8" : t.btnBorder}`,
                  background: selected ? "rgba(56,189,248,0.08)" : t.btnBg,
                  color: selected ? "#38bdf8" : t.btnText,
                  borderRadius: 999,
                  padding: "0.42rem 0.8rem",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: "0.8rem" }}>
          <div style={{ display: "grid", gap: "0.8rem" }}>
            <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
                Workflow Steps
              </div>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {STEP_META.map((step, index) => {
                  const selected = step.id === activeStep;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      style={{
                        textAlign: "left",
                        borderRadius: 10,
                        border: `1px solid ${selected ? step.color : t.border}`,
                        background: selected ? "rgba(255,255,255,0.03)" : t.surface3,
                        padding: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: step.color,
                            color: "#08111b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.77rem", fontWeight: 700, color: selected ? step.color : t.labelMid }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 2 }}>
                            {step.id === "raw" && "Inspect the original fields and detect suspect columns."}
                            {step.id === "transform" && "Apply deterministic transforms that can run in production."}
                            {step.id === "validate" && "Catch leakage, nulls, and encoder mismatch before training."}
                            {step.id === "train" && "Fit only after the preprocessing contract is stable."}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
                Practical Controls
              </div>

              {[
                { key: "scaleNumeric", label: "Scale numeric features", note: "Useful for gradient-based and distance-based models" },
                { key: "encodeCategoricals", label: "Encode categorical fields", note: "One-hot or embedding-ready representation" },
                { key: "dropIdentifiers", label: "Drop identifiers and lookup keys", note: "Prevents memorization on row identity" },
                { key: "fitOnTrainOnly", label: "Fit transforms on train split only", note: "Critical leakage guardrail" },
                { key: "handleUnseenCategories", label: "Handle unseen categories", note: "Needed for production robustness" },
                { key: "validateNulls", label: "Validate nulls before training", note: "Prevents brittle serving-time failures" },
                { key: "addLeakyFeature", label: "Inject target-derived feature", note: "Toggle to see how leakage breaks the pipeline" },
              ].map((control) => (
                <label
                  key={control.key}
                  style={{
                    display: "flex",
                    gap: "0.65rem",
                    alignItems: "flex-start",
                    padding: "0.55rem 0",
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={state[control.key]}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        [control.key]: event.target.checked,
                      }))
                    }
                    style={{ marginTop: 3, accentColor: control.key === "addLeakyFeature" ? "#ef4444" : "#38bdf8" }}
                  />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: t.labelMid, fontWeight: 700 }}>{control.label}</div>
                    <div style={{ fontSize: "0.7rem", color: t.muted2, marginTop: 2 }}>{control.note}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.8rem" }}>
            <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
                {scenario.title}: {stepDetail.title}
              </div>
              <div style={{ fontSize: "0.73rem", color: t.muted2, marginBottom: "0.8rem" }}>{stepDetail.text}</div>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {scenario.raw.map((feature) => {
                  const isLeaky = feature.type === "leaky";
                  const visible = !isLeaky || state.addLeakyFeature;
                  if (!visible) return null;
                  return (
                    <div
                      key={feature.name}
                      style={{
                        borderRadius: 10,
                        border: `1px solid ${isLeaky ? "#7f1d1d" : t.border}`,
                        background: isLeaky ? "rgba(127,29,29,0.18)" : t.surface3,
                        padding: "0.68rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: isLeaky ? "#fca5a5" : t.labelMid }}>
                          {feature.name}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: isLeaky ? "#fca5a5" : t.tick, fontFamily: "monospace" }}>
                          {feature.type}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: t.muted2, marginTop: 4 }}>
                        Example value: <span style={{ color: t.label }}>{feature.value}</span>
                      </div>
                      <div style={{ fontSize: "0.69rem", color: isLeaky ? "#fecaca" : t.tick, marginTop: 4 }}>{feature.note}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
                Raw → Transform → Validate → Train
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "0.5rem",
                  alignItems: "stretch",
                }}
              >
                {[
                  { title: "Raw", body: `${scenario.raw.length} source fields enter the pipeline`, color: "#38bdf8" },
                  { title: "Transform", body: `${derived.transformedFeatures.length} engineered outputs prepared`, color: "#fbbf24" },
                  { title: "Validate", body: `${derived.leakageWarnings.length + derived.validationWarnings.length} active checks`, color: "#facc15" },
                  { title: "Train", body: derived.readiness ? "Pipeline ready for model fitting" : "Training should wait for guardrail fixes", color: derived.readiness ? "#22c55e" : "#ef4444" },
                ].map((card, index) => (
                  <div
                    key={card.title}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.72rem",
                      position: "relative",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: card.color }}>{card.title}</div>
                    <div style={{ fontSize: "0.7rem", color: t.muted2, marginTop: 6 }}>{card.body}</div>
                    {index < 3 ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: -12,
                          width: 24,
                          height: 2,
                          background: t.gridMid,
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.45rem" }}>
                {derived.transformedFeatures.map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.56rem 0.7rem",
                      fontSize: "0.71rem",
                      color: t.muted2,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
                Guardrails and Example Guidance
              </div>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {derived.leakageWarnings.map((warning) => (
                  <div
                    key={warning}
                    style={{
                      borderRadius: 10,
                      border: "1px solid #7f1d1d",
                      background: "rgba(127,29,29,0.18)",
                      padding: "0.68rem",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fca5a5" }}>Leakage risk</div>
                    <div style={{ fontSize: "0.71rem", color: "#fecaca", marginTop: 4 }}>{warning}</div>
                  </div>
                ))}

                {derived.validationWarnings.map((warning) => (
                  <div
                    key={warning}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.68rem",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#facc15" }}>Validation checkpoint</div>
                    <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 4 }}>{warning}</div>
                  </div>
                ))}

                {derived.leakageWarnings.length === 0 && derived.validationWarnings.length === 0 ? (
                  <div
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.68rem",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e" }}>Pipeline contract looks healthy</div>
                    <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 4 }}>
                      Transforms are train-only, leakage is blocked, and serving-time failure modes are covered.
                    </div>
                  </div>
                ) : null}

                {scenario.examples.map((example) => (
                  <div
                    key={example}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.68rem",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: t.labelMid }}>Practical example</div>
                    <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 4 }}>{example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
