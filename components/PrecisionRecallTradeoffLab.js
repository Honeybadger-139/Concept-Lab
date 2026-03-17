"use client";

import { useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const EXAMPLES = [
  { id: 1, score: 0.96, actual: 1, label: "patient-01" },
  { id: 2, score: 0.91, actual: 1, label: "patient-02" },
  { id: 3, score: 0.84, actual: 0, label: "patient-03" },
  { id: 4, score: 0.79, actual: 1, label: "patient-04" },
  { id: 5, score: 0.73, actual: 0, label: "patient-05" },
  { id: 6, score: 0.68, actual: 1, label: "patient-06" },
  { id: 7, score: 0.58, actual: 0, label: "patient-07" },
  { id: 8, score: 0.49, actual: 1, label: "patient-08" },
  { id: 9, score: 0.36, actual: 0, label: "patient-09" },
  { id: 10, score: 0.24, actual: 0, label: "patient-10" },
];

function safeDivide(a, b) {
  return b === 0 ? 0 : a / b;
}

export default function PrecisionRecallTradeoffLab() {
  const [threshold, setThreshold] = useState(0.5);
  const t = useChartTheme();

  if (!t) return <div style={{ height: 320 }} />;

  const classified = EXAMPLES.map((item) => ({
    ...item,
    predicted: item.score >= threshold ? 1 : 0,
  }));

  const tp = classified.filter((item) => item.predicted === 1 && item.actual === 1).length;
  const fp = classified.filter((item) => item.predicted === 1 && item.actual === 0).length;
  const tn = classified.filter((item) => item.predicted === 0 && item.actual === 0).length;
  const fn = classified.filter((item) => item.predicted === 0 && item.actual === 1).length;

  const precision = safeDivide(tp, tp + fp);
  const recall = safeDivide(tp, tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  const thresholdTone = threshold >= 0.75 ? "#f97316" : threshold <= 0.35 ? "#22c55e" : "#facc15";

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        Move the threshold to see how the same model scores can produce very different precision, recall, and F1.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.85rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: t.labelMid }}>Threshold policy</div>
            <div style={{ fontSize: "0.76rem", color: t.muted2 }}>
              Lower threshold catches more positives. Higher threshold avoids false alarms.
            </div>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: thresholdTone,
              background: t.surface2,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "0.35rem 0.6rem",
            }}
          >
            {threshold.toFixed(2)}
          </div>
        </div>

        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          style={{ width: "100%", accentColor: thresholdTone }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.72rem", color: t.tick }}>
          <span>0.10: aggressive recall</span>
          <span>0.50: balanced default</span>
          <span>0.90: strict precision</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.65rem", marginTop: "0.9rem" }}>
          {[
            { label: "Precision", value: precision, color: "#38bdf8", note: "Of predicted positives, how many were correct?" },
            { label: "Recall", value: recall, color: "#22c55e", note: "Of actual positives, how many did we catch?" },
            { label: "F1 Score", value: f1, color: "#f97316", note: "Single score balancing both." },
          ].map((metric) => (
            <div key={metric.label} style={{ background: t.surface2, borderRadius: 10, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.74rem", color: t.muted2, marginBottom: 4 }}>{metric.label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: metric.color, fontFamily: "monospace" }}>
                {metric.value.toFixed(2)}
              </div>
              <div style={{ fontSize: "0.72rem", color: t.tick, marginTop: 4 }}>{metric.note}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.55rem", marginTop: "0.9rem" }}>
          {[
            { label: "True Positive", value: tp, color: "#22c55e" },
            { label: "False Positive", value: fp, color: "#f97316" },
            { label: "True Negative", value: tn, color: "#38bdf8" },
            { label: "False Negative", value: fn, color: "#ef4444" },
          ].map((cell) => (
            <div key={cell.label} style={{ background: t.surface2, borderRadius: 10, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.74rem", color: t.muted2 }}>{cell.label}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: cell.color, fontFamily: "monospace", marginTop: 4 }}>
                {cell.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "0.95rem" }}>
          <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700, marginBottom: "0.45rem" }}>
            Model scores on a skewed dataset
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {classified.map((item) => {
              const predictedColor = item.predicted === 1 ? "#facc15" : t.muted;
              const actualColor = item.actual === 1 ? "#22c55e" : "#64748b";
              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "84px 1fr 88px 88px",
                    gap: "0.55rem",
                    alignItems: "center",
                    fontSize: "0.74rem",
                  }}
                >
                  <span style={{ color: t.muted2 }}>{item.label}</span>
                  <div style={{ position: "relative", height: 10, background: t.surface3, borderRadius: 999 }}>
                    <div
                      style={{
                        width: `${item.score * 100}%`,
                        height: "100%",
                        background: item.actual === 1 ? "#22c55e" : "#38bdf8",
                        borderRadius: 999,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: `${threshold * 100}%`,
                        top: -3,
                        bottom: -3,
                        width: 2,
                        background: thresholdTone,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <span style={{ color: actualColor }}>actual: {item.actual ? "positive" : "negative"}</span>
                  <span style={{ color: predictedColor }}>pred: {item.predicted ? "positive" : "negative"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
