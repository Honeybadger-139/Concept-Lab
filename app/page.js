import Link from "next/link";
import { getSections } from "@/data/curriculumData";
import styles from "./page.module.css";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description: "Interactive learning: RAG, ML, and more.",
};

export default function HomePage() {
  const sections = getSections();

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <header className={styles.header}>
          <h1 className={styles.title}>Concept Lab</h1>
          <p className={styles.subtitle}>
            Theory, examples, animations, and interactive tools from transcripts
            and courses. RAG, machine learning, and more.
          </p>
        </header>

        <div className={styles.grid}>
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/${section.id}`}
              className={`${styles.card} glass`}
            >
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
