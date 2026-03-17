"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function precision(tp, fp) {
  const denom = tp + fp;
  return denom === 0 ? 0 : tp / denom;
}

function recall(tp, fn) {
  const denom = tp + fn;
  return denom === 0 ? 0 : tp / denom;
}

function f1(p, r) {
  const denom = p + r;
  return denom === 0 ? 0 : (2 * p * r) / denom;
}

export default function ImbalanceConfusionLab() {
  const [baseRate, setBaseRate] = useState(0.5);
  const [threshold, setThreshold] = useState(0.5);
  const total = 10000;
  const t = useChartTheme();

  if (!t) return <div style={{ height: 320 }} />;

  const stats = useMemo(() => {
    const positives = Math.round((baseRate / 100) * total);
    const negatives = total - positives;

    const tpr = Math.max(0, Math.min(1, 1.02 - threshold)); // higher threshold lowers recall
    const fpr = Math.max(0, Math.min(1, 0.28 - threshold * 0.25)); // higher threshold lowers FP

    const tp = Math.round(positives * tpr);
    const fn = positives - tp;
    const fp = Math.round(negatives * fpr);
    const tn = negatives - fp;

    const acc = (tp + tn) / total;
    const p = precision(tp, fp);
    const r = recall(tp, fn);
    const f = f1(p, r);

    return { tp, fn, fp, tn, acc, p, r, f };
  }, [baseRate, threshold]);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Accuracy can look excellent on rare-event datasets while the model still misses the event that matters. Use the confusion matrix and threshold controls to inspect the real operating behavior.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: "12px", background: t.bg, padding: "0.8rem" }}>
          <label style={{ display: "block", fontSize: "0.79rem", color: t.muted2, marginBottom: "0.55rem" }}>
            Positive-class base rate: {baseRate.toFixed(1)}%
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={baseRate}
              onChange={(event) => setBaseRate(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem", accentColor: "#22c55e" }}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.79rem", color: t.muted2 }}>
            Decision threshold: {threshold.toFixed(2)}
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem", accentColor: "#facc15" }}
            />
          </label>
        </div>

        <div style={{ border: `1px solid ${t.border}`, borderRadius: "12px", background: t.surface2, padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Confusion matrix (simulated)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.42rem", marginBottom: "0.55rem" }}>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(16,185,129,0.32)", background: "rgba(16,185,129,0.14)", padding: "0.52rem 0.62rem", fontSize: "0.76rem", color: "#d1fae5" }}>
              TP: <strong>{stats.tp}</strong>
            </div>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(245,158,11,0.32)", background: "rgba(245,158,11,0.14)", padding: "0.52rem 0.62rem", fontSize: "0.76rem", color: "#fef3c7" }}>
              FP: <strong>{stats.fp}</strong>
            </div>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(239,68,68,0.32)", background: "rgba(239,68,68,0.14)", padding: "0.52rem 0.62rem", fontSize: "0.76rem", color: "#fecaca" }}>
              FN: <strong>{stats.fn}</strong>
            </div>
            <div style={{ borderRadius: "10px", border: "1px solid rgba(59,130,246,0.32)", background: "rgba(59,130,246,0.14)", padding: "0.52rem 0.62rem", fontSize: "0.76rem", color: "#dbeafe" }}>
              TN: <strong>{stats.tn}</strong>
            </div>
          </div>
        <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Accuracy: <strong style={{ color: "#f8fafc" }}>{(stats.acc * 100).toFixed(2)}%</strong> | Precision:{" "}
            <strong style={{ color: "#f8fafc" }}>{(stats.p * 100).toFixed(2)}%</strong> | Recall:{" "}
            <strong style={{ color: "#f8fafc" }}>{(stats.r * 100).toFixed(2)}%</strong> | F1:{" "}
            <strong style={{ color: "#f8fafc" }}>{stats.f.toFixed(3)}</strong>
          </div>
        </div>
      </div>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: "12px", background: t.bg, padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Practical read
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: t.muted3, lineHeight: 1.55 }}>
          Use this to decide policy, not just score models. If the rare event is the reason the system exists, high accuracy with low recall is usually a failure mode, not a win.
        </p>
      </div>
    </div>
  );
}
