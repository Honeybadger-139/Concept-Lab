import Link from "next/link";
import { getDomains, getTracksByDomain } from "@/data/curriculumData";
import ContinueLearningCard from "@/components/ContinueLearningCard";
import { requireAuthPage } from "@/lib/requireAuthPage";
import styles from "./page.module.css";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description:
    "Disciplines, tracks, and topics are structured for sustained, cumulative study.",
};

export default async function HomePage() {
  await requireAuthPage("/");
  const domains = getDomains();

  const totalDomains = domains.length;

  return (
    <main className={styles.main}>
      <section className="section-padding container">

        {/* ── Hero ── */}
        <header className={styles.hero}>
          <div className={styles.heroEyebrow}>Learning Hub</div>
          <h1 className={styles.title}>Concept Lab</h1>
          <p className={styles.subtitle}>
            Disciplines, tracks, and topics are structured for sustained, cumulative study.
            The curriculum preserves a coherent progression while remaining extensible as the knowledge base expands.
          </p>

          <ContinueLearningCard />

          {/* Stats strip */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{totalDomains}</span>
              <span className={styles.statLabel}>Domains</span>
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

        {/* ── Domain cards ── */}
        <div className={styles.grid}>
          {domains.map((domain) => {
            const tracks = getTracksByDomain(domain.id);

            return (
              <Link
                key={domain.id}
                href={`/domains/${domain.id}`}
                className={styles.card}
                style={{ "--card-color": domain.color ?? "#d97706" }}
              >
                <div className={styles.cardEmoji}>{domain.emoji ?? "📚"}</div>
                <h2 className={styles.cardTitle}>{domain.title}</h2>
                <p className={styles.cardDesc}>{domain.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.nodeCount}>{tracks.length} tracks</span>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Footer tip ── */}
        <p className={styles.tip}>
          💡 <strong>Tip:</strong> Topic progress syncs for your current local profile. Flash cards still support ← → navigation and Space to flip.
        </p>
      </section>
    </main>
  );
}
