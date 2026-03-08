import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSection,
  getNode,
} from "@/data/curriculumData";
import styles from "./node.module.css";
import dynamic from "next/dynamic";

const ComponentMap = {
  VectorSearchVisualizer: dynamic(() => import("@/components/VectorSearchVisualizer")),
  TokenCounter: dynamic(() => import("@/components/TokenCounter")),
  CosineSimilarityDemo: dynamic(() => import("@/components/CosineSimilarityDemo")),
};

export async function generateStaticParams() {
  const sections = ["rag", "ml", "advanced"];
  const slugsBySection = {
    rag: [
      "01-intro-rag-course",
      "02-what-is-rag",
      "03-coding-injection-pipeline",
      "04-coding-retrieval-pipeline",
      "05-cosine-similarity",
      "06-answer-generation-llm",
      "07-history-aware-conversational-rag",
      "08-chunking-strategies-overview",
      "09-character-recursive-splitter",
      "10-semantic-chunking",
      "11-agentic-chunking",
      "12-multimodal-rag",
      "13-advanced-document-retrieval",
      "14-multi-query-rag",
    ],
    ml: [
      "01-ml-basics-supervised",
      "02-linear-regression",
      "03-logistic-regression-classification"
    ],
    advanced: ["advanced-placeholder"],
    langgraph: ["15-rag-langgraph"],
  };
  const params = [];
  for (const section of sections) {
    for (const slug of slugsBySection[section] || []) {
      params.push({ section, slug });
    }
  }
  return params;
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

  return (
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
          <section className="nodeBlock">
            <h2>Core Theory</h2>
            {node.theory ? (
              <div dangerouslySetInnerHTML={{ __html: node.theory }} />
            ) : (
              <p className="placeholder">Theory content will go here (from transcript or blueprint).</p>
            )}
          </section>

          <section className="nodeBlock">
            <h2>Example</h2>
            {node.example ? (
              <div>{typeof node.example === "string" ? node.example : node.example}</div>
            ) : (
              <p className="placeholder">A simple example or code snippet will go here.</p>
            )}
          </section>

          <section className="nodeBlock">
            <h2>Animation / Visualization</h2>
            {node.animation ? (
              ComponentMap[node.animation] ? (
                (() => {
                  const AnimComponent = ComponentMap[node.animation];
                  return <AnimComponent />;
                })()
              ) : (
                <p>Component: <code>{node.animation}</code> (to be implemented)</p>
              )
            ) : (
              <p className="placeholder">An animation or visualization will go here when added.</p>
            )}
          </section>

          <section className="nodeBlock">
            <h2>Interactive Tool</h2>
            {node.tool ? (
              ComponentMap[node.tool] ? (
                (() => {
                  const ToolComponent = ComponentMap[node.tool];
                  return <ToolComponent />;
                })()
              ) : (
                <p>Component: <code>{node.tool}</code> (to be implemented)</p>
              )
            ) : (
              <p className="placeholder">An interactive tool will go here when added.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
