"use client";

import { useMemo, useState } from "react";

const RISKS = [
  { key: "representation", label: "Representation skew", severity: 4, likelihood: 3 },
  { key: "threshold", label: "Threshold disparity", severity: 5, likelihood: 2 },
  { key: "monitoring", label: "No subgroup monitoring", severity: 4, likelihood: 4 },
  { key: "feedback", label: "No escalation channel", severity: 3, likelihood: 3 },
];

function score(item) {
  return item.severity * item.likelihood;
}

export default function FairnessRiskMatrixLab() {
  const [items, setItems] = useState(RISKS);

  const ranked = useMemo(() => {
    return [...items]
      .map((item) => ({ ...item, riskScore: score(item) }))
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [items]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
        Ethical risk work is engineering work. We identify potential harms, estimate impact and likelihood, then build mitigation and monitoring before launch instead of waiting for incidents.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Risk scoring inputs
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {items.map((item, idx) => (
              <div key={item.key} style={{ borderRadius: "10px", border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", padding: "0.55rem 0.65rem" }}>
                <div style={{ fontSize: "0.79rem", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.22rem" }}>{item.label}</div>
                <label style={{ display: "block", fontSize: "0.73rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                  Severity: {item.severity}
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={item.severity}
                    onChange={(event) => {
                      const next = [...items];
                      next[idx] = { ...item, severity: Number(event.target.value) };
                      setItems(next);
                    }}
                    style={{ width: "100%", marginTop: "0.18rem" }}
                  />
                </label>
                <label style={{ display: "block", fontSize: "0.73rem", color: "var(--text-secondary)" }}>
                  Likelihood: {item.likelihood}
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={item.likelihood}
                    onChange={(event) => {
                      const next = [...items];
                      next[idx] = { ...item, likelihood: Number(event.target.value) };
                      setItems(next);
                    }}
                    style={{ width: "100%", marginTop: "0.18rem" }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem" }}>
          <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.3rem" }}>Mitigation priority</div>
          <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.55rem" }}>
            {ranked.map((item) => (
              <div key={item.key} style={{ borderRadius: "10px", border: "1px solid rgba(148,163,184,0.2)", background: "rgba(15,23,42,0.8)", padding: "0.55rem 0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", fontSize: "0.79rem" }}>
                  <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{item.label}</span>
                  <span style={{ color: "#fda4af" }}>risk {item.riskScore}</span>
                </div>
                <div style={{ marginTop: "0.2rem", fontSize: "0.74rem", color: "#cbd5e1" }}>
                  severity {item.severity}/5, likelihood {item.likelihood}/5
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0.55rem 0.65rem", borderRadius: "10px", background: "rgba(239,68,68,0.12)", borderLeft: "3px solid #ef4444", fontSize: "0.79rem", color: "#fecaca", lineHeight: 1.5 }}>
            Highest-priority mitigation now: <strong style={{ color: "#fff1f2" }}>{ranked[0].label}</strong>. Define the prevention check and a post-launch monitoring trigger before release.
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
          Governance rule
        </div>
        <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          <li>Risk review should be cross-functional and done before launch.</li>
          <li>Subgroup-aware evaluation metrics should be tracked continuously, not once.</li>
          <li>Mitigation and rollback triggers should be defined in advance, not during crisis response.</li>
        </ul>
      </div>
    </div>
  );
}
