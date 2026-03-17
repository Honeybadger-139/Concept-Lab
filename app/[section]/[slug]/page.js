import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getNode,
  getNodesBySection,
  getNodesByTrack,
  getSection,
  getTrack,
  getTrackHref,
  nodes,
} from "@/data/curriculumData";
import { ADVANCED_TRACK_THEORY_POLISH_BY_ORDER } from "@/data/advancedTrackTheoryPolish";
import { LANGCHAIN_TRACK_THEORY_POLISH_BY_ORDER } from "@/data/langchainTrackTheoryPolish";
import styles from "./node.module.css";
import dynamic from "next/dynamic";
import NodeShell from "@/components/NodeShell";
import { requireAuthPage } from "@/lib/requireAuthPage";

const lazyPlaceholder = (
  <div className={styles.lazyPlaceholder} role="status" aria-live="polite">
    Loading interactive module...
  </div>
);

function withLoader(importer) {
  return dynamic(importer, { loading: () => lazyPlaceholder });
}

// Interactive components loaded only when needed
const ComponentMap = {
  VectorSearchVisualizer: withLoader(() => import("@/components/VectorSearchVisualizer")),
  TokenCounter:           withLoader(() => import("@/components/TokenCounter")),
  CosineSimilarityDemo:   withLoader(() => import("@/components/CosineSimilarityDemo")),
  RAGPipelineSteps:       withLoader(() => import("@/components/RAGPipelineSteps")),
  ChunkingVisualizer:     withLoader(() => import("@/components/ChunkingVisualizer")),
  LCELChainViz:           withLoader(() => import("@/components/LCELChainViz")),
  ChatModelDemo:          withLoader(() => import("@/components/ChatModelDemo")),
  // ML visualizations
  GradientDescentViz:     withLoader(() => import("@/components/GradientDescentViz")),
  CostFunctionViz:        withLoader(() => import("@/components/CostFunctionViz")),
  LogisticSigmoidViz:     withLoader(() => import("@/components/LogisticSigmoidViz")),
  OverfittingViz:         withLoader(() => import("@/components/OverfittingViz")),
  LearningRateViz:        withLoader(() => import("@/components/LearningRateViz")),
  FeatureScalingViz:      withLoader(() => import("@/components/FeatureScalingViz")),
  PolynomialRegressionViz: withLoader(() => import("@/components/PolynomialRegressionViz")),
  SupervisedPipelineFlowViz: withLoader(() => import("@/components/SupervisedPipelineFlowViz")),
  VectorizationShapeLab:  withLoader(() => import("@/components/VectorizationShapeLab")),
  VectorizationThroughputLab: withLoader(() => import("@/components/VectorizationThroughputLab")),
  FeatureEngineeringWorkflowLab: withLoader(() => import("@/components/FeatureEngineeringWorkflowLab")),
  LogisticDecisionBoundaryLab: withLoader(() => import("@/components/LogisticDecisionBoundaryLab")),
  NeuralNetworkPipelineLab: withLoader(() => import("@/components/NeuralNetworkPipelineLab")),
  BackpropComputationGraphViz: withLoader(() => import("@/components/BackpropComputationGraphViz")),
  TensorShapeFlowViz:      withLoader(() => import("@/components/TensorShapeFlowViz")),
  TrainingLoopMap:         withLoader(() => import("@/components/TrainingLoopMap")),
  ActivationDecisionLab:   withLoader(() => import("@/components/ActivationDecisionLab")),
  ActivationCollapseViz:   withLoader(() => import("@/components/ActivationCollapseViz")),
  SoftmaxProbabilityLab:   withLoader(() => import("@/components/SoftmaxProbabilityLab")),
  MultiLabelOutputStudio:  withLoader(() => import("@/components/MultiLabelOutputStudio")),
  OptimizerStepLab:        withLoader(() => import("@/components/OptimizerStepLab")),
  ConvolutionWindowViz:    withLoader(() => import("@/components/ConvolutionWindowViz")),
  EvaluationSplitFlowViz:  withLoader(() => import("@/components/EvaluationSplitFlowViz")),
  BiasVarianceWorkbench:   withLoader(() => import("@/components/BiasVarianceWorkbench")),
  LearningCurveDecisionLab: withLoader(() => import("@/components/LearningCurveDecisionLab")),
  ErrorTriageBoard:        withLoader(() => import("@/components/ErrorTriageBoard")),
  TransferLearningFlowLab: withLoader(() => import("@/components/TransferLearningFlowLab")),
  MLLifecycleFlywheelViz:  withLoader(() => import("@/components/MLLifecycleFlywheelViz")),
  FairnessRiskMatrixLab:   withLoader(() => import("@/components/FairnessRiskMatrixLab")),
  ImbalanceConfusionLab:   withLoader(() => import("@/components/ImbalanceConfusionLab")),
  PrecisionRecallTradeoffLab: withLoader(() => import("@/components/PrecisionRecallTradeoffLab")),
  DecisionTreeBuildFlowLab: withLoader(() => import("@/components/DecisionTreeBuildFlowLab")),
  EntropyCurveExplorer:    withLoader(() => import("@/components/EntropyCurveExplorer")),
  OneHotEncodingLab:       withLoader(() => import("@/components/OneHotEncodingLab")),
  ContinuousThresholdExplorer: withLoader(() => import("@/components/ContinuousThresholdExplorer")),
  DecisionTreeSplitViz:   withLoader(() => import("@/components/DecisionTreeSplitViz")),
  // RAG visualizations
  RetrievalQueryViz:      withLoader(() => import("@/components/RetrievalQueryViz")),
  RAGRetrievalWorkbench:  withLoader(() => import("@/components/RAGRetrievalWorkbench")),
  MultiQueryRAGViz:       withLoader(() => import("@/components/MultiQueryRAGViz")),
  RAGGuardrailsStudio:    withLoader(() => import("@/components/RAGGuardrailsStudio")),
  HistoryAwareQueryLab:   withLoader(() => import("@/components/HistoryAwareQueryLab")),
  ChunkingStrategyWorkbench: withLoader(() => import("@/components/ChunkingStrategyWorkbench")),
  MultimodalRAGFlowViz:   withLoader(() => import("@/components/MultimodalRAGFlowViz")),
  AdvancedRetrievalLab:   withLoader(() => import("@/components/AdvancedRetrievalLab")),
  HybridFusionLab:        withLoader(() => import("@/components/HybridFusionLab")),
  RerankerViz:            withLoader(() => import("@/components/RerankerViz")),
  MetadataFilterWorkbench: withLoader(() => import("@/components/MetadataFilterWorkbench")),
  RAGChunkingPolicyLab:    withLoader(() => import("@/components/RAGChunkingPolicyLab")),
  // LangGraph visualizations
  LangGraphArchitectureViz: withLoader(() => import("@/components/LangGraphArchitectureViz")),
  StateGraphFlowViz:        withLoader(() => import("@/components/StateGraphFlowViz")),
  ReActGraphInspector:      withLoader(() => import("@/components/ReActGraphInspector")),
  AutonomyLadderViz:        withLoader(() => import("@/components/AutonomyLadderViz")),
  AgentToolLoopSimulator:   withLoader(() => import("@/components/AgentToolLoopSimulator")),
  ReActExecutionTraceViz:   withLoader(() => import("@/components/ReActExecutionTraceViz")),
  LangGraphAgentLoopViz:    withLoader(() => import("@/components/LangGraphAgentLoopViz")),
  // LangChain visualizations
  LangChainArchitectureMap: withLoader(() => import("@/components/LangChainArchitectureMap")),
  ChainRoutingPatternsViz:  withLoader(() => import("@/components/ChainRoutingPatternsViz")),
  LangChainMemoryFlowViz:   withLoader(() => import("@/components/LangChainMemoryFlowViz")),
  ChainExecutionTimelineLab: withLoader(() => import("@/components/ChainExecutionTimelineLab")),
  LangChainPromptFlowLab:   withLoader(() => import("@/components/LangChainPromptFlowLab")),
  // ML visualizations
  MLLearningSpectrumViz:    withLoader(() => import("@/components/MLLearningSpectrumViz")),
  MLProblemFramingTool:     withLoader(() => import("@/components/MLProblemFramingTool")),
};

