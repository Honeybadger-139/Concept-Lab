"use client";
import { useState, useMemo } from "react";

const W = 440, H = 240;
const PAD = { l: 48, r: 20, t: 20, b: 42 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;
const Z_MIN = -6, Z_MAX = 6;
const sz = z => PAD.l + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * PW;
const sp = p => PAD.t + (1 - p) * PH;
const sigmoid = z => 1 / (1 + Math.exp(-z));

function sigmoidPath() {
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const z = Z_MIN + (i / 100) * (Z_MAX - Z_MIN);
    const p = sigmoid(z);
    pts.push(`${i === 0 ? "M" : "L"}${sz(z).toFixed(1)},${sp(p).toFixed(1)}`);
  }
  return pts.join(" ");
}
const CURVE = sigmoidPath();

// Synthetic tumour data: [z = w·x + b, label]
const TUMOUR_DATA = [
  [-4.8, 0], [-3.9, 0], [-3.1, 0], [-2.4, 0], [-1.8, 0], [-1.0, 0], [-0.3, 0],
  [0.5, 1], [0.9, 0], [1.4, 1], [2.1, 1], [2.8, 1], [3.5, 1], [4.2, 1], [5.1, 1],
];

export default function LogisticSigmoidViz() {
  const [zInput, setZInput] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const [showData, setShowData] = useState(true);

  const prob = useMemo(() => sigmoid(zInput), [zInput]);
  const predicted = prob >= threshold ? 1 : 0;
  const threshZ = useMemo(() => Math.log(threshold / (1 - threshold)), [threshold]);

  const gradientId = "sigmoidGrad";

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Main SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.15} />
          </linearGradient>
        </defs>
        {/* Regions */}
        <rect x={PAD.l} y={sp(threshold)} width={PW} height={PH - (PH - sp(threshold))} fill="rgba(34,211,238,0.06)" />
        <rect x={PAD.l} y={PAD.t} width={PW} height={sp(threshold) - PAD.t} fill="rgba(244,63,94,0.06)" />
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <g key={p}>
            <line x1={PAD.l} y1={sp(p)} x2={W - PAD.r} y2={sp(p)} stroke={p === 0.5 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"} strokeWidth={1} />
            <text x={PAD.l - 6} y={sp(p) + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize={10}>{p}</text>
          </g>
        ))}
        {[-6, -4, -2, 0, 2, 4, 6].map(z => (
          <g key={z}>
            <line x1={sz(z)} y1={PAD.t} x2={sz(z)} y2={H - PAD.b} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={sz(z)} y={H - PAD.b + 14} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>{z}</text>
          </g>
        ))}
        <text x={PAD.l - 38} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11} transform={`rotate(-90,${PAD.l - 38},${H / 2})`}>P(y=1 | x)</text>
        <text x={W / 2} y={H - 5} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11}>z = w·x + b</text>
        {/* Sigmoid curve */}
        <path d={CURVE} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        {/* Class 0 / 1 region labels */}
        <text x={W - PAD.r - 4} y={sp(threshold) + 14} textAnchor="end" fill="rgba(34,211,238,0.7)" fontSize={11}>Class 1 ✓</text>
        <text x={W - PAD.r - 4} y={sp(threshold) - 6} textAnchor="end" fill="rgba(244,63,94,0.7)" fontSize={11}>Class 0 ✗</text>
        {/* Threshold line */}
        <line x1={PAD.l} y1={sp(threshold)} x2={W - PAD.r} y2={sp(threshold)}
          stroke="#facc15" strokeWidth={1.5} strokeDasharray="6,3" />
        <text x={PAD.l + 4} y={sp(threshold) - 5} fill="#facc15" fontSize={11}>threshold = {threshold}</text>
        {/* Decision boundary on z-axis */}
        <line x1={sz(threshZ)} y1={PAD.t} x2={sz(threshZ)} y2={H - PAD.b}
          stroke="rgba(250,204,21,0.4)" strokeWidth={1} strokeDasharray="4,4" />
        {/* Data points */}
        {showData && TUMOUR_DATA.map(([z, label], i) => (
          <circle key={i} cx={sz(z)} cy={sp(label === 1 ? 0.88 : 0.12)} r={5}
            fill={label === 1 ? "#22d3ee" : "#f43f5e"} stroke="#fff" strokeWidth={1.5} opacity={0.85} />
        ))}
        {/* Input z dot */}
        <circle cx={sz(zInput)} cy={sp(prob)} r={9} fill={predicted ? "#22d3ee" : "#f43f5e"} stroke="#fff" strokeWidth={2} />
        <line x1={sz(zInput)} y1={sp(prob)} x2={sz(zInput)} y2={H - PAD.b} stroke={predicted ? "#22d3ee" : "#f43f5e"} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
        <line x1={PAD.l} y1={sp(prob)} x2={sz(zInput)} y2={sp(prob)} stroke={predicted ? "#22d3ee" : "#f43f5e"} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
      </svg>

      {/* Live output card */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
        {[
          { label: "Input z", value: zInput.toFixed(2), color: "#a5b4fc" },
          { label: "σ(z) — Probability", value: prob.toFixed(4), color: prob >= threshold ? "#22d3ee" : "#f87171" },
          { label: "Prediction", value: predicted === 1 ? "Class 1 ✓" : "Class 0 ✗", color: predicted ? "#22d3ee" : "#f43f5e" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "flex", justifyContent: "space-between" }}>
          <span>Input z (= w·x + b)</span>
          <span style={{ fontFamily: "monospace", color: "#a5b4fc", fontWeight: 700 }}>{zInput.toFixed(1)}</span>
        </label>
        <input type="range" min={-6} max={6} step={0.1} value={zInput} onChange={e => setZInput(+e.target.value)}
          style={{ width: "100%", accentColor: "#6366f1", marginTop: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          <span>-6 → P≈0</span><span>0 → P=0.5</span><span>+6 → P≈1</span>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "flex", justifyContent: "space-between" }}>
          <span>Decision threshold</span>
          <span style={{ fontFamily: "monospace", color: "#facc15", fontWeight: 700 }}>{threshold}</span>
        </label>
        <input type="range" min={0.1} max={0.9} step={0.05} value={threshold} onChange={e => setThreshold(+e.target.value)}
          style={{ width: "100%", accentColor: "#facc15", marginTop: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          <span>0.1 — permissive</span><span>0.5 — default</span><span>0.9 — strict</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setShowData(d => !d)}
          style={{ background: showData ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.07)", border: `1px solid ${showData ? "#f97316" : "rgba(255,255,255,0.2)"}`, color: "#fff", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
          {showData ? "Hide" : "Show"} sample data
        </button>
        <button onClick={() => setZInput(0)}
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
          Reset z = 0
        </button>
      </div>

      <div style={{ marginTop: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
        <strong style={{ color: "#a5b4fc" }}>Key insight:</strong> The sigmoid maps any real number z to a probability (0–1).
        z = w·x + b is a linear combination of features. The threshold (default 0.5) converts probability → class label.
        Change the threshold to adjust sensitivity — lower threshold = more Class 1 predictions (recall ↑, precision ↓).
      </div>
    </div>
  );
}
