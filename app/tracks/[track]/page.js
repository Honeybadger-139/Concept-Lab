import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDomain,
  getNodesByTrack,
  getNodesByTrackGrouped,
  getTrack,
  tracks,
} from "@/data/curriculumData";
import SectionProgress from "@/components/SectionProgress";
import styles from "@/app/[section]/section.module.css";

export async function generateStaticParams() {
  return tracks.map((track) => ({ track: track.id }));
}

export async function generateMetadata({ params }) {
  const { track } = await params;
  const currentTrack = getTrack(track);
  if (!currentTrack) return { title: "Track not found | Concept Lab" };
  return { title: `${currentTrack.title} | Concept Lab` };
}

export default async function TrackPage({ params }) {
  const { track } = await params;
  const currentTrack = getTrack(track);
  if (!currentTrack) notFound();

  const currentDomain = getDomain(currentTrack.domainId);
  const nodes = getNodesByTrack(track);
  const grouped = getNodesByTrackGrouped(track);

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <Link href={`/domains/${currentTrack.domainId}`} className="backLink">
          ← Back to {currentDomain?.title ?? "Domain"}
        </Link>

        <header className={styles.header}>
          <h1>{currentTrack.title}</h1>
          <p className={styles.description}>{currentTrack.description}</p>
        </header>

        <SectionProgress
          sectionId={currentTrack.sectionId}
          nodes={nodes}
          groupedByConcept={grouped}
          trackId={currentTrack.id}
        />
      </section>
    </main>
  );
}
