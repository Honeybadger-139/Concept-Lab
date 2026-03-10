"use client";

/**
 * SectionProgress — rendered inside the section list page.
 * Shows a progress bar and marks each card as ✓ visited.
 * For ML, nodes are grouped by concept (Fundamentals, Supervised Learning, etc.).
 * Entirely client-side; hydrates from localStorage.
 */

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import styles from "./SectionProgress.module.css";

function NodeCard({ sectionId, node, isVisited }) {
  const done = isVisited(sectionId, node.slug);
  return (
    <Link
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
}

export default function SectionProgress({ sectionId, nodes, groupedByConcept }) {
  const { isVisited } = useProgress();

  const visitedCount = nodes.filter((n) => isVisited(sectionId, n.slug)).length;
  const total = nodes.length;
  const pct = total === 0 ? 0 : Math.round((visitedCount / total) * 100);

  const hasConceptFolders = groupedByConcept?.length > 0 && groupedByConcept[0].conceptTitle;

  return (
    <div className={styles.wrapper}>
      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>
          {visitedCount} / {total} completed
        </span>
        <span className={styles.pct}>{pct}%</span>
      </div>
      <div className={styles.trackBg}>
        <div className={styles.trackFill} style={{ width: `${pct}%` }} />
      </div>

      {hasConceptFolders ? (
        <div className={styles.conceptGroups}>
          <h2 className={styles.conceptGroupsTitle}>Concepts Covered</h2>
          {groupedByConcept.map(({ conceptId, conceptTitle, nodes: groupNodes }) => (
            <div key={conceptId ?? "all"} className={styles.conceptGroup}>
              {conceptTitle && (
                <h3 className={styles.conceptHeading}>{conceptTitle}</h3>
              )}
              <div className={styles.grid}>
                {groupNodes.map((node) => (
                  <NodeCard
                    key={node.slug}
                    sectionId={sectionId}
                    node={node}
                    isVisited={isVisited}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {nodes.map((node) => (
            <NodeCard
              key={node.slug}
              sectionId={sectionId}
              node={node}
              isVisited={isVisited}
            />
          ))}
        </div>
      )}
    </div>
  );
}
