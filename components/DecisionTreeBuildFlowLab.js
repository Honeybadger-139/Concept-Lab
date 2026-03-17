"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const NODE_BLUEPRINT = [
  { id: "root", label: "Root", depth: 0, size: 10, p1: 0.5, gain: 0.28, split: "ear shape" },
  { id: "left", label: "Left branch", depth: 1, size: 5, p1: 0.8, gain: 0.32, split: "face shape" },
  { id: "right", label: "Right branch", depth: 1, size: 5, p1: 0.2, gain: 0.35, split: "whiskers" },
  { id: "left-left", label: "Left-left", depth: 2, size: 4, p1: 1.0, gain: 0.0, split: null },
  { id: "left-right", label: "Left-right", depth: 2, size: 1, p1: 0.0, gain: 0.0, split: null },
  { id: "right-left", label: "Right-left", depth: 2, size: 1, p1: 1.0, gain: 0.0, split: null },
  { id: "right-right", label: "Right-right", depth: 2, size: 4, p1: 0.0, gain: 0.0, split: null },
];

function nodeStatus(node, maxDepth, minGain, minSamples) {
  if (node.p1 === 0 || node.p1 === 1) return { type: "leaf", reason: "pure node" };
  if (node.depth >= maxDepth) return { type: "leaf", reason: "max depth reached" };
  if (node.size < minSamples) return { type: "leaf", reason: "too few examples" };
  if (node.gain < minGain) return { type: "leaf", reason: "gain below threshold" };
  return { type: "split", reason: `split on ${node.split}` };
}

export default function DecisionTreeBuildFlowLab() {
  const [maxDepth, setMaxDepth] = useState(3);
  const [minGain, setMinGain] = useState(0.05);
  const [minSamples, setMinSamples] = useState(1);
  const t = useChartTheme();

  const evaluated = useMemo(
    () =>
      NODE_BLUEPRINT.map((node) => ({
        ...node,
        status: nodeStatus(node, maxDepth, minGain, minSamples),
      })),
    [maxDepth, minGain, minSamples]
  );

  if (!t) return <div style={{ height: 320 }} />;

  const splitCount = evaluated.filter((node) => node.status.type === "split").length;
  const leafCount = evaluated.length - splitCount;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.55 }}>
        Build logic is recursive: pick the best split, branch the data, and repeat until a stopping rule says this node should become a leaf.
      </p>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, background: t.bg, padding: "0.85rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            Max depth: {maxDepth}
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={maxDepth}
              onChange={(event) => setMaxDepth(Number(event.target.value))}
              style={{ width: "100%", marginTop: 4, accentColor: "#38bdf8" }}
            />
          </label>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            Minimum gain: {minGain.toFixed(2)}
            <input
              type="range"
              min={0}
              max={0.4}
              step={0.01}
              value={minGain}
              onChange={(event) => setMinGain(Number(event.target.value))}
              style={{ width: "100%", marginTop: 4, accentColor: "#22c55e" }}
            />
          </label>
          <label style={{ fontSize: "0.75rem", color: t.muted2 }}>
            Minimum samples: {minSamples}
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={minSamples}
              onChange={(event) => setMinSamples(Number(event.target.value))}
              style={{ width: "100%", marginTop: 4, accentColor: "#f97316" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 999, background: t.surface2, padding: "0.3rem 0.62rem", fontSize: "0.74rem", color: t.muted2 }}>
            Split nodes: <b style={{ color: "#22c55e" }}>{splitCount}</b>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 999, background: t.surface2, padding: "0.3rem 0.62rem", fontSize: "0.74rem", color: t.muted2 }}>
            Leaf nodes: <b style={{ color: "#f97316" }}>{leafCount}</b>
          </div>
        </div>

        <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
          {evaluated.map((node) => {
            const isSplit = node.status.type === "split";
            return (
              <div
                key={node.id}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${isSplit ? "rgba(34,197,94,0.35)" : "rgba(249,115,22,0.35)"}`,
                  background: isSplit ? "rgba(34,197,94,0.08)" : "rgba(249,115,22,0.08)",
                  padding: "0.66rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.labelMid }}>
                    {node.label} (depth {node.depth})
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: t.tick }}>
                    size {node.size} | p1 {node.p1.toFixed(2)} | gain {node.gain.toFixed(2)}
                  </div>
                </div>
                <div style={{ marginTop: 4, fontSize: "0.74rem", color: isSplit ? "#22c55e" : "#f97316" }}>
                  {isSplit ? "Split" : "Leaf"}: {node.status.reason}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "0.75rem", fontSize: "0.74rem", color: t.muted3 }}>
          This is the same repeated routine used in full decision-tree training: evaluate node, decide split versus stop, recurse on child subsets.
        </div>
      </div>
    </div>
  );
}

