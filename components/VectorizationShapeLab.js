"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const SCENARIOS = [
  {
    id: "predict",
    label: "Batch prediction",
    description: "Use one matrix multiply to score many training examples at once.",
    baseLeft: { label: "X", rowsKey: "m", colsKey: "n", note: "m examples, n features" },
    baseRight: { label: "w", rowsKey: "n", colsKey: "1", note: "n weights for one target" },
    resultLabel: "y_hat",
    resultNote: "predictions for all m examples",
    production: "This is the standard vectorized forward pass in multiple linear regression.",
  },
  {
    id: "gradient",
    label: "Gradient update",
    description: "Turn per-example residuals into one gradient vector for every feature.",
    baseLeft: { label: "X^T", rowsKey: "n", colsKey: "m", note: "transpose exposes features along rows" },
    baseRight: { label: "e", rowsKey: "m", colsKey: "1", note: "one residual per example" },
    resultLabel: "grad_w",
    resultNote: "feature-wise gradient",
    production: "This is why vectorization speeds training: one pass collects every sample contribution.",
  },
  {
    id: "multioutput",
    label: "Multi-output regression",
    description: "Predict several targets together with one feature matrix and a weight matrix.",
    baseLeft: { label: "X", rowsKey: "m", colsKey: "n", note: "shared input matrix" },
    baseRight: { label: "W", rowsKey: "n", colsKey: "k", note: "k output columns" },
    resultLabel: "Y_hat",
    resultNote: "m predictions across k targets",
    production: "The same shape logic generalizes from one output to many outputs.",
  },
];

function dimensionValue(key, dims) {
  if (key === "1") return 1;
  return dims[key];
}

function matrixCardStyles(t, accent, active) {
  return {
    border: `1px solid ${active ? accent : t.border}`,
    borderRadius: 14,
    background: active ? "rgba(56,189,248,0.08)" : t.surface2,
    padding: "0.85rem",
    boxShadow: active ? `0 0 0 1px ${accent} inset` : "none",
  };
}

