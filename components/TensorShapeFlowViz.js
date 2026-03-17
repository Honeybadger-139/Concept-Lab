"use client";

import { useMemo, useState } from "react";

const MODES = {
  vectorization: {
    title: "Vectorization",
    summary: "Replace a neuron-by-neuron for-loop with one matrix multiplication so the hardware can execute the whole layer in parallel.",
    equations: [
      "A_in shape = (batch_size, n_in)",
      "W shape = (n_in, n_units)",
      "Z = A_in x W + B",
      "A_out = g(Z)",
    ],
  },
  shapes: {
    title: "Matrix Shape Rules",
    summary: "Inner dimensions must match because each output cell is a dot product between a row and a column of the same length.",
    equations: [
      "A shape = (m, n)",
      "W shape = (n, k)",
      "Z shape = (m, k)",
      "Z[i,j] = row_i(A) dot col_j(W)",
    ],
  },
  code: {
    title: "Code Mapping",
    summary: "NumPy and TensorFlow express the same math compactly with matmul or the @ operator; the key is understanding the shape contract before you run it.",
    equations: [
      "AT = A.T",
      "Z = np.matmul(AT, W) + B",
      "Z = AT @ W + B",
      "A_out = sigmoid(Z)",
    ],
  },
};

const EXAMPLES = {
  vectorization: {
    batch: 64,
    nIn: 128,
    nUnits: 1000,
    note: "One matmul computes all 64,000 pre-activations instead of iterating in Python over every example-neuron pair.",
  },
  shapes: {
    batch: 32,
    nIn: 64,
    nUnits: 25,
    note: "The output has the outer dimensions: 32 examples by 25 neurons.",
  },
  code: {
    batch: 1,
    nIn: 2,
    nUnits: 3,
    note: "This mirrors the course example where one row vector is multiplied by a 2 x 3 weight matrix to produce three activations at once.",
  },
};

export default function TensorShapeFlowViz() {
  const [mode, setMode] = useState("vectorization");
  const [batch, setBatch] = useState(EXAMPLES.vectorization.batch);
  const [nIn, setNIn] = useState(EXAMPLES.vectorization.nIn);
  const [nUnits, setNUnits] = useState(EXAMPLES.vectorization.nUnits);

  const data = MODES[mode];

  const outputShape = useMemo(() => {
    return `(${batch}, ${nUnits})`;
  }, [batch, nUnits]);

  const workload = useMemo(() => {
    return batch * nUnits;
  }, [batch, nUnits]);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Use this visual to see why matrix multiplication is the implementation backbone of dense neural-network layers: shape contracts, vectorization, and code all collapse into the same forward-pass pattern.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.8rem" }}>
        {Object.entries(MODES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setMode(key);
              setBatch(EXAMPLES[key].batch);
              setNIn(EXAMPLES[key].nIn);
              setNUnits(EXAMPLES[key].nUnits);
            }}
            style={{
              borderRadius: "999px",
              border: mode === key ? "1px solid #3b82f6" : "1px solid var(--glass-border)",
              background: mode === key ? "rgba(59,130,246,0.14)" : "var(--bg-tertiary)",
              color: mode === key ? "#93c5fd" : "var(--text-secondary)",
              padding: "0.35rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {value.title}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "#09111d", padding: "0.85rem", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.88rem", color: "#f8fafc", fontWeight: 700, marginBottom: "0.25rem" }}>{data.title}</div>
        <p style={{ margin: "0 0 0.55rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>{data.summary}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.45rem" }}>
          {data.equations.map((line) => (
            <div key={line} style={{ borderRadius: "10px", border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.08)", padding: "0.5rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#bfdbfe" }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start", marginBottom: "0.8rem" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Shape controls
          </div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Batch size: {batch}
            <input type="range" min="1" max="128" step="1" value={batch} onChange={(event) => setBatch(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.55rem" }}>
            Input width: {nIn}
            <input type="range" min="2" max="256" step="2" value={nIn} onChange={(event) => setNIn(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Units in layer: {nUnits}
            <input type="range" min="2" max="1000" step="1" value={nUnits} onChange={(event) => setNUnits(Number(event.target.value))} style={{ width: "100%", marginTop: "0.22rem" }} />
          </label>
        </div>

        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.4rem" }}>
            Derived shapes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <div style={{ borderRadius: "10px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", padding: "0.55rem 0.65rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#93c5fd", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Input matrix</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>(batch, n_in) = ({batch}, {nIn})</div>
            </div>
            <div style={{ borderRadius: "10px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", padding: "0.55rem 0.65rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#7dd3fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Weight matrix</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>(n_in, n_units) = ({nIn}, {nUnits})</div>
            </div>
            <div style={{ borderRadius: "10px", background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.25)", padding: "0.55rem 0.65rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#5eead4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Output matrix</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{outputShape}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "start" }}>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Throughput intuition
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            This configuration computes {workload.toLocaleString()} pre-activations in one matmul. That is why GPUs matter: the computation is expressed as one large parallelizable kernel instead of a Python loop over examples and neurons.
          </p>
        </div>
        <div style={{ border: "1px solid var(--glass-border)", borderRadius: "12px", background: "var(--bg-tertiary)", padding: "0.8rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: "0.35rem" }}>
            Teaching note
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {EXAMPLES[mode].note}
          </p>
        </div>
      </div>
    </div>
  );
}
