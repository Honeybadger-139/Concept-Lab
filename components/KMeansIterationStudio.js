"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const BASE_POINTS = [
  { x: 1.1, y: 5.7 },
  { x: 1.8, y: 5.1 },
  { x: 2.2, y: 4.7 },
  { x: 2.8, y: 5.5 },
  { x: 5.4, y: 1.6 },
  { x: 5.8, y: 2.0 },
  { x: 6.3, y: 1.2 },
  { x: 6.8, y: 2.4 },
  { x: 8.1, y: 4.8 },
  { x: 8.5, y: 5.4 },
  { x: 8.9, y: 4.3 },
  { x: 9.3, y: 5.0 },
];

const INITIAL_CENTROIDS_BY_K = {
  2: [
    { x: 2.0, y: 1.2 },
    { x: 8.8, y: 5.5 },
  ],
  3: [
    { x: 1.5, y: 5.6 },
    { x: 6.0, y: 1.6 },
    { x: 8.6, y: 4.8 },
  ],
  4: [
    { x: 1.2, y: 5.6 },
    { x: 3.0, y: 4.9 },
    { x: 6.1, y: 1.6 },
    { x: 8.7, y: 4.9 },
  ],
};

const PALETTE = ["#38bdf8", "#22c55e", "#f59e0b", "#f97316", "#e879f9"];

function sqDist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function assign(points, centroids) {
  return points.map((point) => {
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, idx) => {
      const d = sqDist(point, c);
      if (d < bestD) {
        bestD = d;
        best = idx;
      }
    });
    return best;
  });
}

function update(points, assignments, centroids) {
  return centroids.map((c, idx) => {
    const selected = points.filter((_, pIdx) => assignments[pIdx] === idx);
    if (selected.length === 0) return c;
    const sum = selected.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / selected.length, y: sum.y / selected.length };
  });
}

function totalDistortion(points, centroids, assignments) {
  return points.reduce((acc, p, idx) => acc + sqDist(p, centroids[assignments[idx]]), 0) / points.length;
}

export default function KMeansIterationStudio() {
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState(INITIAL_CENTROIDS_BY_K[3]);
  const [iter, setIter] = useState(0);
  const t = useChartTheme();

  const assignments = useMemo(() => assign(BASE_POINTS, centroids), [centroids]);
  const distortion = useMemo(() => totalDistortion(BASE_POINTS, centroids, assignments), [assignments, centroids]);

  if (!t) return <div style={{ height: 260 }} />;

  const width = 360;
  const height = 230;
  const pad = 18;
  const toX = (x) => pad + ((x - 1) / 9) * (width - pad * 2);
  const toY = (y) => height - pad - ((y - 1) / 5.5) * (height - pad * 2);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: t.muted3 }}>
        Step through K-means: assign each point to its nearest centroid, then move each centroid to the mean of assigned points.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.8rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            k:
            <select
              value={k}
              onChange={(e) => {
                const nextK = Number(e.target.value);
                setK(nextK);
                setCentroids(INITIAL_CENTROIDS_BY_K[nextK]);
                setIter(0);
              }}
              style={{ marginLeft: 6, borderRadius: 6, background: t.surface2, border: `1px solid ${t.border}`, color: t.labelMid }}
            >
              {[2, 3, 4].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              const nextAssignments = assign(BASE_POINTS, centroids);
              setCentroids(update(BASE_POINTS, nextAssignments, centroids));
              setIter((v) => v + 1);
            }}
            style={{ borderRadius: 8, border: `1px solid ${t.btnBorder}`, background: t.btnBg, color: t.btnText, padding: "0.35rem 0.62rem", fontSize: "0.75rem", cursor: "pointer" }}
          >
            Run 1 iteration
          </button>
          <button
            type="button"
            onClick={() => {
              setCentroids(INITIAL_CENTROIDS_BY_K[k]);
              setIter(0);
            }}
            style={{ borderRadius: 8, border: `1px solid ${t.btnBorder}`, background: t.btnBg, color: t.btnText, padding: "0.35rem 0.62rem", fontSize: "0.75rem", cursor: "pointer" }}
          >
            Reset
          </button>
          <span style={{ marginLeft: "auto", fontSize: "0.74rem", color: t.tick }}>
            iter: <b style={{ color: t.labelMid }}>{iter}</b> | distortion: <b style={{ color: "#22c55e" }}>{distortion.toFixed(3)}</b>
          </span>
        </div>

        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}` }}>
          {BASE_POINTS.map((point, idx) => {
            const cluster = assignments[idx];
            return (
              <circle
                key={`${point.x}-${point.y}`}
                cx={toX(point.x)}
                cy={toY(point.y)}
                r="4.8"
                fill={PALETTE[cluster]}
                stroke={t.bg}
                strokeWidth="1.2"
              />
            );
          })}
          {centroids.map((c, idx) => (
            <g key={`c-${idx}`}>
              <line x1={toX(c.x) - 6} y1={toY(c.y) - 6} x2={toX(c.x) + 6} y2={toY(c.y) + 6} stroke={PALETTE[idx]} strokeWidth="2.2" />
              <line x1={toX(c.x) + 6} y1={toY(c.y) - 6} x2={toX(c.x) - 6} y2={toY(c.y) + 6} stroke={PALETTE[idx]} strokeWidth="2.2" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
