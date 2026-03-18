"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const W = 460, H = 280;
const PAD = { l: 54, r: 20, t: 20, b: 48 };
const PW  = W - PAD.l - PAD.r;
const PH  = H - PAD.t - PAD.b;
const W_MIN = -2, W_MAX = 6, J_MIN = 0, J_MAX = 18;

const wx   = (w) => PAD.l + ((w - W_MIN) / (W_MAX - W_MIN)) * PW;
const jy   = (j) => PAD.t + (1 - Math.min((j - J_MIN) / (J_MAX - J_MIN), 1)) * PH;
const cost = (w) => (w - 2) ** 2 + 1;
const grad  = (w) => 2 * (w - 2);

function buildCurve() {
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const w = W_MIN + (i / 80) * (W_MAX - W_MIN);
    pts.push(`${i === 0 ? "M" : "L"}${wx(w).toFixed(1)},${jy(cost(w)).toFixed(1)}`);
  }
  return pts.join(" ");
}
const CURVE = buildCurve();

const PRESETS = [
  { label: "Too slow",   alpha: 0.02, color: "#f97316" },
  { label: "Just right", alpha: 0.3,  color: "#22d3ee" },
  { label: "Too high",   alpha: 0.95, color: "#f43f5e" },
];

export default function GradientDescentViz() {
  const [alpha, setAlpha]     = useState(0.3);
  const [wVal, setWVal]       = useState(-1.5);
  const [history, setHistory] = useState([{ w: -1.5, j: cost(-1.5) }]);
  const [running, setRunning] = useState(false);
  const [iter, setIter]       = useState(0);
  const rafRef                = useRef(null);
  const stateRef              = useRef({ w: -1.5, alpha: 0.3, history: [{ w: -1.5, j: cost(-1.5) }], iter: 0 });
  const t                     = useChartTheme();

  const step = useCallback(() => {
    const s   = stateRef.current;
    const g   = grad(s.w);
    const newW = s.w - s.alpha * g;
    const newJ = cost(newW);
    const newH = [...s.history, { w: newW, j: newJ }].slice(-60);
    s.w = newW; s.history = newH; s.iter += 1;
    setWVal(newW); setHistory([...newH]); setIter(s.iter);
    if (Math.abs(g) < 0.001 || s.iter >= 200) { setRunning(false); return; }
    rafRef.current = setTimeout(() => { rafRef.current = requestAnimationFrame(step); }, 80);
  }, []);

  useEffect(() => { stateRef.current.alpha = alpha; }, [alpha]);

  useEffect(() => {
    if (running) { rafRef.current = requestAnimationFrame(step); }
    else { cancelAnimationFrame(rafRef.current); clearTimeout(rafRef.current); }
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(rafRef.current); };
  }, [running, step]);

  const reset = (startW = -1.5) => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current); clearTimeout(rafRef.current);
    stateRef.current = { w: startW, alpha, history: [{ w: startW, j: cost(startW) }], iter: 0 };
    setWVal(startW); setHistory([{ w: startW, j: cost(startW) }]); setIter(0);
  };

  const j         = cost(wVal);
  const g         = grad(wVal);
  const converged = Math.abs(g) < 0.05;
  const pathStr   = history.length > 1
    ? history.map((p, i) => `${i === 0 ? "M" : "L"}${wx(p.w).toFixed(1)},${jy(p.j).toFixed(1)}`).join(" ")
    : null;

  if (!t) return <div style={{ height: 280 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {PRESETS.map((p) => (
          <button key={p.label}
            onClick={() => { setAlpha(p.alpha); stateRef.current.alpha = p.alpha; reset(-1.5); }}
            style={{ background: alpha === p.alpha ? p.color : t.btnBg, color: alpha === p.alpha ? "#fff" : t.btnText, border: `1.5px solid ${p.color}`, borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "background .2s" }}>
            {p.label} (α={p.alpha})
          </button>
        ))}
      </div>

      {/* SVG plot */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block", background: t.bg, borderRadius: 10, border: `1px solid ${t.border}` }}>
        {[0, 4, 8, 12, 16].map(jv => (
          <g key={jv}>
            <line x1={PAD.l} y1={jy(jv)} x2={W - PAD.r} y2={jy(jv)} stroke={t.grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={jy(jv) + 4} textAnchor="end" fill={t.label} fontSize={10}>{jv}</text>
          </g>
        ))}
        {[-2, 0, 2, 4, 6].map(wv => (
          <g key={wv}>
            <line x1={wx(wv)} y1={PAD.t} x2={wx(wv)} y2={H - PAD.b} stroke={t.grid} strokeWidth={1} />
            <text x={wx(wv)} y={H - PAD.b + 16} textAnchor="middle" fill={t.label} fontSize={10}>{wv}</text>
          </g>
        ))}
        <text x={PAD.l - 38} y={H / 2} textAnchor="middle" fill={t.labelMid} fontSize={11}
          transform={`rotate(-90,${PAD.l - 38},${H / 2})`}>J(w) — Cost</text>
        <text x={W / 2} y={H - 6} textAnchor="middle" fill={t.labelMid} fontSize={11}>w — Parameter</text>
        <line x1={wx(2)} y1={PAD.t} x2={wx(2)} y2={H - PAD.b} stroke="rgba(34,211,238,0.25)" strokeWidth={1} strokeDasharray="4,4" />
        <text x={wx(2) + 4} y={PAD.t + 14} fill="rgba(34,211,238,0.6)" fontSize={10}>optimum w=2</text>
        <path d={CURVE} fill="none" stroke="#d97706" strokeWidth={2.5} />
        {pathStr && <path d={pathStr} fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth={1.5} strokeDasharray="3,3" />}
        {!converged && (() => {
          const x0 = wx(wVal - 0.8), x1 = wx(wVal + 0.8);
          const y0 = jy(j - 0.8 * g), y1 = jy(j + 0.8 * g);
          return <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#f97316" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />;
        })()}
        <circle cx={wx(wVal)} cy={jy(j)} r={8} fill={converged ? "#22d3ee" : "#facc15"} stroke="#fff" strokeWidth={2}>
          {running && <animate attributeName="r" values="8;10;8" dur="0.8s" repeatCount="indefinite" />}
        </circle>
        {converged && (
          <circle cx={wx(wVal)} cy={jy(j)} r={16} fill="none" stroke="#22d3ee" strokeWidth={1.5} opacity={0.5}>
            <animate attributeName="r" values="12;22;12" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "12px 0" }}>
        {[
          { label: "Iteration", value: iter },
          { label: "w",         value: wVal.toFixed(4) },
          { label: "J(w)",      value: j.toFixed(4) },
          { label: "Gradient",  value: g.toFixed(4) },
        ].map(s => (
          <div key={s.label} style={{ background: t.surface2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: t.muted, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: converged ? "#22d3ee" : "#facc15", fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Alpha slider */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: t.muted3, display: "flex", justifyContent: "space-between" }}>
          <span>Learning rate α</span>
          <span style={{ color: "#facc15", fontFamily: "monospace", fontWeight: 700 }}>{alpha}</span>
        </label>
        <input type="range" min={0.01} max={1.0} step={0.01} value={alpha}
          onChange={e => { const v = parseFloat(e.target.value); setAlpha(v); stateRef.current.alpha = v; }}
          style={{ width: "100%", accentColor: "#d97706", marginTop: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.tick, marginTop: 2 }}>
          <span>0.01 — too slow</span><span>0.5 — good</span><span>1.0 — may diverge</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setRunning(r => !r)}
          style={{ flex: 1, background: running ? "rgba(244,63,94,0.2)" : "rgba(217, 119, 6,0.25)", color: t.btnText, border: `1.5px solid ${running ? "#f43f5e" : "#d97706"}`, borderRadius: 8, padding: "9px 0", cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all .2s" }}>
          {running ? "⏸ Pause" : converged ? "✓ Converged" : "▶ Run"}
        </button>
        <button onClick={() => reset(-1.5)}
          style={{ background: t.btnBg, color: t.btnText, border: `1.5px solid ${t.btnBorder}`, borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 14 }}>
          ↺ Reset
        </button>
        <button onClick={() => {
          if (!running) {
            stateRef.current.alpha = alpha;
            const g2 = grad(stateRef.current.w);
            const nw = stateRef.current.w - alpha * g2;
            stateRef.current.w = nw; stateRef.current.iter += 1;
            stateRef.current.history = [...stateRef.current.history, { w: nw, j: cost(nw) }].slice(-60);
            setWVal(nw); setHistory([...stateRef.current.history]); setIter(stateRef.current.iter);
          }
        }}
          style={{ background: t.btnBg, color: t.btnText, border: `1.5px solid ${t.btnBorder}`, borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 14 }}>
          +1 Step
        </button>
      </div>

      {converged && (
        <div style={{ marginTop: 12, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#22d3ee" }}>
          ✓ Converged at w ≈ {wVal.toFixed(3)} (optimal w = 2.0) in {iter} iterations. Gradient ≈ 0.
        </div>
      )}
      {alpha >= 0.9 && iter > 5 && !converged && (
        <div style={{ marginTop: 12, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
          ⚠ Learning rate too high — the update step overshoots the minimum and may diverge.
        </div>
      )}
    </div>
  );
}
