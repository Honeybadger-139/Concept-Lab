"use client";
import { useState, useEffect, useRef } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const CONFIGS = [
  { label: "Too Slow",      alpha: 0.02,  color: "#f97316", desc: "α = 0.02 — tiny steps, hundreds of iterations needed" },
  { label: "Just Right ✓", alpha: 0.35,  color: "#22d3ee", desc: "α = 0.35 — reaches minimum in ~20 steps" },
  { label: "Diverges ✗",   alpha: 1.05,  color: "#f43f5e", desc: "α = 1.05 — overshoots, bounces, grows" },
];

const MAX_ITER = 40;
const W_START  = -1.5;
const cost = w => (w - 2) ** 2 + 1;
const grad  = w => 2 * (w - 2);

function runPath(alpha, n) {
  const path = [{ w: W_START, j: cost(W_START) }];
  let w = W_START;
  for (let i = 0; i < n; i++) {
    w = w - alpha * grad(w);
    path.push({ w, j: cost(w) });
  }
  return path;
}

function detectTrend(path, iter) {
  const upto = path.slice(0, Math.min(iter, path.length - 1) + 1);
  if (upto.length < 4) return "Warming up";
  const first = upto[0].j;
  const last = upto[upto.length - 1].j;
  let rises = 0;
  let drops = 0;
  for (let i = 1; i < upto.length; i++) {
    if (upto[i].j > upto[i - 1].j) rises += 1;
    if (upto[i].j < upto[i - 1].j) drops += 1;
  }
  if (last > first * 1.25) return "Diverging";
  if (rises > drops * 0.75) return "Oscillating";
  if (last < 1.05) return "Near optimum";
  return "Converging";
}

const C_W = 260, C_H = 140;
const PAD  = { l: 36, r: 10, t: 14, b: 34 };
const PW   = C_W - PAD.l - PAD.r;
const PH   = C_H - PAD.t - PAD.b;

function miniChart(path, color, iter) {
  const maxJ = Math.min(40, Math.max(...path.map(p => p.j)) + 2);
  const xi   = i => PAD.l + (i / MAX_ITER) * PW;
  const yj   = j => PAD.t + (1 - Math.min((j - 0) / (maxJ - 0), 1)) * PH;
  const pts  = path.slice(0, iter + 1).map((p, i) => `${i === 0 ? "M" : "L"}${xi(i).toFixed(1)},${yj(p.j).toFixed(1)}`).join(" ");
  const last = path[Math.min(iter, path.length - 1)];
  return { pts, curX: xi(Math.min(iter, path.length - 1)), curY: yj(last.j), xi, yj, maxJ };
}

