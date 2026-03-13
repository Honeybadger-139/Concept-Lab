import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDomainForSection,
  getNodesBySection,
  getNodesBySectionGroupedByConcept,
  getSection,
  sections,
} from "@/data/curriculumData";
import SectionProgress from "@/components/SectionProgress";
import styles from "./section.module.css";

// Auto-derive from data — no manual maintenance needed
export async function generateStaticParams() {
  return sections.map((s) => ({ section: s.id }));
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
  const domain = getDomainForSection(section);

  const nodes = getNodesBySection(section);
  const grouped = getNodesBySectionGroupedByConcept(section);

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <Link href={domain ? `/domains/${domain.id}` : "/"} className="backLink">
          ← Back to {domain?.title ?? "Concept Lab"}
        </Link>

        <header className={styles.header}>
          <h1>{sec.title}</h1>
          <p className={styles.description}>{sec.description}</p>
        </header>

        <SectionProgress sectionId={section} nodes={nodes} groupedByConcept={grouped} />
      </section>
    </main>
  );
}
