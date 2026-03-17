"use client";

import { useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function BackpropComputationGraphViz() {
  const [params, setParams] = useState({
    w: 2,
    b: 8,
    x: -2,
    y: 2,
  });
  const [learningRate, setLearningRate] = useState(0.1);
  const t = useChartTheme();

  if (!t) return <div style={{ height: 340 }} />;

  const c = params.w * params.x;
  const a = c + params.b;
  const d = a - params.y;
  const loss = 0.5 * d * d;

  const dJdd = d;
  const dJda = dJdd;
  const dJdc = dJda;
  const dJdb = dJda;
  const dJdw = dJdc * params.x;

  const nextW = params.w - learningRate * dJdw;
  const nextB = params.b - learningRate * dJdb;

  const nodes = [
    { label: "w", value: params.w, note: "parameter" },
    { label: "x", value: params.x, note: "input" },
    { label: "c = wx", value: c, note: "multiply" },
    { label: "a = c + b", value: a, note: "prediction" },
    { label: "d = a - y", value: d, note: "error" },
    { label: "J = 0.5 d^2", value: loss, note: "loss" },
  ];

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        Explore the computation graph behind a simple model and watch forward values and backward derivatives update together.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.9rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Inputs and Parameters
            </div>
            {[
              { key: "w", label: "Weight w", min: -5, max: 5, step: 0.1, color: "#38bdf8" },
              { key: "b", label: "Bias b", min: -10, max: 10, step: 0.1, color: "#22c55e" },
              { key: "x", label: "Input x", min: -5, max: 5, step: 0.1, color: "#f97316" },
              { key: "y", label: "Target y", min: -5, max: 5, step: 0.1, color: "#facc15" },
            ].map((item) => (
              <label key={item.key} style={{ display: "block", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                  <span>{item.label}</span>
                  <span style={{ fontFamily: "monospace", color: item.color }}>{params[item.key].toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={params[item.key]}
                  onChange={(event) =>
                    setParams((current) => ({
                      ...current,
                      [item.key]: Number(event.target.value),
                    }))
                  }
                  style={{ width: "100%", marginTop: 6, accentColor: item.color }}
                />
              </label>
            ))}

            <label style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                <span>Learning rate</span>
                <span style={{ fontFamily: "monospace", color: t.labelMid }}>{learningRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.5}
                step={0.01}
                value={learningRate}
                onChange={(event) => setLearningRate(Number(event.target.value))}
                style={{ width: "100%", marginTop: 6, accentColor: "#8b5cf6" }}
              />
            </label>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Forward Propagation
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {nodes.map((node, index) => (
                <div key={node.label} style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.72rem", background: t.surface3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.6rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.labelMid }}>{node.label}</div>
                      <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 2 }}>{node.note}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#38bdf8" }}>
                      {node.value.toFixed(3)}
                    </div>
                  </div>
                  {index < nodes.length - 1 && (
                    <div style={{ marginTop: 8, fontSize: "0.7rem", color: t.tick }}>next node depends on this value</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.75rem" }}>
              Backpropagation
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {[
                { label: "dJ/dd", value: dJdd, note: "loss sensitivity to error node" },
                { label: "dJ/da", value: dJda, note: "prediction sensitivity" },
                { label: "dJ/dc", value: dJdc, note: "pre-bias sensitivity" },
                { label: "dJ/db", value: dJdb, note: "bias gradient" },
                { label: "dJ/dw", value: dJdw, note: "weight gradient = (dJ/dc) * x" },
              ].map((item) => (
                <div key={item.label} style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.72rem", background: t.surface3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.6rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.labelMid }}>{item.label}</div>
                      <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 2 }}>{item.note}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#f97316" }}>
                      {item.value.toFixed(3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "0.8rem",
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: "rgba(139,92,246,0.08)",
                padding: "0.8rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: t.muted2 }}>One gradient step</div>
              <div style={{ marginTop: 6, display: "grid", gap: "0.28rem", fontFamily: "monospace", fontSize: "0.76rem", color: t.labelMid }}>
                <div>w_next = {params.w.toFixed(3)} - {learningRate.toFixed(2)} x {dJdw.toFixed(3)} = {clamp(nextW, -999, 999).toFixed(3)}</div>
                <div>b_next = {params.b.toFixed(3)} - {learningRate.toFixed(2)} x {dJdb.toFixed(3)} = {clamp(nextB, -999, 999).toFixed(3)}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: "0.71rem", color: t.tick }}>
                Forward pass moves left to right through the graph. Backprop sends loss sensitivity right to left so the optimizer knows how to update each parameter.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
