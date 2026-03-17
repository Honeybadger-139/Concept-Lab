"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/hooks/useChartTheme";

const STRATEGIES = [
  {
    id: "fixed",
    label: "Fixed windows",
    short: "Uniform token windows",
    note: "Fast to build and easy to scale, but it can split important ideas across arbitrary boundaries.",
    color: "#38bdf8",
  },
  {
    id: "semantic",
    label: "Semantic sections",
    short: "Respect meaning boundaries",
    note: "Better citation clarity and retrieval precision because chunks follow topic boundaries.",
    color: "#22c55e",
  },
  {
    id: "agentic",
    label: "Agentic evidence packs",
    short: "Task-aware evidence assembly",
    note: "Best when the answer spans distant sections, but orchestration and token cost go up.",
    color: "#f97316",
  },
];

const QUERIES = [
  {
    id: "lookup",
    label: "Exact lookup",
    ideal: 320,
    summary: "A user wants one policy fact quickly.",
    question: "What is the refund window for annual plans?",
  },
  {
    id: "boundary",
    label: "Boundary-sensitive answer",
    ideal: 420,
    summary: "The answer sits near a section boundary and can be split badly.",
    question: "How do escalation rules differ from the SLA promises?",
  },
  {
    id: "multihop",
    label: "Multi-hop synthesis",
    ideal: 560,
    summary: "The answer needs evidence from distant parts of the document.",
    question: "Which plan fits a regulated healthcare team that also needs migration support?",
  },
];

const DOCUMENT_SEGMENTS = [
  { id: "intro", label: "Product intro", topic: "overview", tokens: 150 },
  { id: "pricing", label: "Pricing tiers", topic: "pricing", tokens: 220 },
  { id: "refund", label: "Refund policy", topic: "policy", tokens: 140 },
  { id: "sla", label: "SLA commitments", topic: "operations", tokens: 210 },
  { id: "escalation", label: "Escalation path", topic: "operations", tokens: 120 },
  { id: "security", label: "Security controls", topic: "security", tokens: 240 },
  { id: "compliance", label: "Compliance scope", topic: "security", tokens: 190 },
  { id: "migration", label: "Migration support", topic: "services", tokens: 180 },
];

const TOPIC_COLORS = {
  overview: "#64748b",
  pricing: "#38bdf8",
  policy: "#facc15",
  operations: "#a855f7",
  security: "#22c55e",
  services: "#f97316",
};

