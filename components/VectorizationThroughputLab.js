"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const PRESETS = {
  laptopCpu: {
    label: "Laptop CPU",
    loopPerExampleMs: 0.07,
    vectorSetupMs: 1.6,
    vectorPerExampleMs: 0.011,
    memoryPerExampleKb: 6,
    maxComfortableBatch: 256,
  },
  optimizedCpu: {
    label: "Optimized CPU service",
    loopPerExampleMs: 0.045,
    vectorSetupMs: 0.9,
    vectorPerExampleMs: 0.007,
    memoryPerExampleKb: 8,
    maxComfortableBatch: 512,
  },
  gpuInference: {
    label: "GPU-backed inference",
    loopPerExampleMs: 0.05,
    vectorSetupMs: 3.4,
    vectorPerExampleMs: 0.0024,
    memoryPerExampleKb: 16,
    maxComfortableBatch: 1024,
  },
};

function metricCard(t, title, value, tone, subtitle) {
  const colors = {
    sky: "#38bdf8",
    green: "#22c55e",
    orange: "#f97316",
    violet: "#a78bfa",
  };

  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        background: t.surface2,
        padding: "0.75rem",
      }}
    >
      <div style={{ fontSize: "0.72rem", color: t.muted2 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: "1.2rem", fontWeight: 900, color: colors[tone] || t.labelMid, fontFamily: "monospace" }}>
        {value}
      </div>
      <div style={{ marginTop: 4, fontSize: "0.72rem", color: t.tick }}>{subtitle}</div>
    </div>
  );
}

