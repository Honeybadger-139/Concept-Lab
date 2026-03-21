"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const POINTS = [
  { x: 1.2, y: 5.3 },
  { x: 1.8, y: 5.7 },
  { x: 2.4, y: 4.9 },
  { x: 2.9, y: 5.4 },
  { x: 4.7, y: 2.3 },
  { x: 5.3, y: 1.8 },
  { x: 5.9, y: 2.6 },
  { x: 6.4, y: 1.3 },
  { x: 7.8, y: 5.2 },
  { x: 8.4, y: 4.7 },
  { x: 8.8, y: 5.4 },
  { x: 9.2, y: 4.5 },
];

const CENTROIDS = [
  { x: 1.8, y: 5.3 },
  { x: 5.6, y: 1.9 },
  { x: 8.6, y: 5.0 },
];

const PALETTE = ["#38bdf8", "#22c55e", "#f59e0b"];

function distSq(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export default function ClusterAssignmentPlayground() {
  const [showDistances, setShowDistances] = useState(false);
  const t = useChartTheme();

  const assignments = useMemo(
    () =>
      POINTS.map((point) => {
        let best = 0;
        let bestD = Infinity;
        CENTROIDS.forEach((centroid, idx) => {
          const d = distSq(point, centroid);
          if (d < bestD) {
            best = idx;
            bestD = d;
          }
        });
        return best;
      }),
    []
  );

  if (!t) return <div style={{ height: 240 }} />;

  const width = 360;
  const height = 230;
  const pad = 18;
  const toX = (x) => pad + ((x - 1) / 9) * (width - pad * 2);
  const toY = (y) => height - pad - ((y - 1) / 5.5) * (height - pad * 2);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.7rem", fontSize: "0.82rem", color: t.muted3 }}>
        Clustering assignment step: each point is colored by the nearest centroid under Euclidean distance.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.8rem" }}>
        <button
          type="button"
          onClick={() => setShowDistances((v) => !v)}
          style={{ borderRadius: 8, border: `1px solid ${t.btnBorder}`, background: t.btnBg, color: t.btnText, padding: "0.35rem 0.62rem", fontSize: "0.75rem", cursor: "pointer", marginBottom: "0.65rem" }}
        >
          {showDistances ? "Hide" : "Show"} assignment links
        </button>

        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}` }}>
          {showDistances &&
            POINTS.map((point, idx) => {
              const cIdx = assignments[idx];
              return (
                <line
                  key={`l-${idx}`}
                  x1={toX(point.x)}
                  y1={toY(point.y)}
                  x2={toX(CENTROIDS[cIdx].x)}
                  y2={toY(CENTROIDS[cIdx].y)}
                  stroke={PALETTE[cIdx]}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              );
            })}

          {POINTS.map((point, idx) => {
            const cIdx = assignments[idx];
            return <circle key={`p-${idx}`} cx={toX(point.x)} cy={toY(point.y)} r="4.5" fill={PALETTE[cIdx]} stroke={t.bg} strokeWidth="1.2" />;
          })}

          {CENTROIDS.map((centroid, idx) => (
            <g key={`c-${idx}`}>
              <line x1={toX(centroid.x) - 6} y1={toY(centroid.y) - 6} x2={toX(centroid.x) + 6} y2={toY(centroid.y) + 6} stroke={PALETTE[idx]} strokeWidth="2.4" />
              <line x1={toX(centroid.x) + 6} y1={toY(centroid.y) - 6} x2={toX(centroid.x) - 6} y2={toY(centroid.y) + 6} stroke={PALETTE[idx]} strokeWidth="2.4" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
