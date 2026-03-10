"use client";
import { useState, useEffect, useRef } from "react";

// Raw features: [sqft (500-3500), bedrooms (1-5)]
const RAW_DATA = [
  [500, 1], [800, 1], [1200, 2], [1500, 2], [1800, 3],
  [2100, 3], [2400, 4], [2700, 4], [3000, 5], [3300, 5],
];

function minMaxScale(data) {
  const x0 = data.map(d => d[0]), x1 = data.map(d => d[1]);
  const mn0 = Math.min(...x0), mx0 = Math.max(...x0);
  const mn1 = Math.min(...x1), mx1 = Math.max(...x1);
  return data.map(([a, b]) => [(a - mn0) / (mx0 - mn0), (b - mn1) / (mx1 - mn1)]);
}

const SCALED_DATA = minMaxScale(RAW_DATA);

// Gradient descent paths on contour plots
function runGD(alpha, start, costFn, gradFn, n) {
  const path = [start];
  let p = [...start];
  for (let i = 0; i < n; i++) {
    const g = gradFn(p);
    p = [p[0] - alpha * g[0], p[1] - alpha * g[1]];
    path.push([...p]);
    if (Math.abs(g[0]) < 0.001 && Math.abs(g[1]) < 0.001) break;
  }
  return path;
}

// Unscaled cost: very elongated ellipse (different feature scales)
const unscaledGrad = ([w0, w1]) => [2 * w0 * 500, 2 * w1 * 0.5];
const unscaledPath = runGD(0.000003, [-0.8, 0.8], null, unscaledGrad, 60);

// Scaled cost: circular (both features [0,1])
const scaledGrad = ([w0, w1]) => [2 * w0, 2 * w1];
const scaledPath = runGD(0.25, [-0.85, 0.85], null, scaledGrad, 35);

const W = 200, H = 180;
const PAD = 28;
const PW = W - 2 * PAD, PH = H - 2 * PAD;
// Both plots span [-1,1] x [-1,1]
const px = v => PAD + ((v + 1) / 2) * PW;
const py = v => PAD + (1 - (v + 1) / 2) * PH;

function ContourPlot({ title, data, path, color, ellipse }) {
  const pathStr = path.map((p, i) => `${i === 0 ? "M" : "L"}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ");
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6, textAlign: "center" }}>{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1.5px solid ${color}44` }}>
        {/* Contour ellipses */}
        {ellipse ? (
          [0.15, 0.3, 0.5, 0.7, 0.9].map((r, i) => (
            <ellipse key={i} cx={px(0)} cy={py(0)} rx={r * PW * 0.48} ry={r * PH * 0.06}
              fill="none" stroke={`rgba(99,102,241,${0.5 - i * 0.08})`} strokeWidth={1} />
          ))
        ) : (
          [0.15, 0.3, 0.5, 0.7, 0.9].map((r, i) => (
            <circle key={i} cx={px(0)} cy={py(0)} r={r * Math.min(PW, PH) * 0.47}
              fill="none" stroke={`rgba(99,102,241,${0.5 - i * 0.08})`} strokeWidth={1} />
          ))
        )}
        {/* Axes */}
        <line x1={PAD} y1={py(0)} x2={W - PAD} y2={py(0)} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={px(0)} y1={PAD} x2={px(0)} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        {/* Minimum */}
        <circle cx={px(0)} cy={py(0)} r={4} fill="#22d3ee" stroke="#fff" strokeWidth={1.5} />
        {/* GD path */}
        <path d={pathStr} fill="none" stroke={color} strokeWidth={2} opacity={0.9} />
        {/* Start point */}
        <circle cx={px(path[0][0])} cy={py(path[0][1])} r={5} fill="#facc15" stroke="#fff" strokeWidth={1.5} />
        <text x={px(path[0][0]) + 6} y={py(path[0][1]) - 4} fill="#facc15" fontSize={9}>start</text>
        {/* End point */}
        <circle cx={px(path[path.length-1][0])} cy={py(path[path.length-1][1])} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
        {/* Labels */}
        <text x={W - PAD + 2} y={py(0) + 4} fill="rgba(255,255,255,0.35)" fontSize={9}>w₁</text>
        <text x={px(0) + 4} y={PAD - 4} fill="rgba(255,255,255,0.35)" fontSize={9}>w₂</text>
      </svg>
      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
        Steps to converge: <strong style={{ color }}>{path.length}</strong>
      </div>
    </div>
  );
}

