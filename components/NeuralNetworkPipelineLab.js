"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function relu(value) {
  return Math.max(0, value);
}

const HIDDEN_UNITS = [
  {
    key: "affordability",
    label: "Affordability",
    description: "Mostly driven by price and shipping cost.",
    weights: { price: -1.2, shipping: -1.0, marketing: 0.1, quality: 0.2 },
    bias: 1.2,
    color: "#38bdf8",
  },
  {
    key: "awareness",
    label: "Awareness",
    description: "Mostly driven by marketing reach and some quality spillover.",
    weights: { price: 0.0, shipping: -0.1, marketing: 1.5, quality: 0.25 },
    bias: -0.4,
    color: "#f97316",
  },
  {
    key: "perceivedQuality",
    label: "Perceived Quality",
    description: "A blend of material quality and premium pricing cues.",
    weights: { price: 0.4, shipping: 0.05, marketing: 0.15, quality: 1.4 },
    bias: -0.7,
    color: "#22c55e",
  },
];

const OUTPUT_WEIGHTS = {
  affordability: 1.2,
  awareness: 0.9,
  perceivedQuality: 1.1,
};

function normalizeInputs(inputs) {
  return {
    price: inputs.price / 100,
    shipping: inputs.shipping / 30,
    marketing: inputs.marketing / 100,
    quality: inputs.quality / 100,
  };
}

export default function NeuralNetworkPipelineLab() {
  const [hiddenActivation, setHiddenActivation] = useState("relu");
  const [inputs, setInputs] = useState({
    price: 42,
    shipping: 8,
    marketing: 65,
    quality: 72,
  });
  const t = useChartTheme();

  const normalized = useMemo(() => normalizeInputs(inputs), [inputs]);
  const activationFn = hiddenActivation === "relu" ? relu : sigmoid;

  const hidden = useMemo(
    () =>
      HIDDEN_UNITS.map((unit) => {
        const z =
          unit.weights.price * normalized.price +
          unit.weights.shipping * normalized.shipping +
          unit.weights.marketing * normalized.marketing +
          unit.weights.quality * normalized.quality +
          unit.bias;

        return {
          ...unit,
          z,
          activation: activationFn(z),
        };
      }),
    [activationFn, normalized]
  );

  const outputLogit = hidden.reduce((sum, unit) => sum + OUTPUT_WEIGHTS[unit.key] * unit.activation, -1.1);
  const outputProb = sigmoid(outputLogit);

  if (!t) return <div style={{ height: 360 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3 }}>
        An interactive forward-pass sketch: tune product signals, watch hidden concepts update, and see how the output layer turns learned features into a decision.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          background: t.bg,
          padding: "0.9rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {[
            { id: "relu", label: "Hidden ReLU" },
            { id: "sigmoid", label: "Hidden Sigmoid" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setHiddenActivation(option.id)}
              style={{
                borderRadius: 999,
                border: `1px solid ${hiddenActivation === option.id ? "#38bdf8" : t.btnBorder}`,
                background: hiddenActivation === option.id ? "rgba(56,189,248,0.10)" : t.btnBg,
                color: hiddenActivation === option.id ? "#38bdf8" : t.btnText,
                padding: "0.4rem 0.78rem",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }}>
          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
              Input Layer
            </div>
            {[
              { key: "price", label: "Price", min: 10, max: 100, suffix: "$" },
              { key: "shipping", label: "Shipping", min: 0, max: 30, suffix: "$" },
              { key: "marketing", label: "Marketing", min: 0, max: 100, suffix: "" },
              { key: "quality", label: "Material quality", min: 0, max: 100, suffix: "" },
            ].map((control) => (
              <label key={control.key} style={{ display: "block", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: t.muted2 }}>
                  <span>{control.label}</span>
                  <span style={{ fontFamily: "monospace", color: t.labelMid }}>
                    {control.key === "price" || control.key === "shipping" ? `${control.suffix}${inputs[control.key]}` : inputs[control.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={1}
                  value={inputs[control.key]}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      [control.key]: Number(event.target.value),
                    }))
                  }
                  style={{ width: "100%", marginTop: 6, accentColor: "#38bdf8" }}
                />
              </label>
            ))}
            <div style={{ fontSize: "0.72rem", color: t.tick }}>
              The sliders represent raw features. The network turns them into intermediate concepts before making the final prediction.
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
              Hidden Layer
            </div>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {hidden.map((unit) => (
                <div key={unit.key} style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.72rem", background: t.surface3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: unit.color }}>{unit.label}</div>
                      <div style={{ fontSize: "0.71rem", color: t.muted2, marginTop: 2 }}>{unit.description}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: t.labelMid }}>
                      z={unit.z.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, overflow: "hidden", background: t.surface, marginTop: "0.55rem" }}>
                    <div
                      style={{
                        width: `${Math.min(100, unit.activation * 100)}%`,
                        height: "100%",
                        background: unit.color,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.72rem", color: t.tick }}>
                    <span>{hiddenActivation === "relu" ? "ReLU activation" : "Sigmoid activation"}</span>
                    <span style={{ fontFamily: "monospace" }}>a={unit.activation.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.85rem" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: t.labelMid, marginBottom: "0.7rem" }}>
              Output Layer
            </div>
            <div
              style={{
                borderRadius: 12,
                padding: "0.9rem",
                background: "linear-gradient(180deg, rgba(59,130,246,0.10), rgba(34,197,94,0.10))",
                border: `1px solid ${t.border}`,
              }}
            >
              <div style={{ fontSize: "0.76rem", color: t.muted2 }}>Top-seller probability</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: outputProb >= 0.5 ? "#22c55e" : "#f97316", fontFamily: "monospace" }}>
                {outputProb.toFixed(2)}
              </div>
              <div style={{ fontSize: "0.74rem", color: t.tick, marginTop: 6 }}>
                Logit = weighted sum of hidden activations, then sigmoid for the final probability.
              </div>
            </div>

            <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
              {hidden.map((unit) => (
                <div key={`${unit.key}-contrib`} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem" }}>
                  <span style={{ color: t.muted2 }}>{unit.label}</span>
                  <span style={{ fontFamily: "monospace", color: t.labelMid }}>
                    {OUTPUT_WEIGHTS[unit.key].toFixed(2)} x {unit.activation.toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", paddingTop: 6, borderTop: `1px solid ${t.border}` }}>
                <span style={{ color: t.muted2 }}>Architecture flow</span>
                <span style={{ fontFamily: "monospace", color: t.labelMid }}>x -&gt; a[1] -&gt; y_hat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
