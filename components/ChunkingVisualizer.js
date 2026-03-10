"use client";

/**
 * ChunkingVisualizer — interactive demo showing how text is split into chunks.
 *
 * Users control chunk_size and chunk_overlap with sliders and see the
 * resulting chunks rendered with colour-coded overlap zones.
 */

import { useState, useMemo } from "react";

const SAMPLE_TEXT =
  "Retrieval-Augmented Generation (RAG) is an AI framework that combines the strengths of retrieval-based systems with generative models. Rather than relying solely on what was baked into the model during training, RAG allows LLMs to query an external knowledge base at inference time. This gives the model access to up-to-date and domain-specific information. The retrieval step finds the most relevant document chunks using vector similarity search, then passes those chunks as context to the LLM. The LLM uses that context to produce a grounded, accurate answer. Poor chunking is the number one reason RAG systems fail in production.";

const CHUNK_COLORS = [
  "rgba(99,102,241,0.18)",
  "rgba(249,115,22,0.18)",
  "rgba(16,185,129,0.18)",
  "rgba(167,139,250,0.18)",
  "rgba(245,158,11,0.18)",
  "rgba(59,130,246,0.18)",
];

const OVERLAP_COLORS = [
  "rgba(99,102,241,0.35)",
  "rgba(249,115,22,0.35)",
  "rgba(16,185,129,0.35)",
  "rgba(167,139,250,0.35)",
  "rgba(245,158,11,0.35)",
  "rgba(59,130,246,0.35)",
];

function chunkText(text, chunkSize, overlap) {
  const words = text.split(" ");
  const chunks = [];
  let start = 0;
  const step = Math.max(1, chunkSize - overlap);

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push({ start, end, text: words.slice(start, end).join(" ") });
    if (end === words.length) break;
    start += step;
  }
  return chunks;
}

export default function ChunkingVisualizer() {
  const [chunkSize, setChunkSize] = useState(40);
  const [overlap, setOverlap]     = useState(8);

  // Clamp overlap so it's always < chunkSize
  const safeOverlap = Math.min(overlap, chunkSize - 1);

  const chunks = useMemo(
    () => chunkText(SAMPLE_TEXT, chunkSize, safeOverlap),
    [chunkSize, safeOverlap]
  );

  const words = SAMPLE_TEXT.split(" ");

  // Build a word → chunk-index map (last chunk that covers this word wins for colour)
  const wordChunk = new Array(words.length).fill(-1);
  const wordOverlap = new Array(words.length).fill(false);

  chunks.forEach((chunk, ci) => {
    for (let w = chunk.start; w < chunk.end; w++) {
      if (wordChunk[w] !== -1) {
        // This word appears in a previous chunk too → overlap!
        wordOverlap[w] = true;
      }
      wordChunk[w] = ci;
    }
  });

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>
        Adjust <strong style={{ color: "var(--text-primary)" }}>chunk size</strong> and{" "}
        <strong style={{ color: "var(--text-primary)" }}>overlap</strong> to see how the
        same paragraph gets split differently. Overlap zones are highlighted darker — they
        prevent context loss at chunk boundaries.
      </p>

      {/* Controls */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.25rem",
      }}>
        <div>
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
            <span>Chunk size (words)</span>
            <strong style={{ color: "var(--text-primary)" }}>{chunkSize}</strong>
          </label>
          <input type="range" min="10" max="80" value={chunkSize}
            onChange={e => setChunkSize(+e.target.value)}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
        <div>
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
            <span>Overlap (words)</span>
            <strong style={{ color: "var(--text-primary)" }}>{safeOverlap}</strong>
          </label>
          <input type="range" min="0" max={Math.floor(chunkSize * 0.7)} value={safeOverlap}
            onChange={e => setOverlap(+e.target.value)}
            style={{ width: "100%", accentColor: "#f97316" }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex",
        gap: "1.5rem",
        marginBottom: "1rem",
        fontSize: "0.82rem",
        color: "var(--text-tertiary)",
      }}>
        <span>📦 <strong style={{ color: "var(--text-primary)" }}>{chunks.length}</strong> chunks</span>
        <span>🔗 <strong style={{ color: "#f97316" }}>{safeOverlap}</strong> word overlap</span>
        <span>📏 Step size: <strong style={{ color: "var(--text-primary)" }}>{chunkSize - safeOverlap}</strong> words</span>
      </div>

      {/* Visualized text */}
      <div style={{
        padding: "1rem",
        background: "var(--bg-tertiary)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--glass-border)",
        lineHeight: 2,
        fontSize: "0.88rem",
        marginBottom: "1rem",
      }}>
        {words.map((word, i) => {
          const ci = wordChunk[i];
          const isOverlap = wordOverlap[i];
          const bg = ci === -1
            ? "transparent"
            : isOverlap
            ? OVERLAP_COLORS[ci % OVERLAP_COLORS.length]
            : CHUNK_COLORS[ci % CHUNK_COLORS.length];

          return (
            <span key={i}>
              <span style={{
                background: bg,
                borderRadius: "3px",
                padding: "0 2px",
                color: ci === -1 ? "var(--text-tertiary)" : "var(--text-primary)",
                transition: "background 0.3s",
              }}>
                {word}
              </span>{" "}
            </span>
          );
        })}
      </div>

      {/* Chunk list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {chunks.map((chunk, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            background: CHUNK_COLORS[i % CHUNK_COLORS.length],
            border: `1px solid ${OVERLAP_COLORS[i % OVERLAP_COLORS.length]}`,
            fontSize: "0.8rem",
          }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>
              Chunk {i + 1}
            </span>
            <span style={{ color: "var(--text-secondary)", flex: 1, lineHeight: 1.5 }}>
              {chunk.text.slice(0, 120)}{chunk.text.length > 120 ? "…" : ""}
            </span>
            <span style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>
              {chunk.end - chunk.start}w
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-sm)",
        background: "rgba(239,68,68,0.07)",
        borderLeft: "3px solid #ef4444",
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
      }}>
        <strong style={{ color: "#ef4444" }}>Production insight:</strong>{" "}
        The instructor said "poor chunking is the #1 reason RAG fails". Too large → retrieval
        noise; too small → lost context. Most production systems use 500–1,000 tokens with
        10–20% overlap and tune per document type.
      </div>
    </div>
  );
}
