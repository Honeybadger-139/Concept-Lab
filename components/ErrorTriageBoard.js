"use client";

import { useMemo, useState } from "react";

const INITIAL_BUCKETS = [
  { key: "pharma", label: "Pharma spam", count: 21, effort: 2 },
  { key: "phishing", label: "Phishing", count: 18, effort: 3 },
  { key: "routing", label: "Unusual routing", count: 7, effort: 4 },
  { key: "misspellings", label: "Misspellings", count: 3, effort: 4 },
];

function scoreImpact(count, effort) {
  return count / Math.max(1, effort);
}

export default function ErrorTriageBoard() {
  const [buckets, setBuckets] = useState(INITIAL_BUCKETS);
  const [sampleSize, setSampleSize] = useState(100);

  const summary = useMemo(() => {
    const total = buckets.reduce((acc, item) => acc + item.count, 0);
    const ranked = [...buckets]
      .map((item) => ({
        ...item,
        impact: scoreImpact(item.count, item.effort),
      }))
      .sort((a, b) => b.impact - a.impact);
    return { total, ranked };
  }, [buckets]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Error analysis helps us stop guessing. Instead of trying every idea, we quantify where failures concentrate and prioritize fixes by expected impact versus implementation effort.
      </p>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem", marginBottom: "0.8rem" }}>
        <label style={{ display: "block", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
          Reviewed validation failures: {sampleSize}
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={sampleSize}
            onChange={(event) => setSampleSize(Number(event.target.value))}
            style={{ width: "100%", marginTop: "0.24rem" }}
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Failure buckets
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {buckets.map((bucket, idx) => (
              <div key={bucket.key} style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", background: "var(--bg-secondary)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem", marginBottom: "0.3rem", fontSize: "0.79rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{bucket.label}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{bucket.count}</span>
                </div>
                <label style={{ display: "block", fontSize: "0.73rem", color: "var(--text-secondary)" }}>
                  Error count
                  <input
                    type="range"
                    min="0"
                    max={sampleSize}
                    step="1"
                    value={bucket.count}
                    onChange={(event) => {
                      const next = [...buckets];
                      next[idx] = { ...bucket, count: Number(event.target.value) };
                      setBuckets(next);
                    }}
                    style={{ width: "100%", marginTop: "0.2rem" }}
                  />
                </label>
                <label style={{ display: "block", fontSize: "0.73rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  Effort (1 low -{">"} 5 high)
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={bucket.effort}
                    onChange={(event) => {
                      const next = [...buckets];
                      next[idx] = { ...bucket, effort: Number(event.target.value) };
                      setBuckets(next);
                    }}
                    style={{ width: "100%", marginTop: "0.2rem" }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Priority queue</div>
          <p style={{ margin: "0 0 0.45rem", fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            Ranked by impact score = error_count / effort.
          </p>
          <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.55rem" }}>
            {summary.ranked.map((item) => (
              <div key={item.key} style={{ border: "1px solid rgba(148,163,184,0.2)", borderRadius: "10px", background: "rgba(15,23,42,0.8)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.79rem" }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{item.label}</span>
                  <span style={{ color: "#93c5fd" }}>score {item.impact.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: "0.74rem", color: "#cbd5e1", marginTop: "0.18rem" }}>
                  {item.count} of {summary.total} tagged failures, effort {item.effort}/5
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(16,185,129,0.1)", borderLeft: "3px solid #10b981", fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            First sprint recommendation: attack <strong style={{ color: "#f8fafc" }}>{summary.ranked[0].label}</strong>, then <strong style={{ color: "#f8fafc" }}>{summary.ranked[1].label}</strong>. This is usually better than solving an interesting but low-volume category.
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Data strategy link
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          Use this ranking to guide targeted data collection and augmentation. More data helps most when it is concentrated in high-impact failure slices, not spread blindly across already-solved cases.
        </p>
      </div>
    </div>
  );
}
