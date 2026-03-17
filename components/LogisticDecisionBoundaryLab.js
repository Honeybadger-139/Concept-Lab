"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const WIDTH = 520;
const HEIGHT = 320;
const PAD = { l: 44, r: 18, t: 18, b: 38 };
const DOMAIN = { min: -3, max: 3 };
const PLOT_W = WIDTH - PAD.l - PAD.r;
const PLOT_H = HEIGHT - PAD.t - PAD.b;

const STRIP_W = 520;
const STRIP_H = 170;
const STRIP_PAD = { l: 20, r: 20, t: 28, b: 34 };
const STRIP_INNER_W = STRIP_W - STRIP_PAD.l - STRIP_PAD.r;

const DATASET = [
  { id: "A", x1: -2.4, x2: -1.8, label: 0 },
  { id: "B", x1: -2.0, x2: -1.1, label: 0 },
  { id: "C", x1: -1.8, x2: -2.2, label: 0 },
  { id: "D", x1: -1.4, x2: -0.9, label: 0 },
  { id: "E", x1: -1.0, x2: -1.5, label: 0 },
  { id: "F", x1: -0.8, x2: 0.1, label: 0 },
  { id: "G", x1: -0.2, x2: -0.6, label: 0 },
  { id: "H", x1: 0.2, x2: 0.5, label: 1 },
  { id: "I", x1: 0.6, x2: 0.2, label: 1 },
  { id: "J", x1: 0.8, x2: 1.1, label: 1 },
  { id: "K", x1: 1.1, x2: 0.7, label: 1 },
  { id: "L", x1: 1.4, x2: 1.6, label: 1 },
  { id: "M", x1: 1.8, x2: 0.9, label: 1 },
  { id: "N", x1: 2.2, x2: 1.5, label: 1 },
  { id: "O", x1: 0.3, x2: -0.4, label: 0 },
  { id: "P", x1: -0.1, x2: 0.8, label: 1 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function logit(p) {
  const safe = clamp(p, 0.001, 0.999);
  return Math.log(safe / (1 - safe));
}

function toX(value) {
  return PAD.l + ((value - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * PLOT_W;
}

function toY(value) {
  return PAD.t + (1 - (value - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * PLOT_H;
}

function stripX(probability) {
  return STRIP_PAD.l + probability * STRIP_INNER_W;
}

function formatPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function metric(tp, fp, fn) {
  const precisionDenom = tp + fp;
  const recallDenom = tp + fn;
  const precision = precisionDenom === 0 ? 0 : tp / precisionDenom;
  const recall = recallDenom === 0 ? 0 : tp / recallDenom;
  const f1Denom = precision + recall;
  const f1 = f1Denom === 0 ? 0 : (2 * precision * recall) / f1Denom;

  return { precision, recall, f1 };
}

function boundarySegment(weight1, weight2, bias, threshold) {
  const boundaryValue = logit(threshold) - bias;
  const points = [];
  const min = DOMAIN.min;
  const max = DOMAIN.max;
  const epsilon = 1e-6;

  if (Math.abs(weight2) > epsilon) {
    const yAtMin = (boundaryValue - weight1 * min) / weight2;
    const yAtMax = (boundaryValue - weight1 * max) / weight2;

    if (yAtMin >= min && yAtMin <= max) points.push({ x: min, y: yAtMin });
    if (yAtMax >= min && yAtMax <= max) points.push({ x: max, y: yAtMax });
  }

  if (Math.abs(weight1) > epsilon) {
    const xAtMin = (boundaryValue - weight2 * min) / weight1;
    const xAtMax = (boundaryValue - weight2 * max) / weight1;

    if (xAtMin >= min && xAtMin <= max) points.push({ x: xAtMin, y: min });
    if (xAtMax >= min && xAtMax <= max) points.push({ x: xAtMax, y: max });
  }

  const unique = [];
  for (let index = 0; index < points.length; index += 1) {
    const candidate = points[index];
    const exists = unique.some(
      (point) => Math.abs(point.x - candidate.x) < 0.001 && Math.abs(point.y - candidate.y) < 0.001,
    );
    if (!exists) unique.push(candidate);
  }

  return unique.slice(0, 2);
}

export default function LogisticDecisionBoundaryLab() {
  const [weight1, setWeight1] = useState(1.1);
  const [weight2, setWeight2] = useState(1.0);
  const [bias, setBias] = useState(-0.35);
  const [threshold, setThreshold] = useState(0.5);
  const [activeId, setActiveId] = useState("P");
  const t = useChartTheme();

  const analysis = useMemo(() => {
    const points = DATASET.map((point) => {
      const z = weight1 * point.x1 + weight2 * point.x2 + bias;
      const probability = sigmoid(z);
      const predicted = probability >= threshold ? 1 : 0;
      const outcome =
        predicted === 1 && point.label === 1
          ? "TP"
          : predicted === 1 && point.label === 0
            ? "FP"
            : predicted === 0 && point.label === 1
              ? "FN"
              : "TN";

      return { ...point, z, probability, predicted, outcome };
    }).sort((left, right) => right.probability - left.probability);

    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;

    points.forEach((point) => {
      if (point.outcome === "TP") tp += 1;
      if (point.outcome === "FP") fp += 1;
      if (point.outcome === "FN") fn += 1;
      if (point.outcome === "TN") tn += 1;
    });

    const rates = metric(tp, fp, fn);
    const accuracy = (tp + tn) / points.length;
    const selected = points.find((point) => point.id === activeId) || points[0];
    const segment = boundarySegment(weight1, weight2, bias, threshold);
    return {
      points,
      tp,
      fp,
      fn,
      tn,
      ...rates,
      accuracy,
      selected,
      segment,
    };
  }, [activeId, bias, threshold, weight1, weight2]);

  if (!t) return <div style={{ height: 580 }} />;

  const outcomeFill = {
    TP: "rgba(34,197,94,0.18)",
    FP: "rgba(245,158,11,0.18)",
    FN: "rgba(239,68,68,0.18)",
    TN: "rgba(59,130,246,0.16)",
  };

  const outcomeStroke = {
    TP: "#22c55e",
    FP: "#f59e0b",
    FN: "#ef4444",
    TN: "#60a5fa",
  };

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.6 }}>
        Logistic classification first scores each point with <strong>z = w1*x1 + w2*x2 + b</strong>, then converts
        that score into a probability. The threshold is the business decision rule: moving it changes how cautious or
        aggressive the classifier behaves.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, 0.9fr)",
          gap: "0.85rem",
          alignItems: "start",
          marginBottom: "0.9rem",
        }}
      >
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.bg, padding: "0.7rem" }}>
          <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Feature Space
          </div>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            style={{ width: "100%", display: "block", borderRadius: 12, background: t.surface, border: `1px solid ${t.border}` }}
          >
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="rgba(15,23,42,0.12)" />

            {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
              <g key={tick}>
                <line x1={toX(tick)} y1={PAD.t} x2={toX(tick)} y2={HEIGHT - PAD.b} stroke={tick === 0 ? t.gridMid : t.grid} strokeWidth={1} />
                <line x1={PAD.l} y1={toY(tick)} x2={WIDTH - PAD.r} y2={toY(tick)} stroke={tick === 0 ? t.gridMid : t.grid} strokeWidth={1} />
                <text x={toX(tick)} y={HEIGHT - PAD.b + 16} textAnchor="middle" fill={t.label} fontSize={10}>{tick}</text>
                <text x={PAD.l - 8} y={toY(tick) + 4} textAnchor="end" fill={t.label} fontSize={10}>{tick}</text>
              </g>
            ))}

            <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" fill={t.labelMid} fontSize={11}>
              Feature 1
            </text>
            <text
              x={16}
              y={HEIGHT / 2}
              textAnchor="middle"
              fill={t.labelMid}
              fontSize={11}
              transform={`rotate(-90,16,${HEIGHT / 2})`}
            >
              Feature 2
            </text>

            {analysis.segment.length === 2 ? (
              <>
                <line
                  x1={toX(analysis.segment[0].x)}
                  y1={toY(analysis.segment[0].y)}
                  x2={toX(analysis.segment[1].x)}
                  y2={toY(analysis.segment[1].y)}
                  stroke="#facc15"
                  strokeWidth={3}
                  strokeDasharray="7,4"
                />
                <text
                  x={WIDTH - PAD.r - 8}
                  y={PAD.t + 16}
                  textAnchor="end"
                  fill="#facc15"
                  fontSize={11}
                >
                  decision boundary
                </text>
              </>
            ) : (
              <text x={WIDTH - PAD.r - 10} y={PAD.t + 16} textAnchor="end" fill={t.muted2} fontSize={11}>
                boundary moves outside the visible window
              </text>
            )}

            {analysis.points.map((point) => {
              const active = point.id === analysis.selected.id;
              return (
                <g key={point.id}>
                  <circle
                    cx={toX(point.x1)}
                    cy={toY(point.x2)}
                    r={active ? 8.5 : 6.2}
                    fill={outcomeFill[point.outcome]}
                    stroke={outcomeStroke[point.outcome]}
                    strokeWidth={active ? 2.8 : 1.7}
                    onMouseEnter={() => setActiveId(point.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <text x={toX(point.x1)} y={toY(point.x2) + 3.5} textAnchor="middle" fill="#f8fafc" fontSize={9} pointerEvents="none">
                    {point.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.75rem" }}>
            <label style={{ fontSize: "0.78rem", color: t.muted2 }}>
              Weight for Feature 1: {weight1.toFixed(2)}
              <input
                type="range"
                min="-2.5"
                max="2.5"
                step="0.05"
                value={weight1}
                onChange={(event) => setWeight1(Number(event.target.value))}
                style={{ width: "100%", marginTop: "0.24rem", accentColor: "#38bdf8" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", color: t.muted2 }}>
              Weight for Feature 2: {weight2.toFixed(2)}
              <input
                type="range"
                min="-2.5"
                max="2.5"
                step="0.05"
                value={weight2}
                onChange={(event) => setWeight2(Number(event.target.value))}
                style={{ width: "100%", marginTop: "0.24rem", accentColor: "#818cf8" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", color: t.muted2 }}>
              Bias: {bias.toFixed(2)}
              <input
                type="range"
                min="-2.5"
                max="2.5"
                step="0.05"
                value={bias}
                onChange={(event) => setBias(Number(event.target.value))}
                style={{ width: "100%", marginTop: "0.24rem", accentColor: "#fb7185" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", color: t.muted2 }}>
              Classification threshold: {threshold.toFixed(2)}
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.01"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                style={{ width: "100%", marginTop: "0.24rem", accentColor: "#facc15" }}
              />
            </label>
          </div>

          <div style={{ marginTop: "0.7rem", fontSize: "0.78rem", color: t.muted3, lineHeight: 1.55 }}>
            Moving the <strong>weights</strong> rotates the boundary. Moving the <strong>bias</strong> shifts the whole
            line. Moving the <strong>threshold</strong> changes where probability becomes a positive prediction, so the
            decision boundary also shifts even when the weights stay fixed.
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.surface2, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
              Selected Point
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.35rem" }}>
              Point {analysis.selected.id}
            </div>
            <div style={{ fontSize: "0.79rem", color: t.muted3, lineHeight: 1.55 }}>
              Actual class: <strong style={{ color: analysis.selected.label ? "#22c55e" : "#60a5fa" }}>{analysis.selected.label}</strong>
              <br />
              Feature values: <strong style={{ color: "#f8fafc" }}>({analysis.selected.x1.toFixed(1)}, {analysis.selected.x2.toFixed(1)})</strong>
              <br />
              Score z: <strong style={{ color: "#f8fafc" }}>{analysis.selected.z.toFixed(2)}</strong>
              <br />
              Probability of Class 1: <strong style={{ color: "#f8fafc" }}>{formatPct(analysis.selected.probability)}</strong>
              <br />
              Model outcome: <strong style={{ color: outcomeStroke[analysis.selected.outcome] }}>{analysis.selected.outcome}</strong>
            </div>
          </div>

          <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.bg, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.5rem" }}>
              Live Metrics
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
              {[
                { label: "Precision", value: formatPct(analysis.precision), color: "#f59e0b" },
                { label: "Recall", value: formatPct(analysis.recall), color: "#22c55e" },
                { label: "F1 Score", value: analysis.f1.toFixed(3), color: "#a78bfa" },
                { label: "Accuracy", value: formatPct(analysis.accuracy), color: "#60a5fa" },
              ].map((item) => (
                <div key={item.label} style={{ borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface3, padding: "0.55rem 0.65rem" }}>
                  <div style={{ fontSize: "0.73rem", color: t.muted2, marginBottom: "0.15rem" }}>{item.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.42rem", marginTop: "0.55rem" }}>
              {[
                { label: "TP", value: analysis.tp, color: "#22c55e" },
                { label: "FP", value: analysis.fp, color: "#f59e0b" },
                { label: "FN", value: analysis.fn, color: "#ef4444" },
                { label: "TN", value: analysis.tn, color: "#60a5fa" },
              ].map((item) => (
                <div key={item.label} style={{ borderRadius: 10, background: "rgba(148,163,184,0.08)", padding: "0.45rem 0.55rem", fontSize: "0.76rem", color: t.muted3 }}>
                  {item.label}: <strong style={{ color: item.color }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.surface2, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
              Beginner Read
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: t.muted3, lineHeight: 1.6 }}>
              Lower thresholds label more cases as positive, which usually raises recall but also creates more false
              positives. Higher thresholds do the reverse: they are stricter, which often improves precision but can
              miss true positives.
            </p>
          </div>
        </div>
      </div>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, background: t.bg, padding: "0.75rem 0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.45rem" }}>
          Probability Strip
        </div>
        <svg
          viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
          style={{ width: "100%", display: "block", borderRadius: 12, background: t.surface, border: `1px solid ${t.border}` }}
        >
          <rect x={STRIP_PAD.l} y={54} width={STRIP_INNER_W} height={54} fill="rgba(15,23,42,0.12)" rx={10} />

          {[0, 0.25, 0.5, 0.75, 1].map((value) => (
            <g key={value}>
              <line x1={stripX(value)} y1={48} x2={stripX(value)} y2={114} stroke={value === 0.5 ? t.gridMid : t.grid} strokeWidth={1} />
              <text x={stripX(value)} y={136} textAnchor="middle" fill={t.label} fontSize={10}>
                {value.toFixed(2)}
              </text>
            </g>
          ))}

          <text x={STRIP_W / 2} y={158} textAnchor="middle" fill={t.labelMid} fontSize={11}>
            Predicted probability of Class 1
          </text>

          <line
            x1={stripX(threshold)}
            y1={36}
            x2={stripX(threshold)}
            y2={118}
            stroke="#facc15"
            strokeWidth={2}
            strokeDasharray="6,4"
          />
          <text x={stripX(threshold)} y={26} textAnchor="middle" fill="#facc15" fontSize={11}>
            threshold {threshold.toFixed(2)}
          </text>

          {analysis.points.map((point, index) => {
            const y = index < 8 ? 70 : 94;
            const active = point.id === analysis.selected.id;
            return (
              <g key={point.id}>
                <circle
                  cx={stripX(point.probability)}
                  cy={y}
                  r={active ? 7.5 : 5.5}
                  fill={outcomeStroke[point.outcome]}
                  stroke="#f8fafc"
                  strokeWidth={active ? 2.2 : 1.2}
                  onMouseEnter={() => setActiveId(point.id)}
                  style={{ cursor: "pointer" }}
                />
                <text x={stripX(point.probability)} y={y + 20} textAnchor="middle" fill={t.muted3} fontSize={9}>
                  {point.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
          {[
            { label: "TP", color: "#22c55e", hint: "positive and correct" },
            { label: "FP", color: "#f59e0b", hint: "positive but wrong" },
            { label: "FN", color: "#ef4444", hint: "negative but missed" },
            { label: "TN", color: "#60a5fa", hint: "negative and correct" },
          ].map((item) => (
            <div key={item.label} style={{ fontSize: "0.75rem", color: t.muted3, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, padding: "0.5rem 0.55rem" }}>
              <strong style={{ color: item.color }}>{item.label}</strong>: {item.hint}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "0.65rem", fontSize: "0.78rem", color: t.muted3, lineHeight: 1.55 }}>
          The yellow line is the policy cutoff. Points to the right are predicted as Class 1. If you move the threshold
          right, only the highest-confidence examples stay positive. If you move it left, the model becomes more
          sensitive and captures more positives, but it may also pull in extra false alarms.
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.55rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            setWeight1(1.1);
            setWeight2(1.0);
            setBias(-0.35);
            setThreshold(0.5);
            setActiveId("P");
          }}
          style={{
            background: t.btnBg,
            border: `1px solid ${t.btnBorder}`,
            color: t.btnText,
            borderRadius: 8,
            padding: "0.45rem 0.8rem",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Reset balanced setup
        </button>
        <button
          type="button"
          onClick={() => setThreshold(0.32)}
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#dcfce7",
            borderRadius: 8,
            padding: "0.45rem 0.8rem",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Recall-first threshold
        </button>
        <button
          type="button"
          onClick={() => setThreshold(0.72)}
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#fef3c7",
            borderRadius: 8,
            padding: "0.45rem 0.8rem",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Precision-first threshold
        </button>
      </div>

      <div style={{ marginTop: "0.85rem", border: `1px solid ${t.border}`, borderRadius: 14, background: t.surface2, padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
          Why This Matters
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: t.muted3, lineHeight: 1.6 }}>
          Logistic regression is not only about fitting a line. In production, teams must decide where to place the
          threshold based on business cost. Fraud screening, disease detection, and lead qualification often use the
          same model but different operating thresholds because the cost of false positives and false negatives differs.
        </p>
      </div>
    </div>
  );
}
