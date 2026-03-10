import Link from "next/link";
import { getSections, getNodesBySection } from "@/data/curriculumData";
import styles from "./page.module.css";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description: "Interactive learning: RAG, ML, LangChain and more.",
};

// Per-section visual config
const SECTION_META = {
  ml:        { emoji: "🧠", color: "#3b82f6", label: "Machine Learning" },
  rag:       { emoji: "🔍", color: "#f97316", label: "RAG" },
  langchain: { emoji: "⛓️", color: "#10b981", label: "LangChain" },
  langgraph: { emoji: "🕸️", color: "#8b5cf6", label: "LangGraph" },
};

export default function HomePage() {
  const sections = getSections();

  // Stats
  const totalNodes = sections.reduce((acc, s) => acc + getNodesBySection(s.id).length, 0);
  const totalSections = sections.length;

  return (
    <main className={styles.main}>
      <section className="section-padding container">

        {/* ── Hero ── */}
        <header className={styles.hero}>
          <div className={styles.heroEyebrow}>Abhishek&apos;s Personal Learning Hub</div>
          <h1 className={styles.title}>Concept Lab</h1>
          <p className={styles.subtitle}>
            Theory, interactive demos, flash cards, and interview prep — built
            from real course transcripts. RAG, machine learning, LangChain.
          </p>

          {/* Stats strip */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{totalSections}</span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{totalNodes}</span>
              <span className={styles.statLabel}>Nodes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>✦</span>
              <span className={styles.statLabel}>Flash Cards</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>🎯</span>
              <span className={styles.statLabel}>Interview Prep</span>
            </div>
          </div>
        </header>

        {/* ── Section cards ── */}
        <div className={styles.grid}>
          {sections.map((section) => {
            const meta = SECTION_META[section.id] || { emoji: "📚", color: "#6366f1" };
            const nodeCount = getNodesBySection(section.id).length;

            return (
              <Link
                key={section.id}
                href={`/${section.id}`}
                className={styles.card}
                style={{ "--card-color": meta.color }}
              >
                <div className={styles.cardEmoji}>{meta.emoji}</div>
                <h2 className={styles.cardTitle}>{section.title}</h2>
                <p className={styles.cardDesc}>{section.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.nodeCount}>{nodeCount} nodes</span>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Footer tip ── */}
        <p className={styles.tip}>
          💡 <strong>Tip:</strong> Flash cards track your progress per session — use ← → arrow keys to navigate, Space to flip.
        </p>
      </section>
    </main>
  );
}
