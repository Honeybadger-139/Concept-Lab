"use client";

import { useState } from "react";

export default function TokenCounter() {
    const [text, setText] = useState("");

    // Simple heuristic: 1 word ≈ 1.3 tokens
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const estimatedTokens = Math.ceil(wordCount * 1.3);

    return (
        <div style={{ padding: "1.5rem", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--glass-border)" }}>
            <h3>Token Counter (Heuristic)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Enter text below to see an approximate token count based on a common heuristic (Words * 1.3).
            </p>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your document or query here..."
                style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "1rem",
                    borderRadius: "6px",
                    border: "1px solid var(--glass-border)",
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    marginBottom: "1rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                }}
            />

            <div style={{ display: "flex", gap: "2rem", paddingTop: "0.5rem", borderTop: "1px solid var(--glass-border)" }}>
                <div>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Words</span>
                    <strong style={{ fontSize: "1.5rem" }}>{wordCount}</strong>
                </div>
                <div>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", color: "var(--primary)" }}>Estimated Tokens</span>
                    <strong style={{ fontSize: "1.5rem", color: "var(--primary)" }}>{estimatedTokens}</strong>
                </div>
            </div>
        </div>
    );
}
