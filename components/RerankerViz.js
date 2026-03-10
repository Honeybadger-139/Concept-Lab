"use client";
import { useState } from "react";

const QUERY = "How does gradient descent find the minimum of a loss function?";

const INITIAL_RESULTS = [
  {
    id: "A", initialRank: 1, rerankedRank: 2,
    vectorScore: 0.91,
    crossScore: 0.74,
    title: "Gradient Descent Algorithm Overview",
    snippet: "Gradient descent is an optimisation algorithm used in machine learning. It iteratively updates parameters.",
    relevant: true,
  },
  {
    id: "B", initialRank: 2, rerankedRank: 4,
    vectorScore: 0.88,
    crossScore: 0.51,
    title: "Introduction to Machine Learning",
    snippet: "Machine learning involves training models on data. Algorithms like gradient descent are mentioned briefly.",
    relevant: false,
  },
  {
    id: "C", initialRank: 3, rerankedRank: 1,
    vectorScore: 0.86,
    crossScore: 0.95,
    title: "Gradient Descent: Steps, Update Rule & Convergence",
    snippet: "At each step, gradient descent computes the gradient of the loss J(w) and updates w := w − α·∇J to minimise cost.",
    relevant: true,
  },
  {
    id: "D", initialRank: 4, rerankedRank: 5,
    vectorScore: 0.82,
    crossScore: 0.41,
    title: "Stochastic Gradient Descent in PyTorch",
    snippet: "torch.optim.SGD implements stochastic gradient descent. Call optimizer.step() after loss.backward().",
    relevant: false,
  },
  {
    id: "E", initialRank: 5, rerankedRank: 3,
    vectorScore: 0.79,
    crossScore: 0.88,
    title: "Loss Functions and Minimisation",
    snippet: "The loss function measures prediction error. Gradient descent minimises the loss by following the negative gradient direction.",
    relevant: true,
  },
];

export default function RerankerViz() {
  const [showReranked, setShowReranked] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const beforeList = [...INITIAL_RESULTS].sort((a, b) => a.initialRank - b.initialRank);
  const afterList = [...INITIAL_RESULTS].sort((a, b) => a.rerankedRank - b.rerankedRank);
  const displayList = showReranked ? afterList : beforeList;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Query */}
      <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#a5b4fc", fontStyle: "italic" }}>
        Query: "{QUERY}"
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setShowReranked(false)}
          style={{ flex: 1, background: !showReranked ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)", border: `1.5px solid ${!showReranked ? "#6366f1" : "rgba(255,255,255,0.15)"}`, color: "#fff", borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 13, fontWeight: !showReranked ? 700 : 400 }}>
          🔍 Before: Vector Search
        </button>
        <button onClick={() => setShowReranked(true)}
          style={{ flex: 1, background: showReranked ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: `1.5px solid ${showReranked ? "#10b981" : "rgba(255,255,255,0.15)"}`, color: "#fff", borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 13, fontWeight: showReranked ? 700 : 400 }}>
          ✨ After: Cross-Encoder Rerank
        </button>
      </div>

      {/* Results list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {displayList.map((doc, i) => {
          const rank = showReranked ? doc.rerankedRank : doc.initialRank;
          const score = showReranked ? doc.crossScore : doc.vectorScore;
          const scoreLabel = showReranked ? "cross-encoder" : "cosine sim";
          const isHovered = hoveredId === doc.id;
          const movedUp = showReranked && doc.rerankedRank < doc.initialRank;
          const movedDown = showReranked && doc.rerankedRank > doc.initialRank;

          return (
            <div key={doc.id} onMouseEnter={() => setHoveredId(doc.id)} onMouseLeave={() => setHoveredId(null)}
              style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 10, cursor: "default", transition: "all .2s",
                background: isHovered ? "rgba(255,255,255,0.07)" : doc.relevant ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${doc.relevant ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.08)"}` }}>
              {/* Rank badge */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0,
                background: rank === 1 ? "#facc15" : rank <= 3 ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)",
                color: rank === 1 ? "#000" : "#fff" }}>
                {rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: doc.relevant ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{doc.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {movedUp && <span style={{ fontSize: 12, color: "#22d3ee" }}>↑{doc.initialRank - doc.rerankedRank}</span>}
                    {movedDown && <span style={{ fontSize: 12, color: "#f43f5e" }}>↓{doc.rerankedRank - doc.initialRank}</span>}
                    <span style={{ fontSize: 12, fontFamily: "monospace", background: "rgba(255,255,255,0.08)", borderRadius: 5, padding: "2px 7px",
                      color: score >= 0.85 ? "#22d3ee" : score >= 0.65 ? "#facc15" : "#f87171" }}>
                      {scoreLabel}: {score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3, lineHeight: 1.5 }}>{doc.snippet}</div>
                {doc.relevant && <span style={{ fontSize: 10, color: "#22d3ee", marginTop: 3, display: "inline-block" }}>✓ Directly answers the query</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score comparison bars */}
      <div style={{ marginTop: 16, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10, fontWeight: 600 }}>Score comparison: vector cosine vs cross-encoder</div>
        {INITIAL_RESULTS.map(doc => (
          <div key={doc.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
              <span>{doc.title.substring(0, 38)}…</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                { label: "Vector", score: doc.vectorScore, color: "#6366f1" },
                { label: "Cross", score: doc.crossScore, color: "#10b981" },
              ].map(({ label, score, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", width: 32, flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${score * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width .3s" }} />
                  </div>
                  <span style={{ fontSize: 10, color, fontFamily: "monospace", width: 30, flexShrink: 0 }}>{score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
        <strong style={{ color: "#a5b4fc" }}>Bi-encoder vs cross-encoder:</strong> Vector search uses a bi-encoder (fast, pre-computed). Cross-encoders see query+doc together — more accurate but 10–50× slower. Two-stage: fast retrieval first (top-50), then rerank with cross-encoder (top-3 sent to LLM).
      </div>
    </div>
  );
}
