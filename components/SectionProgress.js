"use client";

/**
 * SectionProgress — rendered inside the section list page.
 * Shows a progress bar and marks each card as ✓ visited.
 * Entirely client-side; hydrates from localStorage.
 */

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import styles from "./SectionProgress.module.css";

export default function SectionProgress({ sectionId, nodes }) {
  const { isVisited } = useProgress();

  const visitedCount = nodes.filter((n) => isVisited(sectionId, n.slug)).length;
  const total = nodes.length;
  const pct = total === 0 ? 0 : Math.round((visitedCount / total) * 100);

  return (
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>
          {visitedCount} / {total} completed
        </span>
        <span className={styles.pct}>{pct}%</span>
      </div>
      <div className={styles.trackBg}>
        <div className={styles.trackFill} style={{ width: `${pct}%` }} />
      </div>

      {/* Node cards */}
      <div className={styles.grid}>
        {nodes.map((node) => {
          const done = isVisited(sectionId, node.slug);
          return (
            <Link
              key={node.slug}
              href={`/${sectionId}/${node.slug}`}
              className={`${styles.card} glass ${done ? styles.done : ""}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.order}>
                  {node.order > 0 ? node.order : "—"}
                </span>
                {done && <span className={styles.check}>✓</span>}
              </div>
              <h2 className={styles.cardTitle}>{node.title}</h2>
              <p className={styles.cardExcerpt}>{node.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
