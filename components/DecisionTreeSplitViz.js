"use client";

import { useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const CATEGORICAL_SPLITS = [
  {
    id: "ear-shape",
    label: "Ear shape",
    informationGain: 0.28,
    left: { title: "Pointy ears", cats: 4, dogs: 1, entropy: 0.72 },
    right: { title: "Floppy ears", cats: 1, dogs: 4, entropy: 0.72 },
  },
  {
    id: "face-shape",
    label: "Face shape",
    informationGain: 0.03,
    left: { title: "Round face", cats: 4, dogs: 3, entropy: 0.99 },
    right: { title: "Not round", cats: 1, dogs: 2, entropy: 0.92 },
  },
  {
    id: "whiskers",
    label: "Whiskers",
    informationGain: 0.12,
    left: { title: "Present", cats: 3, dogs: 1, entropy: 0.81 },
    right: { title: "Absent", cats: 2, dogs: 4, entropy: 0.92 },
  },
];

const CONTINUOUS_THRESHOLDS = [
  {
    threshold: 8,
    informationGain: 0.24,
    left: { label: "weight <= 8", cats: 2, dogs: 0 },
    right: { label: "weight > 8", cats: 3, dogs: 5 },
  },
  {
    threshold: 9,
    informationGain: 0.61,
    left: { label: "weight <= 9", cats: 4, dogs: 0 },
    right: { label: "weight > 9", cats: 1, dogs: 5 },
  },
  {
    threshold: 13,
    informationGain: 0.40,
    left: { label: "weight <= 13", cats: 5, dogs: 2 },
    right: { label: "weight > 13", cats: 0, dogs: 3 },
  },
];

function purity(cats, dogs) {
  const total = cats + dogs;
  return total === 0 ? 0 : Math.max(cats, dogs) / total;
}

export default function DecisionTreeSplitViz() {
  const [mode, setMode] = useState("categorical");
  const [selectedSplit, setSelectedSplit] = useState("ear-shape");
  const [thresholdIndex, setThresholdIndex] = useState(1);
  const t = useChartTheme();

  if (!t) return <div style={{ height: 320 }} />;

  const chosenCategorical = CATEGORICAL_SPLITS.find((item) => item.id === selectedSplit) || CATEGORICAL_SPLITS[0];
  const chosenContinuous = CONTINUOUS_THRESHOLDS[thresholdIndex] || CONTINUOUS_THRESHOLDS[1];
  const active = mode === "categorical" ? chosenCategorical : chosenContinuous;
  const activeGain = active.informationGain;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        Explore how a tree chooses the next split by comparing impurity reduction across candidate features and thresholds.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.85rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {[
            { id: "categorical", label: "Categorical split" },
            { id: "continuous", label: "Continuous threshold" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              style={{
                borderRadius: 999,
                border: `1px solid ${mode === option.id ? "#22c55e" : t.btnBorder}`,
                background: mode === option.id ? "rgba(34,197,94,0.12)" : t.btnBg,
                color: mode === option.id ? "#22c55e" : t.btnText,
                padding: "0.38rem 0.72rem",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {mode === "categorical" ? (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {CATEGORICAL_SPLITS.map((item) => {
              const activeRow = item.id === selectedSplit;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSplit(item.id)}
                  style={{
                    textAlign: "left",
                    borderRadius: 10,
                    border: `1px solid ${activeRow ? "#38bdf8" : t.border}`,
                    background: activeRow ? "rgba(56,189,248,0.10)" : t.surface2,
                    padding: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
                    <div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: activeRow ? "#38bdf8" : t.labelMid }}>{item.label}</div>
                      <div style={{ fontSize: "0.72rem", color: t.muted2 }}>
                        Left entropy {item.left.entropy.toFixed(2)} | Right entropy {item.right.entropy.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.86rem", fontWeight: 700, color: "#22c55e" }}>
                      IG {item.informationGain.toFixed(2)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <label style={{ fontSize: "0.76rem", color: t.muted3, display: "flex", justifyContent: "space-between" }}>
              <span>Threshold candidate</span>
              <span style={{ fontFamily: "monospace", color: "#facc15", fontWeight: 700 }}>
                weight &lt;= {chosenContinuous.threshold}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={CONTINUOUS_THRESHOLDS.length - 1}
              step={1}
              value={thresholdIndex}
              onChange={(e) => setThresholdIndex(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#facc15", marginTop: 6 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: t.tick, marginTop: 2 }}>
              {CONTINUOUS_THRESHOLDS.map((item) => (
                <span key={item.threshold}>{item.threshold}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "0.85rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem" }}>
          {[active.left, active.right].map((branch) => {
            const branchPurity = purity(branch.cats, branch.dogs);
            return (
              <div key={branch.title || branch.label} style={{ background: t.surface2, borderRadius: 10, padding: "0.8rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.labelMid }}>
                  {branch.title || branch.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 4 }}>
                  cats: {branch.cats} | dogs: {branch.dogs}
                </div>
                <div style={{ height: 7, background: t.surface3, borderRadius: 999, marginTop: 10, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${branchPurity * 100}%`,
                      height: "100%",
                      background: branchPurity >= 0.8 ? "#22c55e" : branchPurity >= 0.65 ? "#facc15" : "#f97316",
                      borderRadius: 999,
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.72rem", color: t.tick, marginTop: 6 }}>
                  purity {branchPurity.toFixed(2)} (closer to 1 means cleaner branch)
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "0.9rem",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 10,
            padding: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.76rem", color: t.muted2 }}>Selected split summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem", marginTop: 4 }}>
            <div style={{ fontSize: "0.84rem", color: t.labelMid, fontWeight: 700 }}>
              {mode === "categorical" ? chosenCategorical.label : `weight <= ${chosenContinuous.threshold}`}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "1rem", color: "#22c55e", fontWeight: 800 }}>
              information gain {activeGain.toFixed(2)}
            </div>
          </div>
          <div style={{ fontSize: "0.73rem", color: t.muted3, marginTop: 6 }}>
            The tree prefers the split that reduces weighted impurity the most. Higher information gain means cleaner child branches.
          </div>
        </div>
      </div>
    </div>
  );
}