const QUERY_TOPIC_WEIGHTS = {
  lookup: { policy: 1, pricing: 0.25, operations: 0.1, security: 0.05, services: 0.05, overview: 0.05 },
  boundary: { operations: 1, policy: 0.15, pricing: 0.1, security: 0.05, services: 0.1, overview: 0.05 },
  multihop: { pricing: 0.7, security: 1, services: 0.8, operations: 0.2, policy: 0.05, overview: 0.05 },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function segmentOffsets() {
  let cursor = 0;
  return DOCUMENT_SEGMENTS.map((segment) => {
    const start = cursor;
    const end = cursor + segment.tokens;
    cursor = end;
    return { ...segment, start, end };
  });
}

const OFFSETS = segmentOffsets();
const TOTAL_TOKENS = OFFSETS[OFFSETS.length - 1].end;

function coveredSegments(start, end) {
  return OFFSETS.filter((segment) => segment.start < end && segment.end > start);
}

function topicDistribution(segments) {
  const totals = {};
  segments.forEach((segment) => {
    totals[segment.topic] = (totals[segment.topic] || 0) + segment.tokens;
  });
  return totals;
}

function buildFixedChunks(chunkSize, overlapPct) {
  const overlapTokens = Math.round((chunkSize * overlapPct) / 100);
  const step = Math.max(80, chunkSize - overlapTokens);
  const chunks = [];
  let start = 0;
  let index = 1;

  while (start < TOTAL_TOKENS) {
    const end = Math.min(TOTAL_TOKENS, start + chunkSize);
    chunks.push({
      id: `fixed-${index}`,
      label: `Chunk ${index}`,
      kind: "Fixed",
      start,
      end,
      segments: coveredSegments(start, end),
    });
    if (end === TOTAL_TOKENS) break;
    start += step;
    index += 1;
  }

  return chunks;
}

function buildSemanticChunks(chunkSize, overlapPct) {
  const limit = Math.round(chunkSize * 1.15);
  const bridgeCount = overlapPct >= 15 ? 1 : 0;
  const chunks = [];
  let current = [];
  let currentTokens = 0;

  OFFSETS.forEach((segment) => {
    if (current.length > 0 && currentTokens + segment.tokens > limit) {
      chunks.push(current);
      current = bridgeCount > 0 ? current.slice(-bridgeCount) : [];
      currentTokens = current.reduce((sum, item) => sum + item.tokens, 0);
    }
    current.push(segment);
    currentTokens += segment.tokens;
  });

  if (current.length > 0) chunks.push(current);

  return chunks.map((group, index) => ({
    id: `semantic-${index + 1}`,
    label: `Section group ${index + 1}`,
    kind: bridgeCount > 0 ? "Semantic + bridge" : "Semantic",
    start: group[0].start,
    end: group[group.length - 1].end,
    segments: group,
  }));
}

function buildAgenticChunks(chunkSize, overlapPct, queryId) {
  const evidenceSets = {
    lookup: [
      ["refund", "pricing"],
      ["policy", "pricing"],
      ["refund", "overview"],
    ],
    boundary: [
      ["sla", "escalation"],
      ["operations", "policy"],
      ["sla", "migration"],
    ],
    multihop: [
      ["pricing", "security", "compliance"],
      ["security", "migration"],
      ["pricing", "migration"],
    ],
  };

  const targetTopics = evidenceSets[queryId] || evidenceSets.lookup;
  const bridge = overlapPct >= 20;

  return targetTopics.map((topicSet, index) => {
    const matching = OFFSETS.filter(
      (segment) => topicSet.includes(segment.id) || topicSet.includes(segment.topic)
    );
    const trimmed = [];
    let used = 0;

    matching.forEach((segment) => {
      if (used >= chunkSize * 1.2 && trimmed.length > 0) return;
      trimmed.push(segment);
      used += segment.tokens;
    });

    if (bridge && trimmed.length > 0) {
      const last = trimmed[trimmed.length - 1];
      const next = OFFSETS.find((segment) => segment.start === last.end);
      if (next) trimmed.push(next);
    }

    const uniqueSegments = trimmed.filter(
      (segment, itemIndex, list) => list.findIndex((candidate) => candidate.id === segment.id) === itemIndex
    );

    return {
      id: `agentic-${index + 1}`,
      label: `Evidence pack ${index + 1}`,
      kind: bridge ? "Planned pack + bridge" : "Planned pack",
      start: uniqueSegments[0].start,
      end: uniqueSegments[uniqueSegments.length - 1].end,
      segments: uniqueSegments,
    };
  });
}

function buildChunks(strategy, chunkSize, overlapPct, queryId) {
  if (strategy === "semantic") return buildSemanticChunks(chunkSize, overlapPct);
  if (strategy === "agentic") return buildAgenticChunks(chunkSize, overlapPct, queryId);
  return buildFixedChunks(chunkSize, overlapPct);
}

function scorePolicy(strategy, queryId, chunkSize, overlapPct, chunkCount) {
  const baseQuality = {
    fixed: { lookup: 74, boundary: 58, multihop: 49 },
    semantic: { lookup: 81, boundary: 88, multihop: 73 },
    agentic: { lookup: 70, boundary: 82, multihop: 92 },
  };

  const basePrecision = {
    fixed: 64,
    semantic: 82,
    agentic: 78,
  };

  const baseLatency = {
    fixed: 28,
    semantic: 42,
    agentic: 68,
  };

  const sensitivity = {
    fixed: 1,
    semantic: 0.55,
    agentic: 0.35,
  };

  const ideal = QUERIES.find((query) => query.id === queryId)?.ideal || 400;
  const sizePenalty = Math.min(18, Math.abs(chunkSize - ideal) / 18) * sensitivity[strategy];
  const overlapBonus = overlapPct <= 30 ? overlapPct * 0.35 : 10.5 - (overlapPct - 30) * 0.3;
  const quality = clamp(baseQuality[strategy][queryId] - sizePenalty + overlapBonus, 20, 98);
  const precision = clamp(basePrecision[strategy] + overlapBonus * 0.5 - chunkCount * 1.5, 25, 95);
  const latency = clamp(baseLatency[strategy] + chunkCount * 4 + overlapPct * 0.35, 18, 96);

  const overlapWaste = Math.round((TOTAL_TOKENS * overlapPct) / 100);
  const embedCost = {
    fixed: TOTAL_TOKENS + overlapWaste,
    semantic: TOTAL_TOKENS + Math.round(overlapWaste * 0.7) + 120,
    agentic: TOTAL_TOKENS + Math.round(overlapWaste * 0.4) + 340 + chunkCount * 60,
  };

  const answerCost = {
    fixed: chunkCount * Math.min(chunkSize, 280),
    semantic: chunkCount * Math.min(chunkSize, 240),
    agentic: chunkCount * Math.min(chunkSize, 320) + 180,
  };

  return {
    retrievalQuality: round(quality),
    citationClarity: round(clamp(precision + (strategy === "semantic" ? 6 : 0), 25, 99)),
    latency: round(latency),
    embedCost,
    answerCost,
    totalCost: embedCost + answerCost,
  };
}

function gapMessage(strategy, queryId, overlapPct) {
  if (strategy === "fixed") {
    return overlapPct < 12
      ? "Fixed chunking is leaving boundary gaps. Adjacent facts can fall into separate chunks and one of them may not be retrieved."
      : "Overlap is masking some boundary gaps, but token cost is rising because the same evidence is embedded multiple times.";
  }

  if (strategy === "semantic") {
    return queryId === "multihop"
      ? "Semantic chunking protects topic coherence, but multi-hop answers can still require several retrieved chunks to be stitched together."
      : "Semantic chunking is preserving idea boundaries well. The main tradeoff is a slightly slower indexing path than fixed windows.";
  }

  return queryId === "lookup"
    ? "Agentic chunking is overkill for a single fact lookup. Planner overhead may dominate the gain."
    : "Agentic chunking closes the semantic gap when evidence is scattered, but the planner and routing logic add latency and cost.";
}

function recommendedPolicy(queryId) {
  if (queryId === "lookup") return "semantic";
  if (queryId === "boundary") return "semantic";
  return "agentic";
}

function MetricCard({ t, label, value, unit, color, note }) {
  return (
    <div
      style={{
        background: t.surface2,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "0.75rem",
      }}
    >
      <div style={{ fontSize: "0.74rem", color: t.muted2 }}>{label}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: "1.1rem",
          fontFamily: "monospace",
          fontWeight: 800,
          color,
        }}
      >
        {value}
        {unit ? ` ${unit}` : ""}
      </div>
      <div style={{ fontSize: "0.72rem", color: t.tick, marginTop: 4 }}>{note}</div>
    </div>
  );
}

