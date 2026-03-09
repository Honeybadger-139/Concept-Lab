import Link from "next/link";
import { notFound } from "next/navigation";
import { getSection, getNode, getNodesBySection, nodes } from "@/data/curriculumData";
import styles from "./node.module.css";
import dynamic from "next/dynamic";
import NodeShell from "@/components/NodeShell";

// Interactive components loaded only when needed
const ComponentMap = {
  VectorSearchVisualizer: dynamic(() => import("@/components/VectorSearchVisualizer")),
  TokenCounter: dynamic(() => import("@/components/TokenCounter")),
  CosineSimilarityDemo: dynamic(() => import("@/components/CosineSimilarityDemo")),
};

// Flashcard deck — client component, loaded dynamically
const FlashCardDeck = dynamic(() => import("@/components/FlashCardDeck"));

// Auto-derived — adding a node to curriculumData is enough
export async function generateStaticParams() {
  return nodes.map((node) => ({
    section: node.sectionId,
    slug: node.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { section, slug } = await params;
  const node = getNode(section, slug);
  if (!node) return { title: "Node not found | Concept Lab" };
  return { title: `${node.title} | Concept Lab` };
}

export default async function NodePage({ params }) {
  const { section, slug } = await params;
  const sec = getSection(section);
  const node = getNode(section, slug);
  if (!sec || !node) notFound();

  // Prev / Next within this section
  const sectionNodes = getNodesBySection(section);
  const currentIndex = sectionNodes.findIndex((n) => n.slug === slug);
  const prevNode = currentIndex > 0 ? sectionNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < sectionNodes.length - 1 ? sectionNodes[currentIndex + 1] : null;

  // Resolve animation & tool components
  const AnimComponent = node.animation && ComponentMap[node.animation]
    ? ComponentMap[node.animation]
    : null;
  const ToolComponent = node.tool && ComponentMap[node.tool]
    ? ComponentMap[node.tool]
    : null;

  return (
    // NodeShell is a thin client wrapper that marks this node visited on mount
    <NodeShell sectionId={section} slug={slug}>
      <main className={styles.main}>
        <section className="section-padding container">
          <Link href={`/${section}`} className="backLink">
            ← Back to {sec.title}
          </Link>

          <header className={styles.header}>
            <span className={styles.badge}>{sec.title}</span>
            <h1>{node.title}</h1>
            <p className={styles.excerpt}>{node.excerpt}</p>
          </header>

          <div className={styles.blocks}>

            {/* ── Theory ── */}
            <section className="nodeBlock">
              <h2>Core Theory</h2>
              {node.theory ? (
                <div dangerouslySetInnerHTML={{ __html: node.theory }} />
              ) : (
                <p className="placeholder">Theory content will be added from transcript.</p>
              )}
            </section>

            {/* ── Example ── */}
            <section className="nodeBlock">
              <h2>Example</h2>
              {node.example ? (
                <div>{node.example}</div>
              ) : (
                <p className="placeholder">A concrete example or code snippet will go here.</p>
              )}
            </section>

            {/* ── Animation ── */}
            <section className="nodeBlock">
              <h2>Animation / Visualization</h2>
              {AnimComponent ? (
                <AnimComponent />
              ) : node.animation ? (
                <p>
                  Component <code>{node.animation}</code> — coming soon.
                </p>
              ) : (
                <p className="placeholder">An animation will be added here.</p>
              )}
            </section>

            {/* ── Interactive Tool ── */}
            <section className="nodeBlock">
              <h2>Interactive Tool</h2>
              {ToolComponent ? (
                <ToolComponent />
              ) : node.tool ? (
                <p>
                  Tool <code>{node.tool}</code> — coming soon.
                </p>
              ) : (
                <p className="placeholder">An interactive tool will be added here.</p>
              )}
            </section>

            {/* ── Interview Prep ── */}
            {node.interviewPrep && (
              <section className={`nodeBlock ${styles.interviewBlock}`}>
                <h2>🎯 Interview Prep</h2>
                {node.interviewPrep.questions?.length > 0 && (
                  <ul className={styles.interviewList}>
                    {node.interviewPrep.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                )}
                {node.interviewPrep.seniorTip && (
                  <div className={styles.seniorTip}>
                    <strong>Senior answer angle:</strong> {node.interviewPrep.seniorTip}
                  </div>
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

          {/* ── Prev / Next navigation ── */}
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
