"use client";

import { useState, useMemo } from "react";

// Mock 2D embeddings for "chunks"
const MOCK_CHUNKS = [
    { id: 1, text: "Machine learning algorithms", x: 20, y: 70 },
    { id: 2, text: "Vector databases store embeddings", x: 80, y: 85 },
    { id: 3, text: "Cats are great pets", x: 15, y: 20 },
    { id: 4, text: "Dogs bark at strangers", x: 25, y: 15 },
    { id: 5, text: "Neural networks process data", x: 30, y: 80 },
    { id: 6, text: "SQL databases use tables", x: 85, y: 50 },
    { id: 7, text: "RAG retrieves context for LLMs", x: 70, y: 90 },
    { id: 8, text: "Baking a chocolate cake", x: 80, y: 15 },
    { id: 9, text: "Quantum computing is complex", x: 50, y: 50 },
    { id: 10, text: "Embeddings represent semantics", x: 65, y: 80 },
];

export default function VectorSearchVisualizer() {
    const [queryX, setQueryX] = useState(50);
    const [queryY, setQueryY] = useState(50);
    const [k, setK] = useState(3);

    // Calculate distances and find top-k
    const nearestChunks = useMemo(() => {
        return MOCK_CHUNKS.map((chunk) => {
            const dx = chunk.x - queryX;
            const dy = chunk.y - queryY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return { ...chunk, dist };
        })
            .sort((a, b) => a.dist - b.dist)
            .slice(0, k);
    }, [queryX, queryY, k]);

    const nearestIds = new Set(nearestChunks.map((c) => c.id));

    return (
        <div style={{ padding: "1.5rem", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--glass-border)" }}>
            <h3>Vector Search Space</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Drag the sliders to move the query point (red). The visualization retrieves the top <strong>{k}</strong> nearest chunks based on Euclidean distance in a simple 2D space.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>
                {/* SVG Visualization */}
                <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", border: "1px solid var(--glass-border)", borderRadius: "6px", background: "var(--background)", overflow: "hidden" }}>
                    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                        {/* Grid lines */}
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />

                        {/* Chunks */}
                        {MOCK_CHUNKS.map((chunk) => {
                            const isNearest = nearestIds.has(chunk.id);
                            return (
                                <g key={chunk.id} transform={`translate(${chunk.x}, ${100 - chunk.y})`}>
                                    {/* Connect nearest points to query */}
                                    {isNearest && (
                                        <line
                                            x1="0"
                                            y1="0"
                                            x2={queryX - chunk.x}
                                            y2={-(queryY - chunk.y)}
                                            stroke="var(--primary)"
                                            strokeWidth="0.5"
                                            strokeDasharray="2,2"
                                            opacity="0.5"
                                        />
                                    )}
                                    <circle
                                        r={isNearest ? "2.5" : "1.5"}
                                        fill={isNearest ? "var(--primary)" : "var(--text-secondary)"}
                                        opacity={isNearest ? 1 : 0.6}
                                        style={{ transition: "all 0.3s ease" }}
                                    />
                                    {isNearest && (
                                        <text
                                            x="4"
                                            y="-4"
                                            fontSize="3"
                                            fill="var(--text-primary)"
                                            style={{ pointerEvents: "none" }}
                                        >
                                            {chunk.text.substring(0, 15)}...
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Query Point */}
                        <g transform={`translate(${queryX}, ${100 - queryY})`}>
                            <circle r="3" fill="#ff4d4f" />
                            <text x="5" y="-5" fontSize="3.5" fill="#ff4d4f" fontWeight="bold">Query</text>
                        </g>
                    </svg>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                            Query X-axis (Topic): {queryX}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={queryX}
                            onChange={(e) => setQueryX(parseInt(e.target.value))}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                            Query Y-axis (Tone): {queryY}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={queryY}
                            onChange={(e) => setQueryY(parseInt(e.target.value))}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                            k (Nearest Neighbors): {k}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={k}
                            onChange={(e) => setK(parseInt(e.target.value))}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "6px", background: "var(--background)", border: "1px solid var(--glass-border)" }}>
                        <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0", color: "var(--text-secondary)" }}>Retrieved Chunks</h4>
                        <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {nearestChunks.map((c) => (
                                <li key={c.id}>
                                    {c.text} <span style={{ color: "var(--text-secondary)" }}>({c.dist.toFixed(1)})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
