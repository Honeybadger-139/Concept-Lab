"use client";
import { useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const RAW_DATA = [
  [500,1],[800,1],[1200,2],[1500,2],[1800,3],
  [2100,3],[2400,4],[2700,4],[3000,5],[3300,5],
];

function minMaxScale(data) {
  const x0 = data.map(d => d[0]), x1 = data.map(d => d[1]);
  const mn0 = Math.min(...x0), mx0 = Math.max(...x0);
  const mn1 = Math.min(...x1), mx1 = Math.max(...x1);
  return data.map(([a, b]) => [(a - mn0) / (mx0 - mn0), (b - mn1) / (mx1 - mn1)]);
}
const SCALED_DATA = minMaxScale(RAW_DATA);

function runGD(alpha, start, gradFn, n) {
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

const unscaledPath = runGD(0.000003, [-0.8, 0.8], ([w0, w1]) => [2 * w0 * 500, 2 * w1 * 0.5], 60);
const scaledPath   = runGD(0.25,     [-0.85, 0.85], ([w0, w1]) => [2 * w0, 2 * w1], 35);

const CW = 200, CH = 180, CPAD = 28;
const CPW = CW - 2 * CPAD, CPH = CH - 2 * CPAD;
const px  = v => CPAD + ((v + 1) / 2) * CPW;
const py  = v => CPAD + (1 - (v + 1) / 2) * CPH;

const METHODS = [
  { name: "Min-Max Normalisation",   formula: "x′ = (x − min) / (max − min)", range: "[0, 1]",         use: "Bounded inputs, neural nets, distance-based models", downside: "Sensitive to outliers" },
  { name: "Z-Score Standardisation", formula: "x′ = (x − μ) / σ",             range: "mean=0, std=1",  use: "Most ML algorithms, preferred for gradient descent",  downside: "Doesn't bound to [0,1]" },
  { name: "None (raw features)",     formula: "x′ = x",                        range: "Original scale", use: "Tree-based models (XGBoost, Random Forest) don't need it", downside: "Breaks gradient descent" },
];

function ContourPlot({ title, path, color, ellipse, t }) {
  const pathStr = path.map((p, i) => `${i === 0 ? "M" : "L"}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ");
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6, textAlign: "center" }}>{title}</div>
      <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: "100%", display: "block", background: t.bg, borderRadius: 10, border: `1.5px solid ${color}44` }}>
        {ellipse
          ? [0.15, 0.3, 0.5, 0.7, 0.9].map((r, i) => (
              <ellipse key={i} cx={px(0)} cy={py(0)} rx={r * CPW * 0.48} ry={r * CPH * 0.06}
                fill="none" stroke={`rgba(217, 119, 6,${0.5 - i * 0.08})`} strokeWidth={1} />
            ))
          : [0.15, 0.3, 0.5, 0.7, 0.9].map((r, i) => (
              <circle key={i} cx={px(0)} cy={py(0)} r={r * Math.min(CPW, CPH) * 0.47}
                fill="none" stroke={`rgba(217, 119, 6,${0.5 - i * 0.08})`} strokeWidth={1} />
            ))
        }
        <line x1={CPAD} y1={py(0)} x2={CW - CPAD} y2={py(0)} stroke={t.rule} strokeWidth={1} />
        <line x1={px(0)} y1={CPAD} x2={px(0)} y2={CH - CPAD} stroke={t.rule} strokeWidth={1} />
        <circle cx={px(0)} cy={py(0)} r={4} fill="#22d3ee" stroke="#fff" strokeWidth={1.5} />
        <path d={pathStr} fill="none" stroke={color} strokeWidth={2} opacity={0.9} />
        <circle cx={px(path[0][0])} cy={py(path[0][1])} r={5} fill="#facc15" stroke="#fff" strokeWidth={1.5} />
        <text x={px(path[0][0]) + 6} y={py(path[0][1]) - 4} fill="#facc15" fontSize={9}>start</text>
        <circle cx={px(path[path.length-1][0])} cy={py(path[path.length-1][1])} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
        <text x={CW - CPAD + 2} y={py(0) + 4} fill={t.label} fontSize={9}>w₁</text>
        <text x={px(0) + 4}    y={CPAD - 4}   fill={t.label} fontSize={9}>w₂</text>
      </svg>
      <div style={{ marginTop: 6, fontSize: 11, color: t.muted, textAlign: "center" }}>
        Steps to converge: <strong style={{ color }}>{path.length}</strong>
      </div>
    </div>
  );
}

export default function FeatureScalingViz() {
  const [activeMethod, setActiveMethod] = useState(0);
  const [showRaw, setShowRaw]           = useState(false);
  const t                               = useChartTheme();

  if (!t) return <div style={{ height: 200 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
        <ContourPlot title="Without Scaling ✗" path={unscaledPath} color="#f43f5e" ellipse={true}  t={t} />
        <ContourPlot title="With Scaling ✓"    path={scaledPath}   color="#22d3ee" ellipse={false} t={t} />
      </div>

      <div style={{ background: t.surface, borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: t.muted3, lineHeight: 1.6 }}>
        <strong style={{ color: "#a5b4fc" }}>What you're seeing:</strong> Without scaling, the cost landscape is a very elongated ellipse — gradient descent zigzags and takes many iterations.
        With scaled features, the landscape is circular — gradient descent goes straight to the minimum in far fewer steps.
        <br />Both plots start at the <span style={{ color: "#facc15" }}>yellow dot</span> and converge to the <span style={{ color: "#22d3ee" }}>cyan dot</span> (minimum).
      </div>

      {/* Feature data comparison */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowRaw(r => !r)}
          style={{ background: showRaw ? "rgba(249,115,22,0.15)" : t.btnBg, border: `1px solid ${showRaw ? "#f97316" : t.btnBorder}`, color: t.btnText, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, marginBottom: 10 }}>
          {showRaw ? "Showing raw features" : "Show raw vs scaled comparison"}
        </button>
        {showRaw && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: t.surface2 }}>
                  {["sqft (raw)", "bedrooms (raw)", "sqft (scaled)", "bedrooms (scaled)"].map(h => (
                    <th key={h} style={{ padding: "7px 12px", textAlign: "left", color: t.muted2, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_DATA.map(([sqft, bed], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${t.grid}` }}>
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
            style={{ background: activeMethod === i ? "rgba(217, 119, 6,0.3)" : t.btnBg, border: `1px solid ${activeMethod === i ? "#d97706" : t.btnBorder}`, color: activeMethod === i ? "#a5b4fc" : t.btnText, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: activeMethod === i ? 600 : 400 }}>
            {m.name}
          </button>
        ))}
      </div>
      <div style={{ background: t.surface, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
        <div style={{ fontFamily: "monospace", color: "#a5b4fc", fontSize: 14, marginBottom: 6 }}>{METHODS[activeMethod].formula}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
          {[["Output range", METHODS[activeMethod].range], ["Best for", METHODS[activeMethod].use], ["Watch out", METHODS[activeMethod].downside]].map(([k, v]) => (
            <div key={k}>
              <span style={{ color: t.muted, fontSize: 11 }}>{k}: </span>
              <span style={{ color: t.muted3, fontSize: 12 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
