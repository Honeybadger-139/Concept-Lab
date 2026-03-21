"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function gaussian(x, mu, sigma) {
  const coeff = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  const exp = Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma));
  return coeff * exp;
}

function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(hi, value));
}

export default function GaussianDensityAnomalyViz() {
  const [mu, setMu] = useState(5);
  const [sigma, setSigma] = useState(1.4);
  const [xTest, setXTest] = useState(8.2);
  const [epsilon, setEpsilon] = useState(0.06);
  const t = useChartTheme();

  const density = useMemo(() => gaussian(xTest, mu, sigma), [xTest, mu, sigma]);
  const flagged = density < epsilon;
  const points = useMemo(() => {
    const arr = [];
    for (let x = 0; x <= 10.0001; x += 0.25) {
      arr.push({ x, y: gaussian(x, mu, sigma) });
    }
    return arr;
  }, [mu, sigma]);

  if (!t) return <div style={{ height: 220 }} />;

  const width = 360;
  const height = 210;
  const pad = 18;
  const maxY = clamp(gaussian(mu, mu, sigma) * 1.1, 0.3, 2);
  const toX = (x) => pad + (x / 10) * (width - pad * 2);
  const toY = (y) => height - pad - (y / maxY) * (height - pad * 2);
  const path = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${toX(p.x)} ${toY(p.y)}`).join(" ");

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.7rem", fontSize: "0.82rem", color: t.muted3 }}>
        Move the test point and threshold to see how anomaly decisions come from <code>p(x) &lt; epsilon</code>.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.82rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginBottom: "0.65rem" }}>
          <LabeledSlider label="mu" value={mu} min={1} max={9} step={0.1} onChange={setMu} t={t} />
          <LabeledSlider label="sigma" value={sigma} min={0.5} max={3} step={0.1} onChange={setSigma} t={t} />
          <LabeledSlider label="x_test" value={xTest} min={0} max={10} step={0.1} onChange={setXTest} t={t} />
          <LabeledSlider label="epsilon" value={epsilon} min={0.005} max={0.25} step={0.005} onChange={setEpsilon} t={t} />
        </div>

        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}` }}>
          <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2.2" />
          <line x1={pad} y1={toY(epsilon)} x2={width - pad} y2={toY(epsilon)} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth="1.4" />
          <circle cx={toX(xTest)} cy={toY(density)} r="4.8" fill={flagged ? "#ef4444" : "#22c55e"} />
        </svg>

        <div style={{ marginTop: "0.68rem", fontSize: "0.8rem", color: t.labelMid }}>
          <b>p(x_test) = {density.toFixed(4)}</b> and epsilon = {epsilon.toFixed(3)} ->{" "}
          <b style={{ color: flagged ? "#ef4444" : "#22c55e" }}>{flagged ? "flag anomaly" : "normal"}</b>
        </div>
      </div>
    </div>
  );
}

function LabeledSlider({ label, value, min, max, step, onChange, t }) {
  return (
    <label style={{ fontSize: "0.74rem", color: t.tick }}>
      {label}: <b style={{ color: t.labelMid }}>{Number(value).toFixed(3).replace(/\.000$/, "")}</b>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", marginTop: 3, accentColor: "#38bdf8" }}
      />
    </label>
  );
}
