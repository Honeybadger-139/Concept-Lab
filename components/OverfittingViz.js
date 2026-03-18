"use client";
import { useState, useMemo } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function polyFit(xs, ys, degree) {
  const n = xs.length, d = degree + 1;
  const A = xs.map(x => Array.from({ length: d }, (_, j) => Math.pow(x, j)));
  const ATA = [];
  for (let i = 0; i < d; i++) {
    ATA.push([]);
    for (let j = 0; j < d; j++) ATA[i].push(A.reduce((s, row) => s + row[i] * row[j], 0));
  }
  const ATy = Array.from({ length: d }, (_, i) => A.reduce((s, row, k) => s + row[i] * ys[k], 0));
  const M = ATA.map((row, i) => [...row, ATy[i]]);
  for (let col = 0; col < d; col++) {
    let maxRow = col;
    for (let r = col + 1; r < d; r++) if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) maxRow = r;
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    if (Math.abs(M[col][col]) < 1e-10) continue;
    for (let r = 0; r < d; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= d; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => row[d] / row[i]);
}

function polyEval(coef, x) {
  return coef.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
}

const SEED_DATA = [[0.5,1.8],[1.0,2.4],[1.5,2.9],[2.0,4.1],[2.5,4.8],[3.0,6.2],[3.5,7.0],[4.0,7.9],[4.5,9.5],[5.0,10.1]];
const DATA = SEED_DATA.map(([x, y]) => [x, y + (Math.sin(x * 37) * 1.4)]);

const X_MIN = 0, X_MAX = 5.5, Y_MIN = -2, Y_MAX = 16;
const W = 440, H = 250;
const PAD = { l: 40, r: 20, t: 16, b: 40 };
const PW  = W - PAD.l - PAD.r;
const PH  = H - PAD.t - PAD.b;
const sx  = x => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
const sy  = y => PAD.t + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * PH;

const LABELS = {
  1: { text: "Underfitting",        sub: "Too simple — misses the pattern",  color: "#f97316" },
  2: { text: "Underfitting",        sub: "Still too simple",                  color: "#f97316" },
  3: { text: "Just Right ✓",       sub: "Captures the trend",               color: "#22d3ee" },
  4: { text: "Good Fit",            sub: "Slight over-complexity",           color: "#22d3ee" },
  5: { text: "Starting to Overfit", sub: "Wiggles through noise",            color: "#facc15" },
  6: { text: "Overfitting",         sub: "Variance increasing",               color: "#f43f5e" },
  7: { text: "Overfitting",         sub: "Memorises training noise",         color: "#f43f5e" },
  8: { text: "Severe Overfit",      sub: "Highly unstable outside train set", color: "#f43f5e" },
  9: { text: "Severe Overfit",      sub: "Useless on new data",              color: "#f43f5e" },
};

