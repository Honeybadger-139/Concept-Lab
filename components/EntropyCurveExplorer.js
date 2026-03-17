"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function entropy(p1) {
  const p0 = 1 - p1;
  const term = (p) => (p === 0 ? 0 : -p * Math.log2(p));
  return term(p1) + term(p0);
}

export default function EntropyCurveExplorer() {
  const [p1, setP1] = useState(0.5);
  const t = useChartTheme();

  const points = useMemo(() => {
    const rows = [];
    for (let i = 0; i <= 20; i += 1) {
      const x = i / 20;
      rows.push({ x, y: entropy(x) });
    }
    return rows;
  }, []);

  if (!t) return <div style={{ height: 320 }} />;

  const h = entropy(p1);
  const total = 12;
  const cats = Math.round(total * p1);
  const dogs = total - cats;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Entropy measures node impurity. It is lowest at fully pure nodes and highest when classes are evenly mixed.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.85rem" }}>
        <label style={{ display: "block", fontSize: "0.76rem", color: t.muted2 }}>
          Positive class fraction p1: {p1.toFixed(2)} | entropy H(p1): {h.toFixed(3)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={p1}
            onChange={(event) => setP1(Number(event.target.value))}
            style={{ width: "100%", marginTop: 6, accentColor: "#22c55e" }}
          />
        </label>

        <div style={{ marginTop: "0.8rem", background: t.surface2, borderRadius: 10, padding: "0.7rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
            <span>Sample node composition</span>
            <span style={{ fontFamily: "monospace" }}>
              cats {cats} | dogs {dogs}
            </span>
          </div>
          <div style={{ height: 10, background: t.surface3, borderRadius: 999, marginTop: 8, overflow: "hidden" }}>
            <div style={{ width: `${p1 * 100}%`, height: "100%", background: "#22c55e" }} />
          </div>
        </div>

        <div style={{ marginTop: "0.9rem", overflowX: "auto" }}>
          <svg viewBox="0 0 420 170" width="100%" role="img" aria-label="Entropy curve">
            <rect x="0" y="0" width="420" height="170" fill={t.surface2} rx="10" />
            <line x1="36" y1="136" x2="392" y2="136" stroke={t.gridMid} />
            <line x1="36" y1="20" x2="36" y2="136" stroke={t.gridMid} />
            <text x="36" y="152" fill={t.tick} fontSize="10">
              0
            </text>
            <text x="205" y="152" fill={t.tick} fontSize="10">
              0.5
            </text>
            <text x="384" y="152" fill={t.tick} fontSize="10">
              1
            </text>
            <text x="12" y="24" fill={t.tick} fontSize="10">
              1
            </text>
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.4"
              points={points
                .map((pt) => {
                  const x = 36 + pt.x * 356;
                  const y = 136 - pt.y * 116;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
            <circle cx={36 + p1 * 356} cy={136 - h * 116} r="4.5" fill="#22c55e" />
          </svg>
        </div>

        <div style={{ marginTop: "0.7rem", fontSize: "0.74rem", color: t.muted3, lineHeight: 1.5 }}>
          At p1 = 0.5, entropy reaches its peak (maximum uncertainty). At p1 near 0 or 1, entropy approaches 0 (high purity).
        </div>
      </div>
    </div>
  );
}