function MatrixPreview({ label, rows, cols, note, accent, t }) {
  const cells = [];
  const previewRows = Math.min(rows, 4);
  const previewCols = Math.min(cols, 4);

  for (let row = 0; row < previewRows; row += 1) {
    for (let col = 0; col < previewCols; col += 1) {
      cells.push(
        <div
          key={`${label}-${row}-${col}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: row === 0 || col === 0 ? accent : "rgba(148,163,184,0.16)",
            border: `1px solid ${row === 0 || col === 0 ? accent : t.border}`,
          }}
        />
      );
    }
  }

  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface3, padding: "0.7rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "baseline" }}>
        <div style={{ fontSize: "0.86rem", color: accent, fontWeight: 800 }}>{label}</div>
        <div style={{ fontFamily: "monospace", fontSize: "0.84rem", color: t.labelMid }}>
          {rows} x {cols}
        </div>
      </div>
      <div style={{ marginTop: 4, fontSize: "0.73rem", color: t.muted2 }}>{note}</div>
      <div
        style={{
          marginTop: "0.7rem",
          display: "grid",
          gridTemplateColumns: `repeat(${previewCols}, 22px)`,
          gap: 6,
          justifyContent: "start",
        }}
      >
        {cells}
      </div>
      <div style={{ marginTop: 6, fontSize: "0.7rem", color: t.tick }}>
        Preview capped at 4 x 4, but the shape label shows the real matrix dimensions.
      </div>
    </div>
  );
}

export default function VectorizationShapeLab() {
  const [scenarioId, setScenarioId] = useState("predict");
  const [dims, setDims] = useState({ m: 5, n: 3, k: 2 });
  const [transposeLeft, setTransposeLeft] = useState(false);
  const [transposeRight, setTransposeRight] = useState(false);
  const t = useChartTheme();

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0],
    [scenarioId]
  );

  const leftShape = useMemo(() => {
    const rows = dimensionValue(scenario.baseLeft.rowsKey, dims);
    const cols = dimensionValue(scenario.baseLeft.colsKey, dims);
    return transposeLeft ? { rows: cols, cols: rows, label: `${scenario.baseLeft.label}^T` } : { rows, cols, label: scenario.baseLeft.label };
  }, [dims, scenario, transposeLeft]);

  const rightShape = useMemo(() => {
    const rows = dimensionValue(scenario.baseRight.rowsKey, dims);
    const cols = dimensionValue(scenario.baseRight.colsKey, dims);
    return transposeRight ? { rows: cols, cols: rows, label: `${scenario.baseRight.label}^T` } : { rows, cols, label: scenario.baseRight.label };
  }, [dims, scenario, transposeRight]);

  const valid = leftShape.cols === rightShape.rows;
  const resultRows = valid ? leftShape.rows : null;
  const resultCols = valid ? rightShape.cols : null;

  if (!t) return <div style={{ height: 420 }} />;

  const verdictColor = valid ? "#22c55e" : "#f97316";
  const interiorMessage = valid
    ? `Inner dimensions match: ${leftShape.cols} = ${rightShape.rows}`
    : `Inner dimensions clash: ${leftShape.cols} != ${rightShape.rows}`;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.6 }}>
        Vectorization in supervised learning works because matrix shapes line up cleanly. This lab lets you change example count,
        feature count, and target count to see when a batched linear algebra step is valid and when it breaks.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.bg, padding: "0.9rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {SCENARIOS.map((item) => {
            const active = item.id === scenarioId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenarioId(item.id);
                  setTransposeLeft(false);
                  setTransposeRight(false);
                }}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${active ? "#38bdf8" : t.btnBorder}`,
                  background: active ? "rgba(56,189,248,0.10)" : t.btnBg,
                  color: active ? "#38bdf8" : t.btnText,
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(230px, 1.15fr) minmax(300px, 1fr)", gap: "0.85rem" }}>
          <div style={{ background: t.surface2, borderRadius: 14, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: t.labelMid }}>{scenario.label}</div>
            <div style={{ marginTop: 3, fontSize: "0.75rem", color: t.muted2, lineHeight: 1.55 }}>{scenario.description}</div>

            {[
              { key: "m", label: "Examples (m)", min: 2, max: 12 },
              { key: "n", label: "Features (n)", min: 1, max: 8 },
              { key: "k", label: "Outputs (k)", min: 1, max: 5 },
            ].map((control) => (
              <label key={control.key} style={{ display: "block", marginTop: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                  <span>{control.label}</span>
                  <span style={{ fontFamily: "monospace", color: t.labelMid }}>{dims[control.key]}</span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={1}
                  value={dims[control.key]}
                  onChange={(event) =>
                    setDims((current) => ({
                      ...current,
                      [control.key]: Number(event.target.value),
                    }))
                  }
                  style={{ width: "100%", marginTop: 6, accentColor: "#38bdf8" }}
                />
              </label>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.9rem" }}>
              {[
                { key: "left", label: `Transpose ${scenario.baseLeft.label}`, active: transposeLeft, onClick: () => setTransposeLeft((current) => !current) },
                { key: "right", label: `Transpose ${scenario.baseRight.label}`, active: transposeRight, onClick: () => setTransposeRight((current) => !current) },
              ].map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={action.onClick}
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${action.active ? "#f97316" : t.btnBorder}`,
                    background: action.active ? "rgba(249,115,22,0.10)" : t.btnBg,
                    color: action.active ? "#f97316" : t.btnText,
                    padding: "0.65rem",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: "0.9rem",
                borderRadius: 12,
                border: `1px solid ${valid ? "rgba(34,197,94,0.35)" : "rgba(249,115,22,0.35)"}`,
                background: valid ? "rgba(34,197,94,0.10)" : "rgba(249,115,22,0.10)",
                padding: "0.8rem",
              }}
            >
              <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Matmul verdict</div>
              <div style={{ marginTop: 4, fontSize: "1rem", fontWeight: 800, color: verdictColor }}>
                {valid ? "Valid multiplication" : "Invalid multiplication"}
              </div>
              <div style={{ marginTop: 5, fontSize: "0.75rem", color: t.muted3 }}>{interiorMessage}</div>
              <div style={{ marginTop: 6, fontSize: "0.73rem", color: t.tick }}>
                Production intuition: shape mismatches are one of the fastest ways to catch a broken vectorization rewrite before it reaches model training.
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "0.55rem", alignItems: "stretch" }}>
              <div style={matrixCardStyles(t, "#38bdf8", true)}>
                <MatrixPreview
                  label={leftShape.label}
                  rows={leftShape.rows}
                  cols={leftShape.cols}
                  note={scenario.baseLeft.note}
                  accent="#38bdf8"
                  t={t}
                />
              </div>

              <div style={{ display: "grid", placeItems: "center", fontSize: "1.3rem", color: t.labelMid, fontWeight: 900 }}>x</div>

              <div style={matrixCardStyles(t, "#f97316", true)}>
                <MatrixPreview
                  label={rightShape.label}
                  rows={rightShape.rows}
                  cols={rightShape.cols}
                  note={scenario.baseRight.note}
                  accent="#f97316"
                  t={t}
                />
              </div>

              <div style={{ display: "grid", placeItems: "center", fontSize: "1.3rem", color: t.labelMid, fontWeight: 900 }}>=</div>

              <div style={matrixCardStyles(t, verdictColor, valid)}>
                {valid ? (
                  <MatrixPreview
                    label={scenario.resultLabel}
                    rows={resultRows}
                    cols={resultCols}
                    note={scenario.resultNote}
                    accent={verdictColor}
                    t={t}
                  />
                ) : (
                  <div style={{ height: "100%", display: "grid", alignContent: "center", gap: "0.4rem" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: verdictColor }}>No output matrix</div>
                    <div style={{ fontSize: "0.74rem", color: t.muted3, lineHeight: 1.55 }}>
                      The inner dimensions do not agree, so the left matrix cannot hand off columns to the right matrix&apos;s rows.
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: t.labelMid }}>
                      ({leftShape.rows} x {leftShape.cols}) x ({rightShape.rows} x {rightShape.cols})
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface2, padding: "0.8rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: t.labelMid }}>Why this matters in vectorized supervised learning</div>
              <ul style={{ margin: "0.55rem 0 0", paddingLeft: "1.1rem", fontSize: "0.74rem", color: t.muted3, lineHeight: 1.6 }}>
                <li>Rows usually represent examples in a batch, while columns represent features or output channels.</li>
                <li>Valid matrix multiplication means the feature space handed off by the first matrix matches the feature space expected by the second.</li>
                <li>When you transpose the wrong object, you often switch from &quot;batch of examples&quot; to &quot;batch of features&quot; and break the computation.</li>
                <li>{scenario.production}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
