"use client";
import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const W = 460;
const H = 280;
const PAD = { l: 46, r: 16, t: 16, b: 42 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;
const X_MIN = 0;
const X_MAX = 10;
const Y_MIN = 0;
const Y_MAX = 220;

const sx = (x) => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
const sy = (y) => PAD.t + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * PH;

const DATA = [
  [0.5, 34], [1.2, 42], [2.0, 66], [2.8, 82], [3.7, 98], [4.3, 103],
  [5.1, 112], [5.9, 128], [6.5, 145], [7.1, 154], [8.0, 176], [8.9, 191], [9.6, 204],
];

const MODELS = {
  1: {
    label: "Degree 1 (Underfit)",
    color: "#f97316",
    profile: "High bias, low variance",
    coeffs: [30, 17], // y = 30 + 17x
  },
  2: {
    label: "Degree 2 (Better)",
    color: "#22c55e",
    profile: "Balanced for many tabular tasks",
    coeffs: [26, 20, -0.35], // y = 26 + 20x - 0.35x^2
  },
  3: {
    label: "Degree 3 (Good Fit)",
    color: "#22d3ee",
    profile: "Captures curvature with control",
    coeffs: [24, 17, 0.2, -0.01], // y = 24 + 17x + 0.2x^2 - 0.01x^3
  },
  6: {
    label: "Degree 6 (Overfit)",
    color: "#f43f5e",
    profile: "Low bias, high variance",
    coeffs: [15, 37, -12, 2.4, -0.22, 0.009, -0.00013],
  },
};

function evalPoly(coeffs, x) {
  return coeffs.reduce((acc, c, i) => acc + c * (x ** i), 0);
}

function buildCurve(coeffs) {
  const pts = [];
  for (let i = 0; i <= 140; i++) {
    const x = X_MIN + (i / 140) * (X_MAX - X_MIN);
    const y = Math.max(Y_MIN, Math.min(Y_MAX, evalPoly(coeffs, x)));
    pts.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function PolynomialRegressionViz() {
  const [degree, setDegree] = useState(3);
  const [showGuide, setShowGuide] = useState(true);
  const t = useChartTheme();

  const model = MODELS[degree];
  const curve = useMemo(() => buildCurve(model.coeffs), [model.coeffs]);
  const mse = useMemo(() => {
    const err = DATA.reduce((sum, [x, y]) => {
      const yHat = evalPoly(model.coeffs, x);
      return sum + (yHat - y) ** 2;
    }, 0);
    return err / DATA.length;
  }, [model.coeffs]);

  if (!t) return <div style={{ height: 280 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {Object.keys(MODELS).map((d) => {
          const k = Number(d);
          const m = MODELS[k];
          return (
            <button
              key={d}
              onClick={() => setDegree(k)}
              style={{
                background: degree === k ? m.color : t.btnBg,
                color: degree === k ? "#fff" : t.btnText,
                border: `1.5px solid ${m.color}`,
                borderRadius: 7,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block", background: t.bg, borderRadius: 10, border: `1px solid ${t.border}` }}>
        {[0, 50, 100, 150, 200].map((y) => (
          <g key={y}>
            <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} stroke={t.grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" fill={t.label} fontSize={10}>{y}</text>
          </g>
        ))}
        {[0, 2, 4, 6, 8, 10].map((x) => (
          <g key={x}>
            <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={H - PAD.b} stroke={t.grid} strokeWidth={1} />
            <text x={sx(x)} y={H - PAD.b + 14} textAnchor="middle" fill={t.label} fontSize={10}>{x}</text>
          </g>
        ))}
        <text x={PAD.l - 34} y={H / 2} textAnchor="middle" fill={t.labelMid} fontSize={11}
          transform={`rotate(-90,${PAD.l - 34},${H / 2})`}>target y</text>
        <text x={W / 2} y={H - 6} textAnchor="middle" fill={t.labelMid} fontSize={11}>feature x</text>

        {showGuide && (
          <path d={buildCurve(MODELS[3].coeffs)} fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth={2} strokeDasharray="5,4" />
        )}
        <path d={curve} fill="none" stroke={model.color} strokeWidth={2.8} />
        {DATA.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={4.6} fill="#facc15" stroke="#fff" strokeWidth={1.5} />
        ))}
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
        <div style={{ background: t.surface2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.muted }}>Model profile</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: model.color }}>{model.profile}</div>
        </div>
        <div style={{ background: t.surface2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.muted }}>Train MSE (demo)</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: model.color, fontFamily: "monospace" }}>{mse.toFixed(1)}</div>
        </div>
        <div style={{ background: t.surface2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.muted }}>Validation risk</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: degree >= 6 ? "#f43f5e" : degree <= 1 ? "#f97316" : "#22d3ee" }}>
            {degree >= 6 ? "High overfit risk" : degree <= 1 ? "High underfit risk" : "Balanced"}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          onClick={() => setShowGuide((v) => !v)}
          style={{
            background: showGuide ? "rgba(34,211,238,0.12)" : t.btnBg,
            border: `1px solid ${showGuide ? "rgba(34,211,238,0.4)" : t.btnBorder}`,
            color: t.btnText,
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {showGuide ? "Hide" : "Show"} degree-3 guide
        </button>
      </div>

      <div style={{ marginTop: 10, background: "rgba(217, 119, 6,0.08)", border: "1px solid rgba(217, 119, 6,0.25)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: t.muted3 }}>
        <strong style={{ color: "#a5b4fc" }}>Interpretation:</strong> increase degree only when validation error improves.
        Higher degree usually lowers training error, but can hurt generalisation. Pair polynomial terms with scaling and regularisation.
      </div>
    </div>
  );
}
