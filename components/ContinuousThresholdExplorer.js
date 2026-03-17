"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const DATA = [
  { id: 1, weight: 6, y: 1 },
  { id: 2, weight: 7, y: 1 },
  { id: 3, weight: 8, y: 1 },
  { id: 4, weight: 9, y: 1 },
  { id: 5, weight: 11, y: 1 },
  { id: 6, weight: 10, y: 0 },
  { id: 7, weight: 12, y: 0 },
  { id: 8, weight: 13, y: 0 },
  { id: 9, weight: 14, y: 0 },
  { id: 10, weight: 15, y: 0 },
];

function entropyFromLabels(rows) {
  if (!rows.length) return 0;
  const p1 = rows.filter((row) => row.y === 1).length / rows.length;
  const p0 = 1 - p1;
  const term = (p) => (p === 0 ? 0 : -p * Math.log2(p));
  return term(p1) + term(p0);
}

function infoGain(threshold) {
  const left = DATA.filter((row) => row.weight <= threshold);
  const right = DATA.filter((row) => row.weight > threshold);
  const rootEntropy = entropyFromLabels(DATA);
  const weighted = (left.length / DATA.length) * entropyFromLabels(left) + (right.length / DATA.length) * entropyFromLabels(right);
  return {
    threshold,
    left,
    right,
    gain: rootEntropy - weighted,
  };
}

export default function ContinuousThresholdExplorer() {
  const [threshold, setThreshold] = useState(9);
  const t = useChartTheme();

  const candidates = useMemo(() => {
    const sorted = [...new Set(DATA.map((row) => row.weight))].sort((a, b) => a - b);
    const mids = [];
    for (let i = 0; i < sorted.length - 1; i += 1) {
      mids.push((sorted[i] + sorted[i + 1]) / 2);
    }
    return mids;
  }, []);

  const result = useMemo(() => infoGain(threshold), [threshold]);
  const best = useMemo(() => {
    return candidates
      .map((c) => infoGain(c))
      .sort((a, b) => b.gain - a.gain)[0];
  }, [candidates]);

  if (!t) return <div style={{ height: 320 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        For continuous features, trees test multiple thresholds and select the one with the highest information gain.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.85rem" }}>
        <label style={{ display: "block", fontSize: "0.76rem", color: t.muted2 }}>
          Threshold (weight &lt;= t): {threshold}
          <input
            type="range"
            min={6}
            max={15}
            step={1}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            style={{ width: "100%", marginTop: 6, accentColor: "#facc15" }}
          />
        </label>

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.72rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Left branch (weight &lt;= {threshold})</div>
            <div style={{ marginTop: 4, fontSize: "0.74rem", color: t.muted3 }}>
              cats: {result.left.filter((row) => row.y === 1).length} | not cats: {result.left.filter((row) => row.y === 0).length}
            </div>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.72rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Right branch (weight &gt; {threshold})</div>
            <div style={{ marginTop: 4, fontSize: "0.74rem", color: t.muted3 }}>
              cats: {result.right.filter((row) => row.y === 1).length} | not cats: {result.right.filter((row) => row.y === 0).length}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.78rem", border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.72rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>
              Information gain at threshold {threshold}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "#22c55e", fontWeight: 700 }}>
              {result.gain.toFixed(3)}
            </div>
          </div>
          <div style={{ marginTop: 5, fontSize: "0.73rem", color: t.muted3 }}>
            Best candidate among midpoint thresholds: {best.threshold} (gain {best.gain.toFixed(3)}).
          </div>
        </div>

        <div style={{ marginTop: "0.8rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.73rem" }}>
            <thead>
              <tr style={{ color: t.muted2 }}>
                <th style={{ textAlign: "left", padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>Weight</th>
                <th style={{ textAlign: "left", padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>Label</th>
                <th style={{ textAlign: "left", padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>Branch at t={threshold}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>{row.weight}</td>
                  <td style={{ padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>{row.y === 1 ? "cat" : "not cat"}</td>
                  <td style={{ padding: "0.34rem", borderBottom: `1px solid ${t.border}` }}>{row.weight <= threshold ? "left" : "right"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