export default function LearningRateViz() {
  const [iter, setIter]       = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef                = useRef(null);
  const t                     = useChartTheme();

  const paths = CONFIGS.map(c => runPath(c.alpha, MAX_ITER));

  useEffect(() => {
    if (running) {
      rafRef.current = setInterval(() => {
        setIter(i => { if (i >= MAX_ITER) { setRunning(false); return i; } return i + 1; });
      }, 120);
    } else { clearInterval(rafRef.current); }
    return () => clearInterval(rafRef.current);
  }, [running]);

  const reset = () => { setRunning(false); setIter(0); };

  // Render a skeleton until tokens are ready (SSR / first paint)
  if (!t) return <div style={{ height: 200 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setRunning(r => !r)}
          style={{ flex: 1, background: running ? "rgba(244,63,94,0.2)" : "rgba(99,102,241,0.25)", color: t.btnText, border: `1.5px solid ${running ? "#f43f5e" : "#6366f1"}`, borderRadius: 8, padding: "8px 0", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
          {running ? "⏸ Pause" : "▶ Run All Three"}
        </button>
        <button onClick={reset}
          style={{ background: t.btnBg, color: t.btnText, border: `1.5px solid ${t.btnBorder}`, borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14 }}>
          ↺ Reset
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {CONFIGS.map((cfg, ci) => {
          const path = paths[ci];
          const { pts, curX, curY, xi, yj, maxJ } = miniChart(path, cfg.color, iter);
          const last      = path[Math.min(iter, path.length - 1)];
          const gradNow   = Math.abs(grad(last.w));
          const trend     = detectTrend(path, iter);
          const converged = ci === 1 && Math.abs(grad(last.w)) < 0.05;
          const diverged  = ci === 2 && last.j > 30;

          return (
            <div key={ci} style={{ background: t.surface, borderRadius: 10, padding: "12px", border: `1.5px solid ${cfg.color}44` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color, marginBottom: 3 }}>{cfg.label}</div>
              <div style={{ fontSize: 11, color: t.muted, marginBottom: 10, lineHeight: 1.4 }}>{cfg.desc}</div>
              <svg viewBox={`0 0 ${C_W} ${C_H}`} style={{ width: "100%", display: "block" }}>
                {[0, maxJ / 2, maxJ].map(j => (
                  <g key={j}>
                    <line x1={PAD.l} y1={yj(j)} x2={C_W - PAD.r} y2={yj(j)} stroke={t.grid} strokeWidth={1} />
                    <text x={PAD.l - 4} y={yj(j) + 4} textAnchor="end" fill={t.tick} fontSize={8}>{j.toFixed(0)}</text>
                  </g>
                ))}
                {[0, 10, 20, 30, 40].map(i => (
                  <text key={i} x={xi(i)} y={C_H - PAD.b + 12} textAnchor="middle" fill={t.tick} fontSize={8}>{i}</text>
                ))}
                <text x={PAD.l - 26} y={C_H / 2} textAnchor="middle" fill={t.label} fontSize={9}
                  transform={`rotate(-90,${PAD.l - 26},${C_H / 2})`}>J(w)</text>
                <text x={C_W / 2} y={C_H - 3} textAnchor="middle" fill={t.label} fontSize={9}>iteration</text>
                <line x1={PAD.l} y1={yj(1)} x2={C_W - PAD.r} y2={yj(1)} stroke="rgba(34,211,238,0.2)" strokeWidth={1} strokeDasharray="4,4" />
                {pts && <path d={pts} fill="none" stroke={cfg.color} strokeWidth={2} />}
                <circle cx={curX} cy={curY} r={5} fill={cfg.color} stroke={t.btnText} strokeWidth={1.5}>
                  {running && <animate attributeName="r" values="5;7;5" dur="0.5s" repeatCount="indefinite" />}
                </circle>
              </svg>

              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
                {[{ l: "J(w)", v: Math.min(last.j, 99.99).toFixed(2) }, { l: "w", v: last.w.toFixed(3) }, { l: "|grad|", v: gradNow.toFixed(3) }].map(s => (
                  <div key={s.l} style={{ background: t.surface2, borderRadius: 6, padding: "5px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: t.muted }}>{s.l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, fontFamily: "monospace" }}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 6, background: t.surface2, border: `1px solid ${cfg.color}55`, borderRadius: 6, padding: "5px 8px", fontSize: 11, color: t.muted3, textAlign: "center" }}>
                Trend: <span style={{ color: cfg.color, fontWeight: 700 }}>{trend}</span>
              </div>

              {converged && (
                <div style={{ marginTop: 6, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 6, padding: "5px 8px", fontSize: 11, color: "#22d3ee", textAlign: "center" }}>
                  ✓ Converged at iter {iter}
                </div>
              )}
              {diverged && (
                <div style={{ marginTop: 6, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 6, padding: "5px 8px", fontSize: 11, color: "#f43f5e", textAlign: "center" }}>
                  ✗ Diverging!
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 13, color: t.muted3, display: "flex", justifyContent: "space-between" }}>
          <span>Step through manually</span>
          <span style={{ fontFamily: "monospace", color: "#a5b4fc" }}>iter = {iter} / {MAX_ITER}</span>
        </label>
        <input type="range" min={0} max={MAX_ITER} step={1} value={iter}
          onChange={e => { setRunning(false); setIter(+e.target.value); }}
          style={{ width: "100%", accentColor: "#6366f1", marginTop: 4 }} />
      </div>

      <div style={{ marginTop: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: t.muted3 }}>
        <strong style={{ color: "#a5b4fc" }}>Rule of thumb:</strong> Start with α = 0.1, then tune. If loss goes up → halve it. If converging too slow → double it.
        In practice: learning rate schedules (decay, cosine annealing, warm-up) adapt α during training — no single value works for the full run.
      </div>
    </div>
  );
}
