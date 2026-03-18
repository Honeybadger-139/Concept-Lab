"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(hi, value));
}

export default function TreeEnsembleWorkbench() {
  const [modelType, setModelType] = useState("bagged");
  const [trees, setTrees] = useState(100);
  const [maxDepth, setMaxDepth] = useState(6);
  const [featureFrac, setFeatureFrac] = useState(0.6);
  const [focusHardCases, setFocusHardCases] = useState(0.55);
  const t = useChartTheme();

  const metrics = useMemo(() => {
    const depthFactor = clamp((maxDepth - 2) / 10, 0, 1);
    const ensembleFactor = clamp(Math.log2(trees) / 8, 0, 1);
    const featureFactor = clamp(featureFrac, 0.2, 1);
    const hardCaseFactor = clamp(focusHardCases, 0, 1);

    if (modelType === "single") {
      return {
        quality: 62 + depthFactor * 16,
        robustness: 40 + depthFactor * 8,
        trainCost: 12 + maxDepth * 2,
        inferenceCost: 9 + maxDepth * 1.6,
      };
    }
    if (modelType === "bagged") {
      return {
        quality: 69 + ensembleFactor * 14 + depthFactor * 7,
        robustness: 61 + ensembleFactor * 20,
        trainCost: 20 + trees * 0.15 + maxDepth * 2.2,
        inferenceCost: 10 + trees * 0.09 + maxDepth * 1.3,
      };
    }
    if (modelType === "random-forest") {
      return {
        quality: 72 + ensembleFactor * 16 + featureFactor * 7,
        robustness: 67 + ensembleFactor * 20 + (1 - featureFactor) * 5,
        trainCost: 24 + trees * 0.17 + maxDepth * 2.0,
        inferenceCost: 11 + trees * 0.1 + maxDepth * 1.2,
      };
    }
    return {
      quality: 75 + ensembleFactor * 13 + hardCaseFactor * 10,
      robustness: 70 + ensembleFactor * 14 + hardCaseFactor * 8,
      trainCost: 30 + trees * 0.2 + maxDepth * 2.4,
      inferenceCost: 13 + trees * 0.11 + maxDepth * 1.3,
    };
  }, [modelType, trees, maxDepth, featureFrac, focusHardCases]);

  if (!t) return <div style={{ height: 320 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Compare single trees, bagging, random forests, and boosting. This mirrors the progression from sensitivity-prone trees to robust ensembles.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.88rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.82rem" }}>
          {[
            ["single", "Single Tree"],
            ["bagged", "Bagged Trees"],
            ["random-forest", "Random Forest"],
            ["xgboost", "XGBoost"],
          ].map(([id, label]) => {
            const active = modelType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setModelType(id)}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${active ? "#22c55e" : t.btnBorder}`,
                  background: active ? "rgba(34,197,94,0.12)" : t.btnBg,
                  color: active ? "#22c55e" : t.btnText,
                  padding: "0.34rem 0.7rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.62rem" }}>
          <label style={{ fontSize: "0.73rem", color: t.muted2 }}>
            Number of trees: {trees}
            <input type="range" min={10} max={300} step={10} value={trees} onChange={(e) => setTrees(Number(e.target.value))} style={{ width: "100%", marginTop: 4, accentColor: "#38bdf8" }} />
          </label>
          <label style={{ fontSize: "0.73rem", color: t.muted2 }}>
            Max depth: {maxDepth}
            <input type="range" min={2} max={14} step={1} value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} style={{ width: "100%", marginTop: 4, accentColor: "#facc15" }} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.62rem", marginTop: "0.7rem" }}>
          <label style={{ fontSize: "0.73rem", color: t.muted2 }}>
            Feature subset ratio (RF): {(featureFrac * 100).toFixed(0)}%
            <input type="range" min={0.2} max={1} step={0.05} value={featureFrac} onChange={(e) => setFeatureFrac(Number(e.target.value))} style={{ width: "100%", marginTop: 4, accentColor: "#22c55e" }} />
          </label>
          <label style={{ fontSize: "0.73rem", color: t.muted2 }}>
            Hard-case focus (Boosting): {(focusHardCases * 100).toFixed(0)}%
            <input type="range" min={0.1} max={0.95} step={0.05} value={focusHardCases} onChange={(e) => setFocusHardCases(Number(e.target.value))} style={{ width: "100%", marginTop: 4, accentColor: "#f97316" }} />
          </label>
        </div>

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "0.55rem" }}>
          <StatCard label="Expected quality" value={`${metrics.quality.toFixed(1)} / 100`} color="#22c55e" t={t} />
          <StatCard label="Robustness" value={`${metrics.robustness.toFixed(1)} / 100`} color="#38bdf8" t={t} />
          <StatCard label="Train cost index" value={metrics.trainCost.toFixed(1)} color="#f97316" t={t} />
          <StatCard label="Inference cost index" value={metrics.inferenceCost.toFixed(1)} color="#a78bfa" t={t} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, t }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.62rem" }}>
      <div style={{ fontSize: "0.72rem", color: t.muted2 }}>{label}</div>
      <div style={{ marginTop: 2, fontFamily: "monospace", fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