function formatMs(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${value.toFixed(1)} ms`;
}

export default function VectorizationThroughputLab() {
  const [presetId, setPresetId] = useState("optimizedCpu");
  const [batchSize, setBatchSize] = useState(128);
  const [featureCount, setFeatureCount] = useState(40);
  const [requestCount, setRequestCount] = useState(4000);
  const t = useChartTheme();

  const preset = PRESETS[presetId];

  const stats = useMemo(() => {
    const featureMultiplier = 1 + featureCount / 200;
    const loopTotalMs = requestCount * preset.loopPerExampleMs * featureMultiplier;
    const vectorTotalMs = preset.vectorSetupMs + requestCount * preset.vectorPerExampleMs * featureMultiplier;
    const batchesNeeded = Math.ceil(requestCount / batchSize);
    const batchProcessingMs = batchesNeeded * preset.vectorSetupMs + requestCount * preset.vectorPerExampleMs * featureMultiplier;
    const memoryKb = batchSize * preset.memoryPerExampleKb * (1 + featureCount / 300);
    const loopThroughput = requestCount / Math.max(loopTotalMs / 1000, 0.001);
    const vectorThroughput = requestCount / Math.max(batchProcessingMs / 1000, 0.001);
    const speedup = loopTotalMs / Math.max(batchProcessingMs, 0.001);
    const breakEvenExamples = Math.ceil(preset.vectorSetupMs / Math.max((preset.loopPerExampleMs - preset.vectorPerExampleMs) * featureMultiplier, 0.001));
    const memoryPressure = memoryKb > preset.maxComfortableBatch * preset.memoryPerExampleKb ? "high" : memoryKb > preset.maxComfortableBatch * preset.memoryPerExampleKb * 0.6 ? "moderate" : "low";

    return {
      loopTotalMs,
      vectorTotalMs,
      batchProcessingMs,
      memoryKb,
      loopThroughput,
      vectorThroughput,
      speedup,
      batchesNeeded,
      breakEvenExamples,
      memoryPressure,
    };
  }, [batchSize, featureCount, preset, requestCount]);

  if (!t) return <div style={{ height: 420 }} />;

  const barMax = Math.max(stats.loopTotalMs, stats.batchProcessingMs);
  const memoryColor = stats.memoryPressure === "high" ? "#f97316" : stats.memoryPressure === "moderate" ? "#facc15" : "#22c55e";

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.6 }}>
        Vectorization is not just &quot;faster math&quot;. It changes how work is grouped, how much setup overhead you pay, and how much memory you consume per batch.
        This lab compares a naive per-example loop with a vectorized batch path.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.bg, padding: "0.9rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {Object.entries(PRESETS).map(([id, option]) => {
            const active = id === presetId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPresetId(id)}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${active ? "#38bdf8" : t.btnBorder}`,
                  background: active ? "rgba(56,189,248,0.10)" : t.btnBg,
                  color: active ? "#38bdf8" : t.btnText,
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(250px, 1.1fr) minmax(320px, 1fr)", gap: "0.85rem" }}>
          <div style={{ background: t.surface2, borderRadius: 14, padding: "0.85rem" }}>
            {[
              { key: "requestCount", label: "Examples to process", min: 200, max: 12000, step: 200, value: requestCount, setter: setRequestCount },
              { key: "featureCount", label: "Features per example", min: 5, max: 200, step: 5, value: featureCount, setter: setFeatureCount },
              { key: "batchSize", label: "Batch size for vectorized path", min: 8, max: 2048, step: 8, value: batchSize, setter: setBatchSize },
            ].map((control) => (
              <label key={control.key} style={{ display: "block", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                  <span>{control.label}</span>
                  <span style={{ fontFamily: "monospace", color: t.labelMid }}>{control.value}</span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(event) => control.setter(Number(event.target.value))}
                  style={{ width: "100%", marginTop: 6, accentColor: "#38bdf8" }}
                />
              </label>
            ))}

            <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface3, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.76rem", color: t.muted2 }}>Preset assumptions</div>
              <div style={{ marginTop: 6, display: "grid", gap: "0.35rem", fontSize: "0.74rem", color: t.muted3 }}>
                <div>Loop cost per example: <span style={{ fontFamily: "monospace", color: t.labelMid }}>{preset.loopPerExampleMs.toFixed(3)} ms</span></div>
                <div>Vectorized setup overhead: <span style={{ fontFamily: "monospace", color: t.labelMid }}>{preset.vectorSetupMs.toFixed(2)} ms</span></div>
                <div>Vectorized cost per example: <span style={{ fontFamily: "monospace", color: t.labelMid }}>{preset.vectorPerExampleMs.toFixed(4)} ms</span></div>
                <div>Memory per example: <span style={{ fontFamily: "monospace", color: t.labelMid }}>{preset.memoryPerExampleKb} KB</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
              {metricCard(t, "Loop total time", formatMs(stats.loopTotalMs), "orange", "One example at a time")}
              {metricCard(t, "Vectorized total time", formatMs(stats.batchProcessingMs), "green", `${stats.batchesNeeded} batched calls`)}
              {metricCard(t, "Estimated speedup", `${stats.speedup.toFixed(1)}x`, "sky", "Loop time divided by vectorized time")}
              {metricCard(t, "Break-even size", `${stats.breakEvenExamples}`, "violet", "Approximate examples needed before vectorization wins")}
            </div>

            <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface2, padding: "0.8rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: t.labelMid }}>Runtime comparison</div>
              <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.7rem" }}>
                {[
                  { label: "Per-example loop", value: stats.loopTotalMs, color: "#f97316", detail: `${Math.round(stats.loopThroughput).toLocaleString()} examples/sec` },
                  { label: "Vectorized batches", value: stats.batchProcessingMs, color: "#22c55e", detail: `${Math.round(stats.vectorThroughput).toLocaleString()} examples/sec` },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                      <span>{bar.label}</span>
                      <span style={{ fontFamily: "monospace", color: t.labelMid }}>{formatMs(bar.value)}</span>
                    </div>
                    <div style={{ marginTop: 6, height: 14, background: t.surface3, borderRadius: 999, overflow: "hidden", border: `1px solid ${t.border}` }}>
                      <div
                        style={{
                          width: `${Math.max(4, (bar.value / Math.max(barMax, 1)) * 100)}%`,
                          height: "100%",
                          background: bar.color,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 4, fontSize: "0.72rem", color: t.tick }}>{bar.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "0.75rem" }}>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface2, padding: "0.8rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: t.labelMid }}>Vectorization flow</div>
                <div style={{ marginTop: "0.65rem", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
                  {[
                    { label: "Collect batch", note: `${batchSize} examples per call`, color: "#38bdf8" },
                    { label: "Pack tensor", note: `${featureCount} features each`, color: "#a78bfa" },
                    { label: "Run kernel", note: "one vectorized compute step", color: "#22c55e" },
                    { label: "Return outputs", note: "split results back per example", color: "#f97316" },
                  ].map((step, index) => (
                    <div key={step.label} style={{ position: "relative", border: `1px solid ${t.border}`, borderRadius: 12, background: t.surface3, padding: "0.65rem" }}>
                      <div style={{ fontSize: "0.7rem", color: step.color, fontWeight: 800 }}>Step {index + 1}</div>
                      <div style={{ marginTop: 4, fontSize: "0.76rem", color: t.labelMid, fontWeight: 700 }}>{step.label}</div>
                      <div style={{ marginTop: 4, fontSize: "0.7rem", color: t.muted2, lineHeight: 1.45 }}>{step.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${t.border}`,
                  borderRadius: 12,
                  background: t.surface2,
                  padding: "0.8rem",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: t.labelMid }}>Operational tradeoffs</div>
                <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.45rem", fontSize: "0.74rem", color: t.muted3, lineHeight: 1.55 }}>
                  <div>Estimated memory footprint: <span style={{ fontFamily: "monospace", color: memoryColor }}>{(stats.memoryKb / 1024).toFixed(2)} MB</span></div>
                  <div>Memory pressure: <span style={{ color: memoryColor, fontWeight: 700, textTransform: "capitalize" }}>{stats.memoryPressure}</span></div>
                  <div>Small requests can still favor loops or tiny batches because setup overhead dominates.</div>
                  <div>Large batches raise throughput, but they can hurt tail latency, memory headroom, and debuggability.</div>
                  <div>In production, the right batch size is usually constrained by SLA, device memory, and queueing behavior rather than raw peak throughput.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
