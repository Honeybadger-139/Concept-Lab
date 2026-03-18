"use client";
import { useState, useEffect, useRef } from "react";

const STEPS = [
  {
    id: "query", icon: "❓", label: "User Query", color: "#d97706",
    detail: "\"What is the return policy for online orders?\"",
    timing: "~0ms", side: "real-time"
  },
  {
    id: "embed", icon: "🔢", label: "Embed Query", color: "#8b5cf6",
    detail: "text-embedding-3-small → [0.23, -0.71, 0.08, …] (1536 dims)",
    timing: "~80ms", side: "real-time"
  },
  {
    id: "search", icon: "🔍", label: "Vector Search", color: "#f97316",
    detail: "Cosine similarity against 50,000 stored vectors in ChromaDB",
    timing: "~30ms", side: "real-time"
  },
  {
    id: "retrieve", icon: "📄", label: "Top-K Chunks", color: "#facc15",
    detail: "k=3 most similar: \"Returns accepted within 30 days…\" (sim=0.92)",
    timing: "~5ms", side: "real-time"
  },
  {
    id: "augment", icon: "🧩", label: "Augment Prompt", color: "#10b981",
    detail: "System: You are a helpful assistant. Context: {chunks}. Question: {query}",
    timing: "~2ms", side: "real-time"
  },
  {
    id: "generate", icon: "🤖", label: "LLM Generation", color: "#22d3ee",
    detail: "GPT-4o receives augmented prompt, generates grounded answer",
    timing: "~800ms", side: "real-time"
  },
  {
    id: "answer", icon: "✅", label: "Grounded Answer", color: "#34d399",
    detail: "\"You can return online orders within 30 days of delivery with a receipt.\"",
    timing: "total ~920ms", side: "real-time"
  },
];

const INJECTION_STEPS = [
  { id: "load", icon: "📁", label: "Load Documents", color: "#d97706", detail: "PyPDFDirectoryLoader reads all PDFs from /docs folder" },
  { id: "chunk", icon: "✂️", label: "Chunk Text", color: "#8b5cf6", detail: "RecursiveCharacterTextSplitter: chunk_size=1000, overlap=200" },
  { id: "embed_inj", icon: "🔢", label: "Embed Chunks", color: "#f97316", detail: "OpenAIEmbeddings converts each chunk → 1536-dim vector" },
  { id: "store", icon: "🗄️", label: "Store Vectors", color: "#10b981", detail: "Chroma.from_documents() persists to ./chroma_db on disk" },
];

export default function RetrievalQueryViz() {
  const [activeStep, setActiveStep] = useState(-1);
  const [animating, setAnimating] = useState(false);
  const [mode, setMode] = useState("retrieval"); // "retrieval" | "injection"
  const timerRef = useRef(null);

  const steps = mode === "retrieval" ? STEPS : INJECTION_STEPS;

  const runAnimation = () => {
    setActiveStep(-1);
    setAnimating(true);
    let i = 0;
    const next = () => {
      setActiveStep(i);
      i++;
      if (i < steps.length) {
        timerRef.current = setTimeout(next, 700);
      } else {
        setAnimating(false);
      }
    };
    timerRef.current = setTimeout(next, 200);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const totalTime = mode === "retrieval" ? "~920ms" : "runs once offline";

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["retrieval", "⚡ Retrieval Pipeline (per query)"], ["injection", "📦 Injection Pipeline (offline)"]].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setActiveStep(-1); setAnimating(false); clearTimeout(timerRef.current); }}
            style={{ flex: 1, background: mode === m ? "rgba(217, 119, 6,0.25)" : "rgba(255,255,255,0.06)", border: `1.5px solid ${mode === m ? "#d97706" : "rgba(255,255,255,0.15)"}`, color: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: mode === m ? 700 : 400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Pipeline steps */}
      <div style={{ position: "relative" }}>
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          const opacity = activeStep === -1 ? 1 : isDone ? 0.55 : isActive ? 1 : 0.35;
          return (
            <div key={step.id}>
              <div onClick={() => setActiveStep(i === activeStep ? -1 : i)}
                style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "all .2s",
                  background: isActive ? `${step.color}18` : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${isActive ? step.color : isDone ? step.color + "55" : "rgba(255,255,255,0.1)"}`,
                  opacity, marginBottom: 2 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: isActive ? step.color : isDone ? step.color + "44" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all .3s", boxShadow: isActive ? `0 0 14px ${step.color}88` : "none" }}>
                  {isDone ? "✓" : step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? step.color : isDone ? step.color + "cc" : "rgba(255,255,255,0.8)" }}>{step.label}</span>
                    {step.timing && <span style={{ fontSize: 11, fontFamily: "monospace", background: "rgba(255,255,255,0.07)", borderRadius: 4, padding: "2px 7px", color: "rgba(255,255,255,0.45)" }}>{step.timing}</span>}
                  </div>
                  {isActive && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, lineHeight: 1.5, fontFamily: step.detail.includes("[") || step.detail.includes("{") ? "monospace" : "inherit" }}>
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", height: 14, alignItems: "center" }}>
                  <div style={{ width: 2, height: "100%", background: isDone ? step.color + "77" : "rgba(255,255,255,0.1)", transition: "background .3s" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={runAnimation} disabled={animating}
          style={{ flex: 1, background: animating ? "rgba(255,255,255,0.05)" : "rgba(217, 119, 6,0.25)", border: `1.5px solid ${animating ? "rgba(255,255,255,0.1)" : "#d97706"}`, color: "#fff", borderRadius: 8, padding: "9px 0", cursor: animating ? "default" : "pointer", fontSize: 14, fontWeight: 700, opacity: animating ? 0.5 : 1 }}>
          {animating ? "⏳ Animating…" : "▶ Animate Flow"}
        </button>
        <button onClick={() => { setActiveStep(-1); setAnimating(false); clearTimeout(timerRef.current); }}
          style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 14 }}>
          ↺ Reset
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
        Click any step to inspect it • {totalTime} total
      </div>

      <div style={{ marginTop: 12, background: "rgba(217, 119, 6,0.08)", border: "1px solid rgba(217, 119, 6,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
        <strong style={{ color: "#a5b4fc" }}>Critical constraint:</strong> The embedding model used at injection time <em>must be identical</em> to the one used at retrieval time.
        Vectors from different models live in incompatible spaces — mixing them silently corrupts similarity scores.
      </div>
    </div>
  );
}
