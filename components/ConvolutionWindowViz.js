"use client";

import { useMemo, useState } from "react";

const signal = [0.1, 0.4, 0.2, 0.9, 1.4, 0.8, 0.3, 0.2, 0.6, 1.1, 0.7, 0.2];

export default function ConvolutionWindowViz() {
  const [windowStart, setWindowStart] = useState(0);
  const [windowSize, setWindowSize] = useState(4);

  const windowValues = useMemo(() => signal.slice(windowStart, windowStart + windowSize), [windowStart, windowSize]);
  const localAverage = useMemo(() => {
    const total = windowValues.reduce((sum, value) => sum + value, 0);
    return total / windowValues.length;
  }, [windowValues]);

  const maxStart = signal.length - windowSize;

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Convolutional layers do not let every neuron read the full input. Each unit reads a local window, which cuts parameters, speeds up computation, and lets the same pattern detector slide across the signal.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.8rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Window size: {windowSize}
            <input
              type="range"
              min="3"
              max="6"
              step="1"
              value={windowSize}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setWindowSize(nextSize);
                setWindowStart((current) => Math.min(current, signal.length - nextSize));
              }}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
            Window start: {windowStart + 1}
            <input
              type="range"
              min="0"
              max={maxStart}
              step="1"
              value={windowStart}
              onChange={(event) => setWindowStart(Number(event.target.value))}
              style={{ width: "100%", marginTop: "0.24rem" }}
            />
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.25rem" }}>Current receptive field</div>
          <p style={{ margin: "0 0 0.45rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Active window covers positions {windowStart + 1} to {windowStart + windowSize}.
          </p>
          <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Local average feature: <strong style={{ color: "#f8fafc" }}>{localAverage.toFixed(3)}</strong>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem", marginBottom: "0.8rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${signal.length}, minmax(0, 1fr))`, gap: "0.35rem" }}>
          {signal.map((value, index) => {
            const isActive = index >= windowStart && index < windowStart + windowSize;
            return (
              <div key={index} style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: `${40 + value * 70}px`,
                    borderRadius: "10px 10px 4px 4px",
                    background: isActive ? "linear-gradient(180deg, #3b82f6, #60a5fa)" : "linear-gradient(180deg, rgba(148,163,184,0.28), rgba(100,116,139,0.28))",
                    border: isActive ? "1px solid rgba(59,130,246,0.42)" : "1px solid rgba(148,163,184,0.16)",
                  }}
                />
                <div style={{ marginTop: "0.25rem", fontSize: "0.72rem", color: isActive ? "#60a5fa" : "var(--text-tertiary)", fontWeight: isActive ? 700 : 500 }}>
                  x{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Why this is different from a dense layer
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>A dense neuron would connect to all {signal.length} input positions at once.</li>
          <li>A convolutional neuron only reads a local neighborhood, which reduces parameters and focuses on local patterns.</li>
          <li>The same detector can slide across the signal, which is why convolution works well for images, audio, ECG, and other structured inputs.</li>
        </ul>
      </div>
    </div>
  );
}
