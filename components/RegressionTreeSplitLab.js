"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const DATA = [
  { id: 1, ear: "pointy", face: "round", weight: 7.2 },
  { id: 2, ear: "pointy", face: "round", weight: 8.4 },
  { id: 3, ear: "pointy", face: "round", weight: 7.6 },
  { id: 4, ear: "pointy", face: "round", weight: 10.2 },
  { id: 5, ear: "pointy", face: "not-round", weight: 9.2 },
  { id: 6, ear: "floppy", face: "round", weight: 8.8 },
  { id: 7, ear: "floppy", face: "round", weight: 11.0 },
  { id: 8, ear: "floppy", face: "not-round", weight: 15.0 },
  { id: 9, ear: "floppy", face: "not-round", weight: 18.0 },
  { id: 10, ear: "floppy", face: "not-round", weight: 20.0 },
];

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function variance(values) {
  if (!values.length) return 0;
  const mu = mean(values);
  return values.reduce((acc, value) => acc + (value - mu) ** 2, 0) / values.length;
}

function evaluateSplit(feature) {
  const left = DATA.filter((row) => row[feature] === "pointy" || row[feature] === "round");
  const right = DATA.filter((row) => !(row[feature] === "pointy" || row[feature] === "round"));

  const allVar = variance(DATA.map((row) => row.weight));
  const leftVar = variance(left.map((row) => row.weight));
  const rightVar = variance(right.map((row) => row.weight));
  const weighted = (left.length / DATA.length) * leftVar + (right.length / DATA.length) * rightVar;

  return {
    feature,
    left,
    right,
    rootVariance: allVar,
    leftVariance: leftVar,
    rightVariance: rightVar,
    weightedVariance: weighted,
    reduction: allVar - weighted,
    leftPrediction: mean(left.map((row) => row.weight)),
    rightPrediction: mean(right.map((row) => row.weight)),
  };
}

const SPLIT_CONFIG = {
  ear: { label: "Ear shape (pointy vs floppy)" },
  face: { label: "Face shape (round vs not-round)" },
};

export default function RegressionTreeSplitLab() {
  const [feature, setFeature] = useState("ear");
  const t = useChartTheme();

  const result = useMemo(() => evaluateSplit(feature), [feature]);

  if (!t) return <div style={{ height: 300 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Regression trees choose splits by maximizing variance reduction, then predict leaf values using the average target in each leaf.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.85rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {Object.entries(SPLIT_CONFIG).map(([id, meta]) => {
            const active = feature === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFeature(id)}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${active ? "#22c55e" : t.btnBorder}`,
                  background: active ? "rgba(34,197,94,0.14)" : t.btnBg,
                  color: active ? "#22c55e" : t.btnText,
                  padding: "0.35rem 0.72rem",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.68rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Root variance</div>
            <div style={{ marginTop: 3, fontFamily: "monospace", fontSize: "1rem", color: t.labelMid }}>
              {result.rootVariance.toFixed(2)}
            </div>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.68rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Weighted leaf variance</div>
            <div style={{ marginTop: 3, fontFamily: "monospace", fontSize: "1rem", color: t.labelMid }}>
              {result.weightedVariance.toFixed(2)}
            </div>
          </div>
          <div style={{ border: "1px solid rgba(34,197,94,0.35)", borderRadius: 10, background: "rgba(34,197,94,0.08)", padding: "0.68rem" }}>
            <div style={{ fontSize: "0.74rem", color: "#22c55e" }}>Variance reduction</div>
            <div style={{ marginTop: 3, fontFamily: "monospace", fontSize: "1rem", color: "#22c55e", fontWeight: 700 }}>
              {result.reduction.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.68rem" }}>
            <div style={{ fontSize: "0.75rem", color: t.muted2 }}>Left leaf prediction</div>
            <div style={{ marginTop: 3, fontFamily: "monospace", color: "#38bdf8" }}>{result.leftPrediction.toFixed(2)} lbs</div>
            <div style={{ marginTop: 5, fontSize: "0.72rem", color: t.muted3 }}>
              Samples: {result.left.length} | variance: {result.leftVariance.toFixed(2)}
            </div>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.68rem" }}>
            <div style={{ fontSize: "0.75rem", color: t.muted2 }}>Right leaf prediction</div>
            <div style={{ marginTop: 3, fontFamily: "monospace", color: "#f97316" }}>{result.rightPrediction.toFixed(2)} lbs</div>
            <div style={{ marginTop: 5, fontSize: "0.72rem", color: t.muted3 }}>
              Samples: {result.right.length} | variance: {result.rightVariance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

