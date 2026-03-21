"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const K_VALUES = [2, 3, 4, 5, 6, 7, 8];
const DISTORTION = [16.4, 11.9, 9.6, 8.4, 7.8, 7.3, 6.9];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export default function ElbowMethodExplorer() {
  const [selectedK, setSelectedK] = useState(4);
  const [qualityWeight, setQualityWeight] = useState(0.65);
  const t = useChartTheme();

  const utility = useMemo(
    () =>
      K_VALUES.map((k, idx) => {
        const quality = 1 - DISTORTION[idx] / DISTORTION[0];
        const opsPenalty = (k - 2) / 8;
        const score = qualityWeight * quality - (1 - qualityWeight) * opsPenalty;
        return { k, quality, opsPenalty, score };
      }),
    [qualityWeight]
  );

  const best = utility.reduce((acc, cur) => (cur.score > acc.score ? cur : acc), utility[0]);
  const selected = utility.find((u) => u.k === selectedK) || utility[0];

  if (!t) return <div style={{ height: 240 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: t.muted3 }}>
        Elbow is a hint, not a law. Compare distortion reduction with downstream complexity to choose <code>k</code>.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.82rem" }}>
        <label style={{ display: "block", fontSize: "0.76rem", color: t.muted2, marginBottom: "0.4rem" }}>
          Business weight toward cluster quality: {qualityWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={qualityWeight}
          onChange={(e) => setQualityWeight(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#38bdf8" }}
        />

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: "0.45rem" }}>
          {utility.map((u, idx) => {
            const isSelected = u.k === selectedK;
            const distortionPct = clamp((DISTORTION[idx] / DISTORTION[0]) * 100, 8, 100);
            const scorePct = clamp((u.score + 0.5) * 60, 0, 100);
            return (
              <button
                key={u.k}
                type="button"
                onClick={() => setSelectedK(u.k)}
                style={{
                  textAlign: "left",
                  borderRadius: 10,
                  border: `1px solid ${isSelected ? "#22c55e" : t.border}`,
                  background: isSelected ? "rgba(34,197,94,0.1)" : t.surface2,
                  padding: "0.55rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.76rem", color: t.tick }}>k = {u.k}</div>
                <div style={{ fontSize: "0.8rem", color: t.labelMid, fontWeight: 700, marginTop: 3 }}>J = {DISTORTION[idx].toFixed(1)}</div>
                <div style={{ height: 5, background: t.surface3, borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${100 - distortionPct}%`, height: "100%", background: "#38bdf8" }} />
                </div>
                <div style={{ height: 5, background: t.surface3, borderRadius: 999, marginTop: 5, overflow: "hidden" }}>
                  <div style={{ width: `${scorePct}%`, height: "100%", background: "#f59e0b" }} />
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "0.78rem", borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}`, padding: "0.7rem" }}>
          <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Selection readout</div>
          <div style={{ marginTop: 3, fontSize: "0.82rem", color: t.labelMid }}>
            chosen <b>k={selected.k}</b>, distortion <b>{DISTORTION[K_VALUES.indexOf(selected.k)].toFixed(1)}</b>, utility <b>{selected.score.toFixed(3)}</b>
          </div>
          <div style={{ marginTop: 6, fontSize: "0.74rem", color: t.tick }}>
            current best under this business weighting: <b style={{ color: "#22c55e" }}>k={best.k}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