const FlashCardDeck = withLoader(() => import("@/components/FlashCardDeck"));

// Per-section visual config
const SECTION_META = {
  ml:        { color: "#3b82f6", emoji: "🧠" },
  rag:       { color: "#f97316", emoji: "🔍" },
  langchain: { color: "#10b981", emoji: "⛓️" },
  langgraph: { color: "#8b5cf6", emoji: "🕸️" },
};

// Rough reading-time estimate from HTML string
function readingTime(html) {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

const THEORY_POLISH_NOTES = {
  rag: {
    beginner:
      "Master one stage at a time: ingestion, retrieval, then grounded generation. Validate each stage with small test questions before tuning everything together.",
    production:
      "Treat quality as measurable system behavior. Track retrieval relevance, groundedness, and abstention quality with repeatable eval sets.",
  },
  langchain: {
    beginner:
      "Build deterministic baseline chains first (prompt -> model -> parser), then add retrieval, memory, or tools only when the baseline is stable.",
    production:
      "Keep contracts explicit at each boundary: input variables, output schema, retries, and logs. This is what keeps orchestration reliable at scale.",
  },
  langgraph: {
    beginner:
      "Think in state transitions, not giant prompts. Keep node responsibilities small and route logic deterministic so each step is easy to reason about.",
    production:
      "Bound autonomy with loop limits, tool policies, and checkpoints. Capture route decisions and state snapshots for replay and incident analysis.",
  },
  ml: {
    beginner:
      "Read each model as a dataflow system: inputs become representations, representations become scores, and scores become decisions through a chosen loss and thresholding policy.",
    production:
      "Track three things relentlessly in ML systems: data shape contracts, evaluation methodology, and the operational meaning of the model's errors. Most expensive failures come from one of those three.",
  },
};

function getPolishedTheory(sectionId, node) {
  const theoryHtml = node?.theory;
  if (!theoryHtml) return theoryHtml;
  if (theoryHtml.includes("data-theory-polish")) return theoryHtml;

  const notes = THEORY_POLISH_NOTES[sectionId];
  const advancedPolish =
    node?.conceptId === "advanced-learning-algorithms"
      ? ADVANCED_TRACK_THEORY_POLISH_BY_ORDER[node.order] ?? ""
      : "";
  const langchainPolish =
    sectionId === "langchain"
      ? LANGCHAIN_TRACK_THEORY_POLISH_BY_ORDER[node.order] ?? ""
      : "";

  if (!notes && !advancedPolish && !langchainPolish) return theoryHtml;

  const sharedNotes = notes
    ? `<p data-theory-polish="beginner"><b>First-time learner note:</b> ${notes.beginner}</p><p data-theory-polish="production"><b>Production note:</b> ${notes.production}</p>`
    : "";

  return `${theoryHtml}${sharedNotes}${advancedPolish}${langchainPolish}`;
}

function deriveHighlightTerms(entry) {
  if (Array.isArray(entry?.highlightTerms) && entry.highlightTerms.length > 0) {
    return entry.highlightTerms;
  }

  const focus = String(entry?.focus ?? "").toLowerCase();
  const terms = new Set();

  if (focus.includes("state")) {
    terms.add("state");
    terms.add("TypedDict");
  }
  if (focus.includes("graph") || focus.includes("routing")) {
    terms.add("StateGraph");
    terms.add("MessageGraph");
    terms.add("add_node");
  }
  if (focus.includes("tool")) {
    terms.add("tool");
    terms.add("ToolNode");
    terms.add("bind_tools");
  }
  if (focus.includes("prompt") || focus.includes("chain")) {
    terms.add("prompt");
    terms.add("ChatPromptTemplate");
    terms.add("chain");
  }
  if (focus.includes("memory") || focus.includes("checkpointer")) {
    terms.add("MemorySaver");
    terms.add("SqliteSaver");
    terms.add("thread_id");
  }
  if (focus.includes("retriever") || focus.includes("retrieval")) {
    terms.add("retriever");
    terms.add("invoke");
  }

  return Array.from(terms).slice(0, 8);
}

function buildCodeViewerHref(entry, fromPath) {
  const params = new URLSearchParams();
  params.set("file", entry.path);
  if (entry.focus) params.set("focus", entry.focus);
  if (fromPath) params.set("from", fromPath);
  const terms = deriveHighlightTerms(entry);
  if (terms.length > 0) params.set("terms", terms.join(","));
  return `/code?${params.toString()}`;
}

export async function generateStaticParams() {
  return nodes.map((node) => ({ section: node.sectionId, slug: node.slug }));
}

export async function generateMetadata({ params }) {
  const { section, slug } = await params;
  const node = getNode(section, slug);
  if (!node) return { title: "Node not found | Concept Lab" };
  return { title: `${node.title} | Concept Lab` };
}

function buildTopicHref(sectionId, slug, trackId) {
  const base = `/${sectionId}/${slug}`;
  return trackId ? `${base}?track=${trackId}` : base;
}

export default async function NodePage({ params, searchParams }) {
  const { section, slug } = await params;
  const query = await searchParams;
  const callbackPath = Array.isArray(query?.track)
    ? `/${section}/${slug}?track=${query.track[0]}`
    : query?.track
      ? `/${section}/${slug}?track=${query.track}`
      : `/${section}/${slug}`;
  await requireAuthPage(callbackPath);
  const sec   = getSection(section);
  const node  = getNode(section, slug);
  if (!sec || !node) notFound();

  const rawTrackId = Array.isArray(query?.track) ? query.track[0] : query?.track;
  const requestedTrack = rawTrackId ? getTrack(String(rawTrackId)) : null;
  const trackNodes = requestedTrack &&
    requestedTrack.sectionId === section &&
    getNodesByTrack(requestedTrack.id).some((candidate) => candidate.slug === slug)
      ? getNodesByTrack(requestedTrack.id)
      : null;

  const activeTrack = trackNodes ? requestedTrack : null;
  const activeNodes = trackNodes ?? getNodesBySection(section);
  const currentIndex   = activeNodes.findIndex((n) => n.slug === slug);
  const prevNode       = currentIndex > 0 ? activeNodes[currentIndex - 1] : null;
  const nextNode       = currentIndex < activeNodes.length - 1 ? activeNodes[currentIndex + 1] : null;
  const meta           = SECTION_META[section] || { color: "#6366f1", emoji: "📚" };
  const polishedTheory = getPolishedTheory(section, node);
  const rt             = readingTime(polishedTheory);
  const topicHref = buildTopicHref(section, slug, activeTrack?.id ?? null);
  const backHref = activeTrack ? getTrackHref(activeTrack.id) : `/${section}`;
  const backLabel = activeTrack ? activeTrack.title : sec.title;
  const AnimComponent  = node.animation && ComponentMap[node.animation] ? ComponentMap[node.animation] : null;
  const ToolComponent  = node.tool      && ComponentMap[node.tool]      ? ComponentMap[node.tool]      : null;
  const pageSections = [
    { id: "core-theory", label: "Theory" },
    ...(node.example ? [{ id: "concrete-example", label: "Example" }] : []),
    ...((AnimComponent || node.animation) ? [{ id: "interactive-visualization", label: "Visualization" }] : []),
    ...((ToolComponent || node.tool) ? [{ id: "interactive-tool", label: "Tool" }] : []),
    ...(node.codeGuide ? [{ id: "code-walkthrough", label: "Code" }] : []),
    ...(node.interviewPrep?.questions?.length > 0 ? [{ id: "interview-prep", label: "Interview" }] : []),
    ...(node.flashCards?.length > 0 ? [{ id: "flash-cards", label: "Flash Cards" }] : []),
  ];

  return (
    <NodeShell sectionId={section} slug={slug} trackId={activeTrack?.id ?? null}>
      <main className={styles.main} data-section={section}>

        {/* top accent bar */}
        <div className={styles.accentBar} style={{ background: meta.color }} />

        <section className="section-padding container">

          {/* ── Back + progress ── */}
          <div className={styles.topRow}>
            <Link href={backHref} className="backLink">
              ← {backLabel}
            </Link>
            <span className={styles.nodeProgress}>
              {meta.emoji} {currentIndex + 1} / {activeNodes.length}
            </span>
          </div>

          {/* ── Header ── */}
          <header className={styles.header}>
            <span className={styles.badge} style={{ color: meta.color, borderColor: meta.color }}>
              {sec.title}
            </span>
            <h1>{node.title}</h1>
            <div className={styles.headerMeta}>
              <p className={styles.excerpt}>{node.excerpt}</p>
              {rt && <span className={styles.readingTime}>📖 {rt}</span>}
            </div>
          </header>

          <nav className={styles.quickNav} aria-label="On this page">
            <span className={styles.quickNavLabel}>On this page</span>
            <div className={styles.quickNavLinks}>
              {pageSections.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={styles.quickNavLink}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className={styles.blocks}>

            {/* ── Theory ── */}
            <section id="core-theory" className={`nodeBlock ${styles.theoryBlock}`}>
              <h2>Core Theory</h2>
              {node.theory ? (
                <div
                  className="theoryContent"
                  dangerouslySetInnerHTML={{ __html: polishedTheory }}
                />
              ) : (
                <p className="placeholder">Theory content will be added from transcript.</p>
              )}
            </section>

            {/* ── Example ── */}
            {node.example && (
              <section id="concrete-example" className={`nodeBlock ${styles.exampleBlock}`}>
                <h2>💡 Concrete Example</h2>
                <div className={styles.exampleCard}>
                  <p className={styles.exampleText}>{node.example}</p>
                </div>
              </section>
            )}

            {/* ── Animation / Visualization ── */}
            {(AnimComponent || node.animation) && (
              <section id="interactive-visualization" className={`nodeBlock ${styles.vizBlock}`}>
                <h2>🎬 Interactive Visualization</h2>
                {AnimComponent ? (
                  <AnimComponent />
                ) : (
                  <p className="placeholder">
                    Component <code>{node.animation}</code> — coming soon.
                  </p>
                )}
              </section>
            )}

            {/* ── Interactive Tool ── */}
            {(ToolComponent || node.tool) && (
              <section id="interactive-tool" className={`nodeBlock ${styles.toolBlock}`}>
                <h2>🛠 Interactive Tool</h2>
                {ToolComponent ? (
                  <ToolComponent />
                ) : (
                  <p className="placeholder">
                    Tool <code>{node.tool}</code> — coming soon.
                  </p>
                )}
              </section>
            )}

            {/* ── Code walkthrough ── */}
            {node.codeGuide && (
              <section id="code-walkthrough" className={`nodeBlock ${styles.codeBlock}`}>
                <h2>💻 Code Walkthrough</h2>
                {node.codeGuide.summary && (
                  <p className={styles.codeIntro}>{node.codeGuide.summary}</p>
                )}
                {Array.isArray(node.codeGuide.files) && node.codeGuide.files.length > 0 && (
                  <div className={styles.codeFiles}>
                    {node.codeGuide.files.map((entry, index) => (
                      <article key={`${entry.path}-${index}`} className={styles.codeFileCard}>
                        <p className={styles.codePath}>
                          <code>{entry.path}</code>
                        </p>
                        {entry.focus && <p className={styles.codeFocus}>{entry.focus}</p>}
                        <Link href={buildCodeViewerHref(entry, topicHref)} className={styles.codeOpenLink}>
                          Open highlighted code →
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
                {Array.isArray(node.codeGuide.checkpoints) && node.codeGuide.checkpoints.length > 0 && (
                  <ol className={styles.codeChecklist}>
                    {node.codeGuide.checkpoints.map((checkpoint, index) => (
                      <li key={index}>{checkpoint}</li>
                    ))}
                  </ol>
                )}
              </section>
            )}

            {/* ── Interview Prep ── */}
            {node.interviewPrep?.questions?.length > 0 && (
              <section id="interview-prep" className={`nodeBlock ${styles.interviewBlock}`}>
                <h2>🎯 Interview Prep</h2>
                <p className={styles.interviewIntro}>
                  Questions an interviewer is likely to ask about this topic.
                  Think through your answer before reading the senior angle.
                </p>
                <ul className={styles.interviewList}>
                  {node.interviewPrep.questions.map((q, i) => (
                    <li key={i}>
                      <details className={styles.interviewQA}>
                        <summary className={styles.interviewQuestion}>
                          <span className={styles.qNum}>Q{i + 1}</span>
                          <span>{q}</span>
                        </summary>
                        <div className={styles.answerWrap}>
                          <div className={styles.interviewAnswer}>
                            {node.interviewPrep.answers?.[i] || node.interviewPrep.seniorTip || "Draft your answer in STAR format (Situation, Task, Action, Result), then refine it for clarity and business impact."}
                          </div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
                {node.interviewPrep.seniorTip && (
                  <details className={styles.seniorDetails}>
                    <summary className={styles.seniorSummary}>
                      🏆 Senior answer angle — click to reveal
                    </summary>
                    <div className={styles.seniorTip}>
                      {node.interviewPrep.seniorTip}
                    </div>
                  </details>
                )}
              </section>
            )}

            {/* ── Flash Cards ── */}
            {node.flashCards?.length > 0 && (
              <section id="flash-cards" className={`nodeBlock ${styles.flashBlock}`}>
                <h2>📚 Revision Flash Cards</h2>
                <p className={styles.flashIntro}>
                  Test yourself before moving on. Flip each card to check your understanding —
                  great for quick revision before an interview.
                </p>
                <FlashCardDeck cards={node.flashCards} />
              </section>
            )}

          </div>

          {/* ── Prev / Next ── */}
          <nav className={styles.navRow}>
            {prevNode ? (
              <Link href={buildTopicHref(section, prevNode.slug, activeTrack?.id ?? null)} className={styles.navBtn}>
                <span className={styles.navDir}>← Previous</span>
                <span className={styles.navTitle}>{prevNode.title}</span>
              </Link>
            ) : <div />}

            {nextNode ? (
              <Link href={buildTopicHref(section, nextNode.slug, activeTrack?.id ?? null)} className={`${styles.navBtn} ${styles.navBtnRight}`}>
                <span className={styles.navDir}>Next →</span>
                <span className={styles.navTitle}>{nextNode.title}</span>
              </Link>
            ) : <div />}
          </nav>

        </section>
      </main>
    </NodeShell>
  );
}
