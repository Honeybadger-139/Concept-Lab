"use client";
import { useState, useMemo } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const DATA = [[1,150],[1.5,200],[2,210],[2.5,280],[3,320],[3.5,350],[4,430],[4.5,460],[5,490]];

const SVG_W = 430, SVG_H = 260;
const PAD   = { l: 52, r: 20, t: 16, b: 46 };
const PW    = SVG_W - PAD.l - PAD.r;
const PH    = SVG_H - PAD.t - PAD.b;
const X_MIN = 0, X_MAX = 5.5, Y_MIN = 0, Y_MAX = 600;
const sx    = x => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
const sy    = y => PAD.t + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * PH;

function mse(w, b) {
  return DATA.reduce((sum, [x, y]) => sum + (w * x + b - y) ** 2, 0) / (2 * DATA.length);
}

export default function CostFunctionViz() {
  const [w, setW]                     = useState(80);
  const [b, setB]                     = useState(30);
  const [showResiduals, setShowResiduals] = useState(true);
  const t                             = useChartTheme();

  const J    = useMemo(() => mse(w, b), [w, b]);
  const optW = 95.3, optB = 5.8;
  const optJ = useMemo(() => mse(optW, optB), []);

  const costCurveW = useMemo(() => {
    const pts = [];
    for (let wi = -40; wi <= 200; wi += 4) {
      const j  = mse(wi, optB);
      const px = 20 + ((wi - (-40)) / 240) * 180;
      const py = 10 + (1 - Math.min(j / 12000, 1)) * 80;
      pts.push(`${wi === -40 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const wDotX = useMemo(() => 20 + ((w - (-40)) / 240) * 180, [w]);
  const wDotY = useMemo(() => 10 + (1 - Math.min(mse(w, optB) / 12000, 1)) * 80, [w]);

  if (!t) return <div style={{ height: 260 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: "100%", maxWidth: SVG_W, display: "block", background: t.bg, borderRadius: 10, border: `1px solid ${t.border}` }}>
        {[0, 100, 200, 300, 400, 500].map(y => (
          <g key={y}>
            <line x1={PAD.l} y1={sy(y)} x2={SVG_W - PAD.r} y2={sy(y)} stroke={t.grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" fill={t.label} fontSize={10}>${y}k</text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map(x => (
          <g key={x}>
            <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={SVG_H - PAD.b} stroke={t.grid} strokeWidth={1} />
            <text x={sx(x)} y={SVG_H - PAD.b + 15} textAnchor="middle" fill={t.label} fontSize={10}>{x}k</text>
          </g>
        ))}
        <text x={PAD.l - 42} y={SVG_H / 2} textAnchor="middle" fill={t.labelMid} fontSize={11}
          transform={`rotate(-90,${PAD.l - 42},${SVG_H / 2})`}>Price ($k)</text>
        <text x={SVG_W / 2} y={SVG_H - 6} textAnchor="middle" fill={t.labelMid} fontSize={11}>Size (1000 sqft)</text>
        <line x1={sx(X_MIN)} y1={sy(Math.max(Y_MIN, optW * X_MIN + optB))} x2={sx(X_MAX)} y2={sy(Math.min(Y_MAX, optW * X_MAX + optB))}
          stroke="rgba(34,211,238,0.25)" strokeWidth={1.5} strokeDasharray="6,4" />
        <text x={sx(4.6)} y={sy(optW * 4.6 + optB) - 8} fill="rgba(34,211,238,0.5)" fontSize={10}>best fit</text>
        <line x1={sx(X_MIN)} y1={sy(Math.max(-50, w * X_MIN + b))} x2={sx(X_MAX)} y2={sy(Math.min(700, w * X_MAX + b))}
          stroke="#d97706" strokeWidth={2.5} />
        {showResiduals && DATA.map(([x, y], i) => {
          const yHat = w * x + b;
          return <line key={i} x1={sx(x)} y1={sy(y)} x2={sx(x)} y2={sy(yHat)}
            stroke={Math.abs(yHat - y) > 50 ? "#f43f5e" : "#facc15"} strokeWidth={1.5} strokeDasharray="3,2" opacity={0.75} />;
        })}
        {DATA.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={5} fill="#f97316" stroke="#fff" strokeWidth={1.5} />
        ))}
        <text x={PAD.l + 8} y={PAD.t + 18} fill="#a5b4fc" fontSize={12} fontFamily="monospace">
          ŷ = {w}·x + {b}
        </text>
      </svg>

      {/* Mini cost curve + MSE panel */}
      <div style={{ display: "flex", gap: 14, marginTop: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, background: t.surface, borderRadius: 10, padding: "10px 14px", border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 11, color: t.muted, marginBottom: 6 }}>J(w) cost curve — varying w</div>
          <svg viewBox="0 0 220 100" style={{ width: "100%", display: "block" }}>
            <path d={costCurveW} fill="none" stroke="#d97706" strokeWidth={2} />
            <circle cx={wDotX} cy={wDotY} r={5} fill="#facc15" stroke="#fff" strokeWidth={1.5} />
            <line x1={wDotX} y1={10} x2={wDotX} y2={90} stroke="rgba(250,204,21,0.3)" strokeWidth={1} strokeDasharray="3,3" />
          </svg>
          <div style={{ fontSize: 11, color: t.tick, textAlign: "center" }}>← Move w slider to see dot move</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: "rgba(217, 119, 6,0.1)", border: "1px solid rgba(217, 119, 6,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>Mean Squared Error</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: J < optJ * 1.5 ? "#22d3ee" : "#facc15", fontFamily: "monospace" }}>
              {J.toFixed(0)}
            </div>
            <div style={{ fontSize: 11, color: t.tick }}>J(w,b) = (1/2m) Σ(ŷᵢ−yᵢ)²</div>
          </div>
          <div style={{ fontSize: 12, color: t.muted, marginBottom: 4 }}>Optimal (min) J = {optJ.toFixed(0)}</div>
          <div style={{ height: 6, background: t.surface3, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (optJ / J) * 100)}%`, background: J < optJ * 1.5 ? "#22d3ee" : "#d97706", borderRadius: 4, transition: "width .2s" }} />
          </div>
          <div style={{ fontSize: 11, color: t.tick, marginTop: 3 }}>
            {J < optJ * 1.1 ? "✓ Near optimal!" : `${((J / optJ - 1) * 100).toFixed(0)}% above optimal`}
          </div>
        </div>
      </div>

      {/* Sliders */}
      {[{ label: "Slope w (weight)", val: w, set: setW, min: -40, max: 200, color: "#d97706" },
        { label: "Intercept b (bias)", val: b, set: setB, min: -50, max: 200, color: "#f97316" }].map(({ label, val, set, min, max, color }) => (
        <div key={label} style={{ marginTop: 10 }}>
          <label style={{ fontSize: 13, color: t.muted3, display: "flex", justifyContent: "space-between" }}>
            <span>{label}</span><span style={{ color, fontFamily: "monospace", fontWeight: 700 }}>{val}</span>
          </label>
          <input type="range" min={min} max={max} step={1} value={val} onChange={e => set(+e.target.value)}
            style={{ width: "100%", accentColor: color, marginTop: 3 }} />
        </div>
      ))}

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setShowResiduals(r => !r)}
          style={{ background: showResiduals ? "rgba(250,204,21,0.15)" : t.btnBg, border: `1px solid ${showResiduals ? "#facc15" : t.btnBorder}`, color: t.btnText, borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13 }}>
          {showResiduals ? "Hide" : "Show"} residuals
        </button>
        <button onClick={() => { setW(Math.round(optW)); setB(Math.round(optB)); }}
          style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.35)", color: "#22d3ee", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          ✓ Auto-fit (best w,b)
        </button>
      </div>
    </div>
  );
}
