import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDomain,
  getDomains,
  getNodesByTrack,
  getTrackHref,
  getTracksByDomain,
} from "@/data/curriculumData";
import styles from "@/app/page.module.css";

export async function generateStaticParams() {
  return getDomains().map((domain) => ({ domain: domain.id }));
}

export async function generateMetadata({ params }) {
  const { domain } = await params;
  const currentDomain = getDomain(domain);
  if (!currentDomain) return { title: "Domain not found | Concept Lab" };
  return { title: `${currentDomain.title} | Concept Lab` };
}

export default async function DomainPage({ params }) {
  const { domain } = await params;
  const currentDomain = getDomain(domain);
  if (!currentDomain) notFound();

  const tracks = getTracksByDomain(domain);
  const topicCount = tracks.reduce((acc, track) => acc + getNodesByTrack(track.id).length, 0);

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <Link href="/" className="backLink">
          ← Back to Concept Lab
        </Link>

        <header className={styles.hero}>
          <div className={styles.heroEyebrow}>{currentDomain.emoji ?? "📚"} Domain</div>
          <h1 className={styles.title}>{currentDomain.title}</h1>
          <p className={styles.subtitle}>{currentDomain.description}</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{tracks.length}</span>
              <span className={styles.statLabel}>Tracks</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{topicCount}</span>
              <span className={styles.statLabel}>Topics</span>
            </div>
          </div>
        </header>

        <div className={styles.grid}>
          {tracks.map((track) => {
            const trackTopics = getNodesByTrack(track.id);
            return (
              <Link
                key={track.id}
                href={getTrackHref(track.id)}
                className={styles.card}
                style={{ "--card-color": track.color ?? currentDomain.color ?? "#6366f1" }}
              >
                <div className={styles.cardEmoji}>{track.emoji ?? "📚"}</div>
                <h2 className={styles.cardTitle}>{track.title}</h2>
                <p className={styles.cardDesc}>{track.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.nodeCount}>{trackTopics.length} topics</span>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
