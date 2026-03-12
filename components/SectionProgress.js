"use client";

/**
 * SectionProgress — rendered inside the section list page.
 * Shows a progress bar and marks each card as ✓ visited.
 * For ML, nodes are grouped by concept (Fundamentals, Supervised Learning, etc.).
 * Entirely client-side; hydrates from localStorage.
 */

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useMemo, useState } from "react";
import styles from "./SectionProgress.module.css";

function estimateNodeMinutes(node) {
  const content = `${node?.excerpt ?? ""} ${String(node?.theory ?? "").replace(/<[^>]+>/g, " ")}`.trim();
  const words = content ? content.split(/\s+/).length : 0;
  return Math.max(2, Math.round(words / 180));
}

function detectNodeMode(node) {
  if (node?.tool && node?.animation) return "Lab";
  if (node?.tool || node?.animation) return "Interactive";
  return "Theory";
}

function NodeCard({ sectionId, node, isVisited }) {
  const done = isVisited(sectionId, node.slug);
  const estMins = estimateNodeMinutes(node);
  const mode = detectNodeMode(node);

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
      <div className={styles.cardMetaRow}>
        <span className={styles.metaChip}>{mode}</span>
        <span className={styles.metaChip}>{estMins} min</span>
      </div>
    </Link>
  );
}

export default function SectionProgress({ sectionId, nodes, groupedByConcept }) {
  const { isVisited } = useProgress();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const normalizedQuery = query.trim().toLowerCase();

  const visitedCount = nodes.filter((n) => isVisited(sectionId, n.slug)).length;
  const total = nodes.length;
  const pct = total === 0 ? 0 : Math.round((visitedCount / total) * 100);
  const remainingMinutes = nodes
    .filter((n) => !isVisited(sectionId, n.slug))
    .reduce((acc, n) => acc + estimateNodeMinutes(n), 0);

  const hasConceptFolders = groupedByConcept?.length > 0 && groupedByConcept[0].conceptTitle;
  const matchesFilters = (node) => {
    const title = String(node?.title ?? "").toLowerCase();
    const excerpt = String(node?.excerpt ?? "").toLowerCase();
    const done = isVisited(sectionId, node.slug);
    const queryMatch = normalizedQuery.length === 0 || title.includes(normalizedQuery) || excerpt.includes(normalizedQuery);
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && done) ||
      (statusFilter === "remaining" && !done);
    return queryMatch && statusMatch;
  };

  const filteredNodes = useMemo(
    () => nodes.filter((node) => matchesFilters(node)),
    [nodes, normalizedQuery, statusFilter, isVisited, sectionId]
  );

  const filteredGrouped = useMemo(() => {
    if (!hasConceptFolders) return [];
    return groupedByConcept
      .map((group) => ({ ...group, nodes: group.nodes.filter((node) => matchesFilters(node)) }))
      .filter((group) => group.nodes.length > 0);
  }, [groupedByConcept, hasConceptFolders, normalizedQuery, statusFilter, isVisited, sectionId]);

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
      <div className={styles.progressMeta}>
        <span>{remainingMinutes} min remaining</span>
        <span>Showing {filteredNodes.length} of {total} nodes</span>
      </div>

      <div className={styles.filtersRow}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          placeholder="Search topics in this section..."
          aria-label="Search topics in this section"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by completion status"
        >
          <option value="all">All</option>
          <option value="remaining">Not completed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {hasConceptFolders ? (
        <div className={styles.conceptGroups}>
          <h2 className={styles.conceptGroupsTitle}>Concepts Covered</h2>
          {filteredGrouped.length === 0 && (
            <p className={styles.emptyState}>No topics match the current filters.</p>
          )}
          {filteredGrouped.map(({ conceptId, conceptTitle, nodes: groupNodes }) => (
            <div key={conceptId ?? "all"} className={styles.conceptGroup}>
              {conceptTitle && (
                <div className={styles.conceptHeadingRow}>
                  <h3 className={styles.conceptHeading}>{conceptTitle}</h3>
                  <span className={styles.conceptSummary}>
                    {groupNodes.filter((node) => isVisited(sectionId, node.slug)).length}/{groupNodes.length} done • {" "}
                    {groupNodes
                      .filter((node) => !isVisited(sectionId, node.slug))
                      .reduce((acc, node) => acc + estimateNodeMinutes(node), 0)} min left
                  </span>
                </div>
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
          {filteredNodes.length === 0 && (
            <p className={styles.emptyState}>No topics match the current filters.</p>
          )}
          {filteredNodes.map((node) => (
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
