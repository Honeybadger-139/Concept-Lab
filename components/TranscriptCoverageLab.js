"use client";

import { useMemo, useState } from "react";

export default function TranscriptCoverageLab({ node }) {
  const points = useMemo(() => {
    const coverage = Array.isArray(node?.transcriptCoverage) ? node.transcriptCoverage : [];
    return coverage;
  }, [node]);

  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState({});

  const filtered = useMemo(() => {
    if (!query.trim()) return points;
    const q = query.toLowerCase();
    return points.filter((line) => String(line).toLowerCase().includes(q));
  }, [points, query]);

  const coveredCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search coverage points..."
          style={{
            flex: "1 1 280px",
            minWidth: 220,
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "8px 10px",
            background: "rgba(15,23,42,0.35)",
            color: "inherit",
          }}
        />
        <span style={{ fontSize: 13, opacity: 0.86 }}>
          Covered: {coveredCount} / {points.length}
        </span>
      </div>
      <div style={{ display: "grid", gap: 8, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
        {filtered.map((line, index) => {
          const key = `${index}-${line.slice(0, 24)}`;
          const isChecked = Boolean(checked[key]);
          return (
            <label
              key={key}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr",
                gap: 8,
                alignItems: "start",
                border: "1px solid rgba(148,163,184,0.25)",
                borderRadius: 8,
                padding: "8px 10px",
                background: isChecked ? "rgba(16,185,129,0.12)" : "rgba(15,23,42,0.22)",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(event) =>
                  setChecked((prev) => ({
                    ...prev,
                    [key]: event.target.checked,
                  }))
                }
              />
              <span style={{ fontSize: 14, lineHeight: 1.45 }}>{line}</span>
            </label>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ margin: 0, opacity: 0.75 }}>No coverage points matched this filter.</p>
        )}
      </div>
    </div>
  );
}
