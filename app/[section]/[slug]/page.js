import Link from "next/link";
import { notFound } from "next/navigation";
import { getSection, getNode, getNodesBySection, nodes } from "@/data/curriculumData";
import styles from "./node.module.css";
import dynamic from "next/dynamic";
import NodeShell from "@/components/NodeShell";

// Interactive components loaded only when needed
const ComponentMap = {
  VectorSearchVisualizer: dynamic(() => import("@/components/VectorSearchVisualizer")),
  TokenCounter:           dynamic(() => import("@/components/TokenCounter")),
  CosineSimilarityDemo:   dynamic(() => import("@/components/CosineSimilarityDemo")),
  RAGPipelineSteps:       dynamic(() => import("@/components/RAGPipelineSteps")),
  ChunkingVisualizer:     dynamic(() => import("@/components/ChunkingVisualizer")),
  LCELChainViz:           dynamic(() => import("@/components/LCELChainViz")),
  ChatModelDemo:          dynamic(() => import("@/components/ChatModelDemo")),
  // ML visualizations
  GradientDescentViz:     dynamic(() => import("@/components/GradientDescentViz")),
  CostFunctionViz:        dynamic(() => import("@/components/CostFunctionViz")),
  LogisticSigmoidViz:     dynamic(() => import("@/components/LogisticSigmoidViz")),
  OverfittingViz:         dynamic(() => import("@/components/OverfittingViz")),
  LearningRateViz:        dynamic(() => import("@/components/LearningRateViz")),
  FeatureScalingViz:      dynamic(() => import("@/components/FeatureScalingViz")),
  // RAG visualizations
  RetrievalQueryViz:      dynamic(() => import("@/components/RetrievalQueryViz")),
  MultiQueryRAGViz:       dynamic(() => import("@/components/MultiQueryRAGViz")),
  RerankerViz:            dynamic(() => import("@/components/RerankerViz")),
  // LangGraph visualizations
  LangGraphArchitectureViz: dynamic(() => import("@/components/LangGraphArchitectureViz")),
  AutonomyLadderViz:        dynamic(() => import("@/components/AutonomyLadderViz")),
  AgentToolLoopSimulator:   dynamic(() => import("@/components/AgentToolLoopSimulator")),
};

const FlashCardDeck = dynamic(() => import("@/components/FlashCardDeck"));

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

export async function generateStaticParams() {
  return nodes.map((node) => ({ section: node.sectionId, slug: node.slug }));
}

export async function generateMetadata({ params }) {
  const { section, slug } = await params;
  const node = getNode(section, slug);
  if (!node) return { title: "Node not found | Concept Lab" };
  return { title: `${node.title} | Concept Lab` };
}

export default async function NodePage({ params }) {
  const { section, slug } = await params;
  const sec   = getSection(section);
  const node  = getNode(section, slug);
  if (!sec || !node) notFound();

  const sectionNodes   = getNodesBySection(section);
  const currentIndex   = sectionNodes.findIndex((n) => n.slug === slug);
  const prevNode       = currentIndex > 0 ? sectionNodes[currentIndex - 1] : null;
  const nextNode       = currentIndex < sectionNodes.length - 1 ? sectionNodes[currentIndex + 1] : null;
  const meta           = SECTION_META[section] || { color: "#6366f1", emoji: "📚" };
  const rt             = readingTime(node.theory);

  const AnimComponent  = node.animation && ComponentMap[node.animation] ? ComponentMap[node.animation] : null;
  const ToolComponent  = node.tool      && ComponentMap[node.tool]      ? ComponentMap[node.tool]      : null;

  return (
    <NodeShell sectionId={section} slug={slug}>
      <main className={styles.main} data-section={section}>

        {/* top accent bar */}
        <div className={styles.accentBar} style={{ background: meta.color }} />

        <section className="section-padding container">

          {/* ── Back + progress ── */}
          <div className={styles.topRow}>
            <Link href={`/${section}`} className="backLink">
              ← {sec.title}
            </Link>
            <span className={styles.nodeProgress}>
              {meta.emoji} {currentIndex + 1} / {sectionNodes.length}
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

          <div className={styles.blocks}>

            {/* ── Theory ── */}
            <section className={`nodeBlock ${styles.theoryBlock}`}>
              <h2>Core Theory</h2>
              {node.theory ? (
                <div
                  className="theoryContent"
                  dangerouslySetInnerHTML={{ __html: node.theory }}
                />
              ) : (
                <p className="placeholder">Theory content will be added from transcript.</p>
              )}
            </section>

            {/* ── Example ── */}
            {node.example && (
              <section className={`nodeBlock ${styles.exampleBlock}`}>
                <h2>💡 Concrete Example</h2>
                <div className={styles.exampleCard}>
                  <p className={styles.exampleText}>{node.example}</p>
                </div>
              </section>
            )}

            {/* ── Animation / Visualization ── */}
            {(AnimComponent || node.animation) && (
              <section className={`nodeBlock ${styles.vizBlock}`}>
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
              <section className={`nodeBlock ${styles.toolBlock}`}>
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

            {/* ── Interview Prep ── */}
            {node.interviewPrep?.questions?.length > 0 && (
              <section className={`nodeBlock ${styles.interviewBlock}`}>
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
              <section className={`nodeBlock ${styles.flashBlock}`}>
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
              <Link href={`/${section}/${prevNode.slug}`} className={styles.navBtn}>
                <span className={styles.navDir}>← Previous</span>
                <span className={styles.navTitle}>{prevNode.title}</span>
              </Link>
            ) : <div />}

            {nextNode ? (
              <Link href={`/${section}/${nextNode.slug}`} className={`${styles.navBtn} ${styles.navBtnRight}`}>
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
