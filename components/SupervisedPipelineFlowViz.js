"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const STAGES = [
  {
    id: "problem",
    label: "1. Frame",
    title: "Problem Framing",
    description: "Define the target, success metric, prediction horizon, and what the model should never be allowed to use.",
    checkpoint: "Failure checkpoint: if the target is vague, every downstream metric becomes misleading.",
    color: "#38bdf8",
  },
  {
    id: "data",
    label: "2. Data",
    title: "Collect and Label Data",
    description: "Gather representative examples and make sure labels are consistent, auditable, and tied to the real-world task.",
    checkpoint: "Failure checkpoint: noisy labels create bias that model size alone will not fix.",
    color: "#22c55e",
  },
  {
    id: "split",
    label: "3. Split",
    title: "Train / CV / Test Split",
    description: "Separate fitting from evaluation so you can diagnose bias, variance, and hidden leakage before deployment.",
    checkpoint: "Failure checkpoint: if train and validation are not meaningfully separated, the evaluation cannot be trusted.",
    color: "#facc15",
  },
  {
    id: "features",
    label: "4. Features",
    title: "Feature Engineering",
    description: "Transform raw data into signals the model can learn from without leaking target information.",
    checkpoint: "Failure checkpoint: target leakage often looks like great validation performance until production breaks it.",
    color: "#f97316",
  },
  {
    id: "train",
    label: "5. Train",
    title: "Train and Tune",
    description: "Fit the model, choose regularization and capacity, and compare candidate versions with the same evaluation protocol.",
    checkpoint: "Failure checkpoint: overfitting shows up as strong train performance with weak validation performance.",
    color: "#a78bfa",
  },
  {
    id: "evaluate",
    label: "6. Evaluate",
    title: "Evaluate and Diagnose",
    description: "Use the right metric, inspect failure slices, and decide whether the next move is more data, new features, or different model capacity.",
    checkpoint: "Failure checkpoint: a single aggregate score can hide subgroup failure or rare-class collapse.",
    color: "#fb7185",
  },
  {
    id: "deploy",
    label: "7. Operate",
    title: "Deploy and Monitor",
    description: "Ship with guardrails, track drift and latency, and keep a rollback path for bad models and stale data.",
    checkpoint: "Failure checkpoint: a good offline model can still fail if production data drifts away from training conditions.",
    color: "#14b8a6",
  },
];

const FAILURE_RULES = [
  {
    id: "labels",
    label: "Label quality risk",
    color: "#ef4444",
    message: "Low label quality will cap your best possible training performance.",
    active: (s) => s.labelQuality < 55,
    stageIds: ["data", "evaluate"],
  },
  {
    id: "capacity",
    label: "High bias risk",
    color: "#f97316",
    message: "The model looks too simple for the signal available. Increase features or model capacity before collecting more generic data.",
    active: (s) => s.featureSignal > 65 && s.modelCapacity < 40,
    stageIds: ["features", "train", "evaluate"],
  },
  {
    id: "variance",
    label: "High variance risk",
    color: "#facc15",
    message: "Capacity is high relative to the signal quality. Watch train-vs-validation gaps and consider regularization.",
    active: (s) => s.modelCapacity > 70 && s.labelQuality > 60 && s.drift < 45,
    stageIds: ["train", "evaluate"],
  },
  {
    id: "mismatch",
    label: "Train-production mismatch",
    color: "#38bdf8",
    message: "Validation may look fine while production still breaks because the incoming data distribution is drifting.",
    active: (s) => s.drift > 55,
    stageIds: ["split", "deploy"],
  },
];

function stageHealth(stage, state) {
  const activeRules = FAILURE_RULES.filter((rule) => rule.active(state) && rule.stageIds.includes(stage.id)).length;
  return Math.max(0.18, 1 - activeRules * 0.24);
}

export default function SupervisedPipelineFlowViz() {
  const [activeStageId, setActiveStageId] = useState(STAGES[0].id);
  const [state, setState] = useState({
    labelQuality: 78,
    featureSignal: 64,
    modelCapacity: 52,
    drift: 28,
  });
  const t = useChartTheme();

  const activeStage = STAGES.find((stage) => stage.id === activeStageId) || STAGES[0];
  const activeFailures = useMemo(() => FAILURE_RULES.filter((rule) => rule.active(state)), [state]);

  if (!t) return <div style={{ height: 360 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        Follow the full supervised-learning pipeline and change the operating conditions to see where failures usually appear first.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.9rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Pipeline Conditions
            </div>

            {[
              { key: "labelQuality", label: "Label quality", note: "Consistency and annotation accuracy", color: "#22c55e" },
              { key: "featureSignal", label: "Feature signal", note: "How predictive the raw inputs actually are", color: "#38bdf8" },
              { key: "modelCapacity", label: "Model capacity", note: "How flexible the model family is", color: "#a78bfa" },
              { key: "drift", label: "Production drift", note: "How much serving data differs from training data", color: "#f97316" },
            ].map((control) => (
              <label key={control.key} style={{ display: "block", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                  <span>{control.label}</span>
                  <span style={{ fontFamily: "monospace", color: control.color }}>{state[control.key]}</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: t.tick, marginTop: 2 }}>{control.note}</div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={state[control.key]}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      [control.key]: Number(event.target.value),
                    }))
                  }
                  style={{ width: "100%", marginTop: 6, accentColor: control.color }}
                />
              </label>
            ))}
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Architecture Flow
            </div>

            <div style={{ display: "grid", gap: "0.55rem" }}>
              {STAGES.map((stage) => {
                const selected = stage.id === activeStageId;
                const health = stageHealth(stage, state);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 10,
                      border: `1px solid ${selected ? stage.color : t.border}`,
                      background: selected ? "rgba(56,189,248,0.08)" : t.surface3,
                      padding: "0.72rem",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: selected ? stage.color : t.labelMid }}>
                          {stage.label}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 2 }}>{stage.title}</div>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.74rem", color: health > 0.65 ? "#22c55e" : health > 0.42 ? "#facc15" : "#ef4444" }}>
                        {(health * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ height: 7, background: t.surface, borderRadius: 999, marginTop: 8, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${health * 100}%`,
                          height: "100%",
                          background: health > 0.65 ? "#22c55e" : health > 0.42 ? "#facc15" : "#ef4444",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Stage Detail
            </div>

            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${t.border}`,
                background: t.surface3,
                padding: "0.85rem",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: activeStage.color, fontWeight: 800 }}>{activeStage.label}</div>
              <div style={{ fontSize: "0.96rem", color: t.labelMid, fontWeight: 800, marginTop: 2 }}>{activeStage.title}</div>
              <div style={{ fontSize: "0.74rem", color: t.muted2, marginTop: 8 }}>{activeStage.description}</div>
              <div style={{ fontSize: "0.72rem", color: t.tick, marginTop: 10 }}>{activeStage.checkpoint}</div>
            </div>

            <div style={{ marginTop: "0.85rem" }}>
              <div style={{ fontSize: "0.76rem", color: t.muted2, marginBottom: "0.45rem" }}>Active failure checkpoints</div>
              <div style={{ display: "grid", gap: "0.45rem" }}>
                {(activeFailures.length > 0 ? activeFailures : [{ id: "healthy", label: "No critical failure dominating", color: "#22c55e", message: "This pipeline looks structurally healthy. Evaluation quality will depend on metric choice and deployment discipline." }]).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.7rem",
                    }}
                  >
                    <div style={{ fontSize: "0.76rem", fontWeight: 700, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 4 }}>{item.message}</div>
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