function PipelineStep({ t, label, detail, active, accent }) {
  return (
    <div
      style={{
        minWidth: 148,
        flex: 1,
        borderRadius: 10,
        border: `1px solid ${active ? accent : t.border}`,
        background: active ? `${accent}18` : t.surface2,
        padding: "0.7rem",
      }}
    >
      <div style={{ fontSize: "0.72rem", color: t.muted2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: "0.8rem", color: active ? accent : t.labelMid, fontWeight: 700 }}>
        {detail}
      </div>
    </div>
  );
}

export default function RAGChunkingPolicyLab() {
  const [strategy, setStrategy] = useState("semantic");
  const [queryId, setQueryId] = useState("boundary");
  const [chunkSize, setChunkSize] = useState(420);
  const [overlapPct, setOverlapPct] = useState(15);
  const t = useChartTheme();

  const selectedStrategy = STRATEGIES.find((item) => item.id === strategy) || STRATEGIES[1];
  const selectedQuery = QUERIES.find((item) => item.id === queryId) || QUERIES[1];

  const chunks = useMemo(
    () => buildChunks(strategy, chunkSize, overlapPct, queryId),
    [strategy, chunkSize, overlapPct, queryId]
  );

  const metrics = useMemo(
    () => scorePolicy(strategy, queryId, chunkSize, overlapPct, chunks.length),
    [strategy, queryId, chunkSize, overlapPct, chunks.length]
  );

  const topicWeights = QUERY_TOPIC_WEIGHTS[queryId];
  const recommendation = recommendedPolicy(queryId);

  if (!t) return <div style={{ height: 420 }} />;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: t.muted3, lineHeight: 1.6 }}>
        Explore how chunk size, overlap, and chunking policy shape retrieval quality, citation clarity, and token spend.
        This lab focuses on the gap between semantic chunking and agentic chunk planning.
      </p>

      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          background: t.bg,
          padding: "0.9rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          {STRATEGIES.map((item) => {
            const active = item.id === strategy;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStrategy(item.id)}
                style={{
                  flex: "1 1 180px",
                  textAlign: "left",
                  borderRadius: 12,
                  border: `1px solid ${active ? item.color : t.btnBorder}`,
                  background: active ? `${item.color}1a` : t.btnBg,
                  color: active ? item.color : t.btnText,
                  padding: "0.7rem 0.8rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{item.label}</div>
                <div style={{ fontSize: "0.72rem", marginTop: 4, color: active ? item.color : t.muted2 }}>{item.short}</div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem" }}>
          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.8rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>Query style</div>
            <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.55rem" }}>
              {QUERIES.map((query) => {
                const active = query.id === queryId;
                return (
                  <button
                    key={query.id}
                    type="button"
                    onClick={() => setQueryId(query.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 10,
                      border: `1px solid ${active ? "#a855f7" : t.border}`,
                      background: active ? "rgba(168,85,247,0.12)" : t.surface3,
                      padding: "0.65rem",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: active ? "#c084fc" : t.labelMid }}>{query.label}</div>
                    <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 2 }}>{query.summary}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "center" }}>
              <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>Chunk size</div>
              <div style={{ fontFamily: "monospace", fontSize: "0.84rem", color: selectedStrategy.color }}>{chunkSize} tokens</div>
            </div>
            <input
              type="range"
              min={180}
              max={800}
              step={20}
              value={chunkSize}
              onChange={(event) => setChunkSize(Number(event.target.value))}
              style={{ width: "100%", marginTop: 10, accentColor: selectedStrategy.color }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: t.tick, marginTop: 2 }}>
              <span>small</span>
              <span>medium</span>
              <span>large</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "center", marginTop: "0.8rem" }}>
              <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>Overlap</div>
              <div style={{ fontFamily: "monospace", fontSize: "0.84rem", color: "#facc15" }}>{overlapPct}%</div>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={overlapPct}
              onChange={(event) => setOverlapPct(Number(event.target.value))}
              style={{ width: "100%", marginTop: 10, accentColor: "#facc15" }}
            />
            <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 8, lineHeight: 1.5 }}>
              More overlap reduces boundary misses, but duplicated tokens increase embedding and context cost.
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.95rem", display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: 2 }}>
          <PipelineStep t={t} label="Ingest" detail="Raw source sections" accent={selectedStrategy.color} />
          <PipelineStep t={t} label="Split" detail={selectedStrategy.label} active accent={selectedStrategy.color} />
          <PipelineStep t={t} label="Embed" detail={`${chunks.length} vectors`} accent={selectedStrategy.color} />
          <PipelineStep t={t} label="Retrieve" detail={`${metrics.retrievalQuality}/100 quality intuition`} accent={selectedStrategy.color} />
          <PipelineStep t={t} label="Assemble" detail={`${metrics.citationClarity}/100 citation clarity`} accent={selectedStrategy.color} />
        </div>

        <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.9rem" }}>
          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.8rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>Document map</div>
            <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 4 }}>
              Source sections before chunking. Color indicates topic families.
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: "0.7rem", height: 18 }}>
              {DOCUMENT_SEGMENTS.map((segment) => (
                <div
                  key={segment.id}
                  title={`${segment.label} - ${segment.tokens} tokens`}
                  style={{
                    flex: segment.tokens,
                    background: TOPIC_COLORS[segment.topic],
                    borderRadius: 6,
                    opacity: topicWeights[segment.topic] ? 1 : 0.35,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.45rem", marginTop: "0.7rem" }}>
              {DOCUMENT_SEGMENTS.map((segment) => (
                <div key={segment.id} style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.72rem", color: t.muted2 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: TOPIC_COLORS[segment.topic],
                      flexShrink: 0,
                    }}
                  />
                  <span>{segment.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: t.surface2, borderRadius: 12, padding: "0.8rem" }}>
            <div style={{ fontSize: "0.78rem", color: t.labelMid, fontWeight: 700 }}>Chunk preview</div>
            <div style={{ fontSize: "0.72rem", color: t.muted2, marginTop: 4 }}>
              The active strategy turns the same source into different retrieval units.
            </div>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
              {chunks.map((chunk) => {
                const topics = topicDistribution(chunk.segments);
                const chunkTokens = chunk.end - chunk.start;
                return (
                  <div
                    key={chunk.id}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      padding: "0.7rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: selectedStrategy.color }}>{chunk.label}</div>
                        <div style={{ fontSize: "0.7rem", color: t.muted2 }}>{chunk.kind}</div>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: t.labelMid }}>{chunkTokens} tok</div>
                    </div>

                    <div style={{ display: "flex", gap: 4, marginTop: "0.55rem", height: 10 }}>
                      {Object.entries(topics).map(([topic, tokens]) => (
                        <div
                          key={`${chunk.id}-${topic}`}
                          title={`${topic}: ${tokens} tokens`}
                          style={{
                            flex: tokens,
                            background: TOPIC_COLORS[topic],
                            borderRadius: 999,
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "0.55rem" }}>
                      {chunk.segments.map((segment) => (
                        <span
                          key={`${chunk.id}-${segment.id}`}
                          style={{
                            borderRadius: 999,
                            padding: "0.2rem 0.45rem",
                            background: `${TOPIC_COLORS[segment.topic]}22`,
                            border: `1px solid ${TOPIC_COLORS[segment.topic]}55`,
                            fontSize: "0.68rem",
                            color: t.labelMid,
                          }}
                        >
                          {segment.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.95rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
          <MetricCard
            t={t}
            label="Retrieval quality"
            value={metrics.retrievalQuality}
            unit="/100"
            color={selectedStrategy.color}
            note="Higher means the retriever is more likely to fetch the right evidence."
          />
          <MetricCard
            t={t}
            label="Citation clarity"
            value={metrics.citationClarity}
            unit="/100"
            color="#22c55e"
            note="Higher means evidence maps to cleaner, easier-to-cite chunks."
          />
          <MetricCard
            t={t}
            label="Latency"
            value={metrics.latency}
            unit="ms*"
            color="#f97316"
            note="Relative intuition only. Planner-heavy strategies tend to respond slower."
          />
          <MetricCard
            t={t}
            label="Token cost"
            value={metrics.totalCost}
            unit="tok"
            color="#facc15"
            note="Embedding plus answer-context intuition, not a provider-specific bill."
          />
        </div>

        <div style={{ marginTop: "0.95rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.8rem" }}>
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${t.border}`,
              background: t.surface2,
              padding: "0.8rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: t.labelMid }}>Practical note</div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6, marginTop: 6 }}>
              <strong style={{ color: selectedStrategy.color }}>{selectedStrategy.label}:</strong> {selectedStrategy.note}
            </div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6, marginTop: 8 }}>
              <strong style={{ color: "#c084fc" }}>Current question:</strong> {selectedQuery.question}
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.08)",
              padding: "0.8rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fda4af" }}>Gap analysis</div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6, marginTop: 6 }}>
              {gapMessage(strategy, queryId, overlapPct)}
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${recommendation === strategy ? "#22c55e" : t.border}`,
              background: recommendation === strategy ? "rgba(34,197,94,0.10)" : t.surface2,
              padding: "0.8rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: recommendation === strategy ? "#22c55e" : t.labelMid }}>
              Best-fit policy for this query
            </div>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, marginTop: 6, color: recommendation === strategy ? "#22c55e" : t.labelMid }}>
              {(STRATEGIES.find((item) => item.id === recommendation) || STRATEGIES[0]).label}
            </div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6, marginTop: 6 }}>
              Use semantic chunking for local coherence and agentic chunking when the answer spans distant sections or needs task-aware evidence selection.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "0.95rem",
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            background: t.surface2,
            padding: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: t.labelMid }}>Production guidance</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem", marginTop: "0.7rem" }}>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6 }}>
              <strong style={{ color: "#38bdf8" }}>Fixed windows:</strong> good default for quick ingestion pipelines, large corpora, and low-complexity search where recall matters more than perfect chunk boundaries.
            </div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6 }}>
              <strong style={{ color: "#22c55e" }}>Semantic sections:</strong> strong choice for docs, policies, and tutorials because chunks align with headings and citations stay interpretable.
            </div>
            <div style={{ fontSize: "0.74rem", color: t.muted2, lineHeight: 1.6 }}>
              <strong style={{ color: "#f97316" }}>Agentic packs:</strong> reserve for compound workflows, audits, or research copilots where a planner can deliberately compose evidence from multiple sections.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
