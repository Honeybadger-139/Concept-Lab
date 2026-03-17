"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const CATEGORIES = ["pointy", "floppy", "oval"];
const SAMPLE_ROWS = [
  { id: "pet-01", ear: "pointy", faceRound: 1, whiskers: 1, label: "cat" },
  { id: "pet-02", ear: "oval", faceRound: 0, whiskers: 1, label: "cat" },
  { id: "pet-03", ear: "floppy", faceRound: 0, whiskers: 0, label: "not cat" },
  { id: "pet-04", ear: "pointy", faceRound: 1, whiskers: 0, label: "cat" },
];

function encodeEar(ear) {
  return CATEGORIES.map((c) => (c === ear ? 1 : 0));
}

export default function OneHotEncodingLab() {
  const [selected, setSelected] = useState("oval");
  const t = useChartTheme();

  const encoded = useMemo(() => encodeEar(selected), [selected]);

  if (!t) return <div style={{ height: 280 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        One-hot encoding converts one categorical feature with multiple values into multiple binary features that models can consume directly.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.85rem" }}>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {CATEGORIES.map((category) => {
            const active = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${active ? "#22c55e" : t.btnBorder}`,
                  background: active ? "rgba(34,197,94,0.14)" : t.btnBg,
                  color: active ? "#22c55e" : t.btnText,
                  padding: "0.34rem 0.65rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.72rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Selected category</div>
            <div style={{ marginTop: 3, fontSize: "0.9rem", color: t.labelMid, fontWeight: 700, textTransform: "capitalize" }}>{selected}</div>
            <div style={{ marginTop: 8, fontSize: "0.76rem", color: t.muted2 }}>Encoded vector [pointy, floppy, oval]</div>
            <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: "1rem", color: "#38bdf8" }}>[{encoded.join(", ")}]</div>
          </div>

          <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.surface2, padding: "0.72rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2 }}>Why one-hot helps</div>
            <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: t.muted3, fontSize: "0.74rem", lineHeight: 1.5 }}>
              <li>Avoids fake numeric ordering between categories.</li>
              <li>Works for trees, logistic regression, and neural networks.</li>
              <li>Keeps each category interpretable as a binary indicator.</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "0.8rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.73rem" }}>
            <thead>
              <tr style={{ color: t.muted2 }}>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>Example</th>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>Ear</th>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>One-hot [p,f,o]</th>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>Face round</th>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>Whiskers</th>
                <th style={{ textAlign: "left", padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>Label</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>{row.id}</td>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}`, textTransform: "capitalize" }}>{row.ear}</td>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}`, fontFamily: "monospace" }}>
                    [{encodeEar(row.ear).join(", ")}]
                  </td>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>{row.faceRound}</td>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>{row.whiskers}</td>
                  <td style={{ padding: "0.38rem", borderBottom: `1px solid ${t.border}` }}>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

