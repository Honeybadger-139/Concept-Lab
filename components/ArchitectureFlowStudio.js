"use client";

import { useMemo, useState } from "react";

function moveItem(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function ArchitectureFlowStudio({ node }) {
  const baseSteps = useMemo(() => {
    const steps = Array.isArray(node?.architectureFlow?.steps) ? node.architectureFlow.steps : [];
    if (steps.length > 0) return steps;
    return [
      "Define objective",
      "Prepare inputs/state",
      "Run core logic",
      "Evaluate output quality",
      "Close feedback loop",
    ];
  }, [node]);

  const [order, setOrder] = useState(baseSteps);
  const [dragIndex, setDragIndex] = useState(null);
  const canonical = baseSteps.join("||");
  const current = order.join("||");
  const isCorrect = canonical === current;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0, opacity: 0.88 }}>
        Drag to reorder the architecture flow for <strong>{node?.title}</strong>. This is designed as an interview rehearsal for explaining end-to-end execution.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {order.map((step, index) => (
          <div
            key={`${step}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex === null || dragIndex === index) return;
              setOrder((prev) => moveItem(prev, dragIndex, index));
              setDragIndex(null);
            }}
            style={{
              border: "1px solid rgba(148,163,184,0.4)",
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(15,23,42,0.35)",
              cursor: "grab",
            }}
          >
            <strong style={{ marginRight: 8 }}>{index + 1}.</strong>
            <span>{step}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, opacity: 0.86 }}>
        {isCorrect
          ? "Flow order matches canonical architecture sequence."
          : "Reorder until the flow reflects a coherent production execution path."}
      </div>
    </div>
  );
}

