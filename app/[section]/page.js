import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSection,
  getNodesBySection,
} from "@/data/curriculumData";
import styles from "./section.module.css";

export async function generateStaticParams() {
  return [
    { section: "rag" },
    { section: "ml" },
    { section: "advanced" },
    { section: "langgraph" },
  ];
}

export async function generateMetadata({ params }) {
  const { section } = await params;
  const sec = getSection(section);
  if (!sec) return { title: "Section not found | Concept Lab" };
  return { title: `${sec.title} | Concept Lab` };
}

export default async function SectionPage({ params }) {
  const { section } = await params;
  const sec = getSection(section);
  if (!sec) notFound();

  const nodes = getNodesBySection(section);

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <Link href="/" className="backLink">
          ← Back to Concept Lab
        </Link>

        <header className={styles.header}>
          <h1>{sec.title}</h1>
          <p className={styles.description}>{sec.description}</p>
        </header>

        <div className={styles.grid}>
          {nodes.map((node) => (
            <Link
              key={node.slug}
              href={`/${section}/${node.slug}`}
              className={`${styles.card} glass`}
            >
              <span className={styles.order}>{node.order > 0 ? node.order : "—"}</span>
              <h2>{node.title}</h2>
              <p>{node.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