export default function OverfittingViz() {
  const [degree, setDegree] = useState(1);
  const t                   = useChartTheme();

  const xs   = DATA.map(d => d[0]);
  const ys   = DATA.map(d => d[1]);
  const coef = useMemo(() => { try { return polyFit(xs, ys, Math.min(degree, DATA.length - 1)); } catch { return [0]; } }, [degree]);

  const trainMSE = useMemo(() => DATA.reduce((s, [x, y]) => s + (polyEval(coef, x) - y) ** 2, 0) / DATA.length, [coef]);
  const testMSE  = useMemo(() => { const base = 0.8; return degree <= 3 ? base + (3 - degree) * 1.5 : base + (degree - 3) * 2.2; }, [degree]);

  const fitPath = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const x = X_MIN + (i / 120) * (X_MAX - X_MIN);
      const y = polyEval(coef, x);
      if (y < Y_MIN - 5 || y > Y_MAX + 5) { pts.push("M"); continue; }
      pts.push(`${pts.length === 0 || pts[pts.length - 1] === "M" ? "M" : "L"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return pts.filter(p => p !== "M").join(" ");
  }, [coef]);

  const label    = LABELS[degree] || LABELS[Math.min(9, Math.max(1, degree))] || LABELS[3];
  const fitColor = label.color;

  if (!t) return <div style={{ height: 250 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Status banner */}
      <div style={{ background: `${fitColor}18`, border: `1.5px solid ${fitColor}55`, borderRadius: 10, padding: "10px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 800, color: fitColor }}>{label.text}</span>
          <span style={{ fontSize: 13, color: t.muted2, marginLeft: 10 }}>{label.sub}</span>
        </div>
        <span style={{ fontSize: 12, fontFamily: "monospace", background: t.surface3, borderRadius: 6, padding: "4px 10px", color: t.muted3 }}>
          degree = {degree}
        </span>
      </div>

      {/* Plot */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block", background: t.bg, borderRadius: 10, border: `1px solid ${t.border}` }}>
        {[0, 4, 8, 12].map(y => (
          <g key={y}>
            <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} stroke={t.grid} strokeWidth={1} />
            <text x={PAD.l - 5} y={sy(y) + 4} textAnchor="end" fill={t.tick} fontSize={9}>{y}</text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map(x => (
          <g key={x}>
            <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={H - PAD.b} stroke={t.grid} strokeWidth={1} />
            <text x={sx(x)} y={H - PAD.b + 14} textAnchor="middle" fill={t.tick} fontSize={9}>{x}</text>
          </g>
        ))}
        {/* True pattern */}
        <path d={(() => {
          const p = [];
          for (let i = 0; i <= 80; i++) {
            const x = X_MIN + (i / 80) * X_MAX;
            p.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(2 * x).toFixed(1)}`);
          }
          return p.join(" ");
        })()} fill="none" stroke={t.rule} strokeWidth={1.5} strokeDasharray="5,4" />
        <text x={sx(3.8)} y={sy(2 * 3.8) - 8} fill={t.tick} fontSize={10}>true pattern</text>
        {/* Polynomial fit */}
        <path d={fitPath} fill="none" stroke={fitColor} strokeWidth={2.5} />
        {/* Data points */}
        {DATA.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={5.5} fill="#d97706" stroke="#fff" strokeWidth={1.5} />
        ))}
      </svg>

      {/* Degree slider */}
      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 13, color: t.muted3, display: "flex", justifyContent: "space-between" }}>
          <span>Polynomial degree (model complexity)</span>
          <span style={{ fontFamily: "monospace", color: fitColor, fontWeight: 700 }}>d = {degree}</span>
        </label>
        <input type="range" min={1} max={9} step={1} value={degree} onChange={e => setDegree(+e.target.value)}
          style={{ width: "100%", accentColor: fitColor, marginTop: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 2 }}>
          <span style={{ color: "#f97316" }}>← Underfitting</span>
          <span style={{ color: "#22d3ee" }}>Sweet spot (d=3)</span>
          <span style={{ color: "#f43f5e" }}>Overfitting →</span>
        </div>
      </div>

      {/* Error bars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        {[
          { label: "Train MSE",            value: trainMSE, maxVal: 6,  color: "#d97706", note: "Lower → fits training data better" },
          { label: "Test MSE (simulated)", value: testMSE,  maxVal: 12, color: "#f97316", note: "Lower → generalises to new data" },
        ].map(({ label, value, maxVal, color, note }) => (
          <div key={label} style={{ background: t.surface2, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: t.muted, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "monospace", marginBottom: 6 }}>{value.toFixed(2)}</div>
            <div style={{ height: 5, background: t.surface3, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (value / maxVal) * 100)}%`, background: color, borderRadius: 4, transition: "width .25s" }} />
            </div>
            <div style={{ fontSize: 11, color: t.tick, marginTop: 5 }}>{note}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, background: "rgba(217, 119, 6,0.08)", border: "1px solid rgba(217, 119, 6,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: t.muted3 }}>
        <strong style={{ color: "#a5b4fc" }}>Interview key:</strong> Drag to degree 7–9 and watch the line wiggle through every point (train MSE → 0, test MSE spikes).
        That's overfitting. The fix: regularisation (L1/L2) penalises large coefficients, effectively reducing effective complexity.
      </div>
    </div>
  );
}
