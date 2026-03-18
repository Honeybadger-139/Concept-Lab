"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const SCENARIOS = [
  { id: "tabular-fast", label: "Tabular + fast iteration", data: "structured", speed: "high", transfer: "low", interpret: "medium" },
  { id: "vision-audio", label: "Image/audio/text heavy", data: "unstructured", speed: "medium", transfer: "high", interpret: "low" },
  { id: "small-data", label: "Small dataset + pretrained options", data: "mixed", speed: "medium", transfer: "high", interpret: "low" },
  { id: "regulated", label: "Regulated + explainability", data: "structured", speed: "high", transfer: "low", interpret: "high" },
];

function score(scenario) {
  const tree =
    (scenario.data === "structured" ? 35 : 10) +
    (scenario.speed === "high" ? 20 : 8) +
    (scenario.interpret === "high" ? 22 : scenario.interpret === "medium" ? 14 : 6) +
    (scenario.transfer === "high" ? 3 : 10);

  const nn =
    (scenario.data === "unstructured" ? 35 : scenario.data === "mixed" ? 24 : 13) +
    (scenario.transfer === "high" ? 23 : 8) +
    (scenario.speed === "high" ? 8 : 14) +
    (scenario.interpret === "high" ? 4 : 12);

  return { tree, nn };
}

export default function ModelSelectionMatrixViz() {
  const [active, setActive] = useState("tabular-fast");
  const t = useChartTheme();

  const scenario = SCENARIOS.find((entry) => entry.id === active) ?? SCENARIOS[0];
  const s = useMemo(() => score(scenario), [scenario]);

  if (!t) return <div style={{ height: 260 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Use this matrix to choose between tree ensembles and neural networks based on data type, iteration speed, transfer learning needs, and interpretability.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.88rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
          {SCENARIOS.map((entry) => {
            const on = entry.id === active;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActive(entry.id)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${on ? "#38bdf8" : t.btnBorder}`,
                  background: on ? "rgba(56,189,248,0.12)" : t.btnBg,
                  color: on ? "#38bdf8" : t.btnText,
                  padding: "0.56rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.79rem", fontWeight: 700 }}>{entry.label}</div>
                <div style={{ fontSize: "0.7rem", marginTop: 4 }}>
                  data: {entry.data} | transfer: {entry.transfer}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "0.82rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.58rem" }}>
          <ChoiceCard
            title="Tree ensemble fit"
            score={s.tree}
            tone="#22c55e"
            reason="Usually stronger on tabular data, fast iterative experimentation, and smaller explainable systems."
            t={t}
          />
          <ChoiceCard
            title="Neural network fit"
            score={s.nn}
            tone="#f97316"
            reason="Usually stronger on unstructured or mixed modalities, transfer learning, and end-to-end representation learning."
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({ title, score, tone, reason, t }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.65rem" }}>
      <div style={{ fontSize: "0.73rem", color: t.muted2 }}>{title}</div>
      <div style={{ marginTop: 3, color: tone, fontFamily: "monospace", fontWeight: 700 }}>
        {score.toFixed(1)} / 100
      </div>
      <p style={{ margin: "0.4rem 0 0", fontSize: "0.72rem", color: t.muted3, lineHeight: 1.5 }}>{reason}</p>
    </div>
  );
}

