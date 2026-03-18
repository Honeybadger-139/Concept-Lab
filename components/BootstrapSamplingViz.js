"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const BASE = Array.from({ length: 10 }, (_, idx) => idx + 1);

function buildBootstrap(seed, sampleSize) {
  const rows = [];
  let state = seed * 1103515245 + 12345;
  for (let i = 0; i < sampleSize; i += 1) {
    state = (1664525 * state + 1013904223) % 4294967296;
    const pick = BASE[state % BASE.length];
    rows.push(pick);
  }
  return rows;
}

export default function BootstrapSamplingViz() {
  const [seed, setSeed] = useState(3);
  const [sampleSize, setSampleSize] = useState(10);
  const t = useChartTheme();

  const sample = useMemo(() => buildBootstrap(seed, sampleSize), [seed, sampleSize]);
  const counts = useMemo(() => {
    const map = new Map(BASE.map((id) => [id, 0]));
    sample.forEach((id) => map.set(id, (map.get(id) ?? 0) + 1));
    return BASE.map((id) => ({ id, count: map.get(id) ?? 0 }));
  }, [sample]);

  if (!t) return <div style={{ height: 280 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.78rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Sampling with replacement builds new training sets by repeatedly drawing examples and putting them back, so some examples repeat and some are skipped.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.86rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            Random seed: {seed}
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={seed}
              onChange={(event) => setSeed(Number(event.target.value))}
              style={{ width: "100%", marginTop: 5, accentColor: "#38bdf8" }}
            />
          </label>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            Sample size: {sampleSize}
            <input
              type="range"
              min={6}
              max={16}
              step={1}
              value={sampleSize}
              onChange={(event) => setSampleSize(Number(event.target.value))}
              style={{ width: "100%", marginTop: 5, accentColor: "#22c55e" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "0.82rem", border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.68rem" }}>
          <div style={{ fontSize: "0.73rem", color: t.muted2, marginBottom: 5 }}>Bootstrapped training set draw order</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.84rem", color: t.labelMid, lineHeight: 1.5 }}>
            [{sample.join(", ")}]
          </div>
        </div>

        <div style={{ marginTop: "0.82rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: "0.45rem" }}>
          {counts.map((entry) => (
            <div key={entry.id} style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.45rem" }}>
              <div style={{ fontSize: "0.69rem", color: t.muted2 }}>ex {entry.id}</div>
              <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: entry.count > 1 ? "#f97316" : entry.count === 0 ? "#ef4444" : t.labelMid }}>
                x{entry.count}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "0.75rem", fontSize: "0.73rem", color: t.muted3, lineHeight: 1.52 }}>
          This randomness is why different trees in a bagged ensemble see slightly different data and produce different boundaries. Voting across them improves robustness.
        </div>
      </div>
    </div>
  );
}

