"use client";
import { useState, useEffect, useRef } from "react";

const ORIGINAL = "What are the health benefits of green tea?";

const VARIANTS = [
  { q: "How does green tea improve physical health?", color: "#d97706" },
  { q: "What nutrients and antioxidants are found in green tea?", color: "#8b5cf6" },
  { q: "Can green tea reduce disease risk or inflammation?", color: "#fbbf24" },
];

const RESULTS = [
  // [query_index, doc_id, similarity, snippet]
  [0, "A", 0.91, "Green tea contains EGCG which boosts metabolism and fat oxidation…"],
  [0, "B", 0.87, "Studies show regular green tea consumption lowers LDL cholesterol…"],
  [1, "C", 0.93, "Catechins and polyphenols in green tea act as powerful antioxidants…"],
  [1, "A", 0.82, "Green tea contains theanine that reduces stress hormones…"],
  [2, "D", 0.89, "Anti-inflammatory properties of EGCG help reduce chronic inflammation…"],
  [2, "B", 0.84, "Green tea polyphenols reduce risk of cardiovascular disease by 20%…"],
  [0, "E", 0.78, "Regular green tea drinkers show improved insulin sensitivity…"],
  [1, "D", 0.77, "Fluoride in green tea promotes dental health and prevents cavities…"],
  [2, "E", 0.81, "Green tea extract shown to reduce tumour growth markers in studies…"],
];

// Deduplicated final set by doc_id (keep highest similarity)
const FINAL = Object.values(
  RESULTS.reduce((acc, r) => {
    if (!acc[r[1]] || acc[r[1]][2] < r[2]) acc[r[1]] = r;
    return acc;
  }, {})
).sort((a, b) => b[2] - a[2]);

const STAGES = ["original", "variants", "retrieve", "merge", "answer"];

export default function MultiQueryRAGViz() {
  const [stage, setStage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const advance = () => setStage(s => Math.min(s + 1, STAGES.length - 1));
  const autoPlay = () => {
    setStage(0); setAnimating(true);
    let i = 0;
    const tick = () => {
      i++;
      setStage(i);
      if (i < STAGES.length - 1) timerRef.current = setTimeout(tick, 900);
      else setAnimating(false);
    };
    timerRef.current = setTimeout(tick, 400);
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const stageIdx = STAGES.indexOf(STAGES[stage]);

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {STAGES.map((s, i) => (
          <div key={s} onClick={() => setStage(i)} style={{ flex: 1, height: 4, borderRadius: 4, cursor: "pointer", background: i <= stage ? "#d97706" : "rgba(255,255,255,0.1)", transition: "background .3s" }} />
        ))}
      </div>

      {/* Stage 0: Original query */}
      <div style={{ opacity: stage >= 0 ? 1 : 0, transition: "opacity .4s", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Original User Query</div>
        <div style={{ background: "rgba(217, 119, 6,0.15)", border: "1.5px solid #d97706", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#a5b4fc", fontStyle: "italic" }}>
          "{ORIGINAL}"
        </div>
      </div>

      {/* Stage 1: LLM generates variants */}
      {stage >= 1 && (
        <div style={{ marginBottom: 14, animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            🤖 LLM generates {VARIANTS.length} query variants
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {VARIANTS.map((v, i) => (
              <div key={i} style={{ background: `${v.color}14`, border: `1.5px solid ${v.color}55`, borderRadius: 8, padding: "9px 14px", fontSize: 13, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: v.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>Q{i + 1}</span>
                "{v.q}"
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Each variant targets a different semantic angle of the original question.</div>
        </div>
      )}

      {/* Stage 2: Retrieval results */}
      {stage >= 2 && (
        <div style={{ marginBottom: 14, animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            🔍 Each query retrieves top-3 chunks ({RESULTS.length} total, including duplicates)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 180, overflowY: "auto" }}>
            {RESULTS.map(([qi, docId, sim, snippet], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 7, fontSize: 12 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: VARIANTS[qi].color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>Q{qi + 1}</span>
                <span style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 5px", fontSize: 11, color: "#a5b4fc", flexShrink: 0 }}>Doc {docId}</span>
                <span style={{ color: "#22d3ee", fontFamily: "monospace", flexShrink: 0 }}>{sim.toFixed(2)}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{snippet}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 3: Merge & dedup */}
      {stage >= 3 && (
        <div style={{ marginBottom: 14, animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            🔗 Merge + deduplicate → {FINAL.length} unique chunks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {FINAL.map(([qi, docId, sim, snippet], i) => (
              <div key={docId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 7, fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: "#10b981", flexShrink: 0 }}>#{i + 1}</span>
                <span style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 5px", fontSize: 11, color: "#a5b4fc", flexShrink: 0 }}>Doc {docId}</span>
                <span style={{ color: "#22d3ee", fontFamily: "monospace", flexShrink: 0 }}>sim={sim.toFixed(2)}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{snippet}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 4: Final answer */}
      {stage >= 4 && (
        <div style={{ marginBottom: 14, animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>✅ Final grounded answer</div>
          <div style={{ background: "rgba(34,211,238,0.08)", border: "1.5px solid rgba(34,211,238,0.35)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#e2e8f0", lineHeight: 1.7 }}>
            Green tea offers multiple health benefits: its antioxidants (EGCG, catechins) reduce inflammation, lower LDL cholesterol, and improve metabolism. Regular consumption is linked to reduced cardiovascular disease risk and better insulin sensitivity.
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(34,211,238,0.6)" }}>Sourced from: Docs A, B, C, D, E — all retrieved via multi-query expansion</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button onClick={autoPlay} disabled={animating}
          style={{ flex: 1, background: animating ? "rgba(255,255,255,0.05)" : "rgba(217, 119, 6,0.25)", border: `1.5px solid ${animating ? "rgba(255,255,255,0.1)" : "#d97706"}`, color: "#fff", borderRadius: 8, padding: "8px 0", cursor: animating ? "default" : "pointer", fontSize: 14, fontWeight: 700, opacity: animating ? 0.5 : 1 }}>
          ▶ Auto-play
        </button>
        <button onClick={advance} disabled={stage >= STAGES.length - 1}
          style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: stage >= STAGES.length - 1 ? "default" : "pointer", fontSize: 14, opacity: stage >= STAGES.length - 1 ? 0.4 : 1 }}>
          Next →
        </button>
        <button onClick={() => setStage(0)}
          style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14 }}>
          ↺
        </button>
      </div>

      <div style={{ marginTop: 12, background: "rgba(217, 119, 6,0.08)", border: "1px solid rgba(217, 119, 6,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
        <strong style={{ color: "#a5b4fc" }}>Why it works:</strong> A single query may miss relevant chunks due to vocabulary mismatch.
        Multi-query expands coverage at the cost of {VARIANTS.length}× more embedding calls and LLM tokens. Use when recall is critical and latency allows.
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
