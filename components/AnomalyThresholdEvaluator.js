"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const NORMAL_SCORES = [0.81, 0.73, 0.69, 0.65, 0.63, 0.61, 0.58, 0.56, 0.54, 0.52, 0.49, 0.46, 0.43, 0.4, 0.37, 0.34];
const ANOMALY_SCORES = [0.31, 0.27, 0.24, 0.22, 0.19, 0.17, 0.15, 0.12];

function safeDiv(a, b) {
  return b === 0 ? 0 : a / b;
}

export default function AnomalyThresholdEvaluator() {
  const [epsilon, setEpsilon] = useState(0.3);
  const t = useChartTheme();

  const stats = useMemo(() => {
    let tp = 0;
    let fn = 0;
    let fp = 0;
    let tn = 0;
    ANOMALY_SCORES.forEach((p) => {
      if (p < epsilon) tp += 1;
      else fn += 1;
    });
    NORMAL_SCORES.forEach((p) => {
      if (p < epsilon) fp += 1;
      else tn += 1;
    });
    const precision = safeDiv(tp, tp + fp);
    const recall = safeDiv(tp, tp + fn);
    const f1 = safeDiv(2 * precision * recall, precision + recall);
    return { tp, fn, fp, tn, precision, recall, f1 };
  }, [epsilon]);

  if (!t) return <div style={{ height: 220 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: t.muted3 }}>
        Slide epsilon to see alert policy tradeoffs. Higher epsilon catches more anomalies but can increase false alarms.
      </p>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.82rem" }}>
        <label style={{ display: "block", fontSize: "0.76rem", color: t.tick }}>
          epsilon threshold: <b style={{ color: t.labelMid }}>{epsilon.toFixed(3)}</b>
        </label>
        <input
          type="range"
          min="0.05"
          max="0.8"
          step="0.01"
          value={epsilon}
          onChange={(e) => setEpsilon(Number(e.target.value))}
          style={{ width: "100%", marginTop: 4, accentColor: "#f59e0b" }}
        />

        <div style={{ marginTop: "0.78rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.5rem" }}>
          <MetricCard label="TP" value={stats.tp} color="#22c55e" t={t} />
          <MetricCard label="FN" value={stats.fn} color="#ef4444" t={t} />
          <MetricCard label="FP" value={stats.fp} color="#f97316" t={t} />
          <MetricCard label="TN" value={stats.tn} color="#38bdf8" t={t} />
          <MetricCard label="Precision" value={stats.precision.toFixed(2)} color="#a78bfa" t={t} />
          <MetricCard label="Recall" value={stats.recall.toFixed(2)} color="#14b8a6" t={t} />
          <MetricCard label="F1" value={stats.f1.toFixed(2)} color="#f59e0b" t={t} />
        </div>

        <div style={{ marginTop: "0.72rem", fontSize: "0.73rem", color: t.tick }}>
          Rule in this lab: flag anomaly if <code>p(x) &lt; epsilon</code>.
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, t }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.6rem" }}>
      <div style={{ fontSize: "0.7rem", color: t.muted2 }}>{label}</div>
      <div style={{ fontSize: "0.95rem", fontWeight: 700, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}
