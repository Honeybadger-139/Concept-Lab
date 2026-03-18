"use client";

import { useState } from "react";

const LAYERS = [
  {
    id: "app",
    label: "Application Layer",
    color: "#22c55e",
    points: [
      "Product logic, user auth, rate limits, and business workflows.",
      "Owns when to call a chain, retriever, or agent.",
    ],
  },
  {
    id: "orchestration",
    label: "LangChain Orchestration",
    color: "#d97706",
    points: [
      "Prompt templates, LCEL chains, routers, and output parsers.",
      "Composes deterministic and dynamic execution paths.",
    ],
  },
  {
    id: "retrieval",
    label: "Retrieval & Memory",
    color: "#f59e0b",
    points: [
      "Embeddings, vector stores, retrievers, metadata filters.",
      "Short-term chat history and long-term context stores.",
    ],
  },
  {
    id: "actions",
    label: "Agents & Tools",
    color: "#f97316",
    points: [
      "Tool schemas, action execution, retries, and error fallbacks.",
      "Turns model reasoning into constrained external operations.",
    ],
  },
  {
    id: "models",
    label: "Model Providers",
    color: "#14b8a6",
    points: [
      "OpenAI, Anthropic, Gemini, Ollama with one runnable interface.",
      "Provider swap via config, not system rewrite.",
    ],
  },
  {
    id: "observability",
    label: "Observability & Eval",
    color: "#a855f7",
    points: [
      "Tracing, run metadata, token/cost analytics, quality scoring.",
      "Feedback loops for prompt and retrieval tuning.",
    ],
  },
];

export default function LangChainArchitectureMap() {
  const [selected, setSelected] = useState("orchestration");
  const active = LAYERS.find((layer) => layer.id === selected) || LAYERS[0];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Architecture map of a production LangChain system. Click each layer to inspect responsibilities and boundaries.
      </p>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", overflow: "hidden", background: "#0b1020", marginBottom: "0.75rem" }}>
        <svg viewBox="0 0 980 260" width="100%" height="auto" role="img" aria-label="LangChain architecture map">
          {LAYERS.map((layer, index) => {
            const y = 14 + index * 40;
            const activeLayer = selected === layer.id;
            return (
              <g key={layer.id} onClick={() => setSelected(layer.id)} style={{ cursor: "pointer" }}>
                <rect
                  x="18"
                  y={y}
                  width="944"
                  height="32"
                  rx="8"
                  fill={activeLayer ? `${layer.color}33` : "rgba(15,23,42,0.92)"}
                  stroke={activeLayer ? layer.color : "rgba(148,163,184,0.45)"}
                  strokeWidth={activeLayer ? 2.2 : 1.2}
                />
                <text
                  x="35"
                  y={y + 21}
                  fill={activeLayer ? "#e2e8f0" : "#cbd5e1"}
                  fontSize="12"
                  fontWeight={activeLayer ? 700 : 600}
                >
                  {index + 1}. {layer.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-tertiary)", padding: "0.7rem 0.8rem" }}>
        <div style={{ fontSize: "0.8rem", color: active.color, fontWeight: 700, marginBottom: "0.35rem" }}>{active.label}</div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {active.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