const METHODS = [
  { name: "Min-Max Normalisation", formula: "x′ = (x − min) / (max − min)", range: "[0, 1]", use: "Bounded inputs, neural nets, distance-based models", downside: "Sensitive to outliers" },
  { name: "Z-Score Standardisation", formula: "x′ = (x − μ) / σ", range: "mean=0, std=1", use: "Most ML algorithms, preferred for gradient descent", downside: "Doesn't bound to [0,1]" },
  { name: "None (raw features)", formula: "x′ = x", range: "Original scale", use: "Tree-based models (XGBoost, Random Forest) don't need it", downside: "Breaks gradient descent" },
];

export default function FeatureScalingViz() {
  const [activeMethod, setActiveMethod] = useState(0);
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
        <ContourPlot title="Without Scaling ✗" data={RAW_DATA} path={unscaledPath} color="#f43f5e" ellipse={true} />
        <ContourPlot title="With Scaling ✓" data={SCALED_DATA} path={scaledPath} color="#22d3ee" ellipse={false} />
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
        <strong style={{ color: "#a5b4fc" }}>What you're seeing:</strong> Without scaling, the cost landscape is a very elongated ellipse — gradient descent zigzags and takes many iterations.
        With scaled features, the landscape is circular — gradient descent goes straight to the minimum in far fewer steps.
        <br />Both plots start at the <span style={{ color: "#facc15" }}>yellow dot</span> and converge to the <span style={{ color: "#22d3ee" }}>cyan dot</span> (minimum).
      </div>

      {/* Feature data comparison */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowRaw(r => !r)}
          style={{ background: showRaw ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.07)", border: `1px solid ${showRaw ? "#f97316" : "rgba(255,255,255,0.2)"}`, color: "#fff", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, marginBottom: 10 }}>
          {showRaw ? "Showing raw features" : "Show raw vs scaled comparison"}
        </button>
        {showRaw && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.06)" }}>
                  {["sqft (raw)", "bedrooms (raw)", "sqft (scaled)", "bedrooms (scaled)"].map(h => (
                    <th key={h} style={{ padding: "7px 12px", textAlign: "left", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_DATA.map(([sqft, bed], i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <td style={{ padding: "6px 12px", color: "#f87171", fontFamily: "monospace" }}>{sqft}</td>
                    <td style={{ padding: "6px 12px", color: "#f87171", fontFamily: "monospace" }}>{bed}</td>
                    <td style={{ padding: "6px 12px", color: "#22d3ee", fontFamily: "monospace" }}>{SCALED_DATA[i][0].toFixed(3)}</td>
                    <td style={{ padding: "6px 12px", color: "#22d3ee", fontFamily: "monospace" }}>{SCALED_DATA[i][1].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Methods tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {METHODS.map((m, i) => (
          <button key={i} onClick={() => setActiveMethod(i)}
            style={{ background: activeMethod === i ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)", border: `1px solid ${activeMethod === i ? "#6366f1" : "rgba(255,255,255,0.15)"}`, color: "#fff", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: activeMethod === i ? 600 : 400 }}>
            {m.name}
          </button>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
        <div style={{ fontFamily: "monospace", color: "#a5b4fc", fontSize: 14, marginBottom: 6 }}>{METHODS[activeMethod].formula}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
          {[["Output range", METHODS[activeMethod].range], ["Best for", METHODS[activeMethod].use], ["Watch out", METHODS[activeMethod].downside]].map(([k, v]) => (
            <div key={k}><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{k}: </span><span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
