"use client";

import { useState } from "react";

export default function CosineSimilarityDemo() {
    // Vector angles in degrees
    const [angleA, setAngleA] = useState(45);
    const [angleB, setAngleB] = useState(45);

    // Convert to radians for math
    const radA = (angleA * Math.PI) / 180;
    const radB = (angleB * Math.PI) / 180;

    // Assume unit vectors (magnitude 1) for pure cosine similarity
    // Endpoints on a coordinate system from -1 to 1 (mapped to 0-100 for SVG)
    // Center is at 50,50. Radius of unit circle is 40.
    const cx = 50;
    const cy = 50;
    const r = 40;

    const ax = cx + Math.cos(radA) * r;
    const ay = cy - Math.sin(radA) * r; // Invert Y as SVG goes down

    const bx = cx + Math.cos(radB) * r;
    const by = cy - Math.sin(radB) * r;

    // Cosine Similarity = cos(theta) where theta is difference between angles
    const diffAngle = Math.abs(angleA - angleB);
    const diffRad = (diffAngle * Math.PI) / 180;
    const cosineSim = Math.cos(diffRad);

    return (
        <div style={{ padding: "1.5rem", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--glass-border)" }}>
            <h3>Interactive Cosine Similarity</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Adjust the angles of Vector A and Vector B to see how cosine similarity changes based purely on direction.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: "2rem", alignItems: "center" }}>
                {/* SVG Plot */}
                <div style={{ width: "100%", aspectRatio: "1/1", position: "relative", border: "1px solid var(--glass-border)", borderRadius: "6px", background: "var(--background)", overflow: "hidden" }}>
                    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                        {/* Grid & Axes */}
                        <pattern id="grid-cs" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid-cs)" />

                        <line x1="0" y1="50" x2="100" y2="50" stroke="var(--text-secondary)" strokeWidth="0.5" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="var(--text-secondary)" strokeWidth="0.5" />

                        {/* Unit Circle */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="2,2" />

                        {/* Vector A */}
                        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowA)" />
                        {/* Vector B */}
                        <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowB)" />

                        {/* Markers */}
                        <defs>
                            <marker id="arrowA" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#3b82f6" />
                            </marker>
                            <marker id="arrowB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
                            </marker>
                        </defs>

                        {/* Labels */}
                        <text x={ax + (ax > cx ? 2 : -6)} y={ay + (ay > cy ? 5 : -2)} fontSize="5" fill="#3b82f6" fontWeight="bold">A</text>
                        <text x={bx + (bx > cx ? 2 : -6)} y={by + (by > cy ? 5 : -2)} fontSize="5" fill="#10b981" fontWeight="bold">B</text>
                    </svg>
                </div>

                {/* Controls and Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                    <div style={{ textAlign: "center", padding: "1.5rem", borderRadius: "8px", background: "var(--background)", border: "1px solid var(--glass-border)" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Cosine Similarity</span>
                        <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: cosineSim > 0.8 ? "var(--primary)" : cosineSim < 0 ? "#ef4444" : "var(--text-primary)" }}>
                            {cosineSim.toFixed(3)}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            Angle Diff: {diffAngle % 360}°
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div>
                            <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#3b82f6", fontWeight: "bold" }}>
                                <span>Vector A Angle</span>
                                <span>{angleA}°</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={angleA}
                                onChange={(e) => setAngleA(parseInt(e.target.value))}
                                style={{ width: "100%", accentColor: "#3b82f6" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#10b981", fontWeight: "bold" }}>
                                <span>Vector B Angle</span>
                                <span>{angleB}°</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={angleB}
                                onChange={(e) => setAngleB(parseInt(e.target.value))}
                                style={{ width: "100%", accentColor: "#10b981" }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
