"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import styles from "./ContinueLearningCard.module.css";

const SECTION_LABELS = {
  ml: "Machine Learning",
  rag: "RAG Systems",
  langchain: "LangChain",
  langgraph: "LangGraph",
};

function toTitleCaseFromSlug(slug) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export default function ContinueLearningCard() {
  const { visited, lastVisited, suggestion, hydrated } = useProgress();
  const visitedKeys = Array.from(visited);

  let resumeHref = "/ml";
  let sectionLabel = "Machine Learning";
  let nodeLabel = "Start your first lesson";

  if (lastVisited) {
    const sectionId = String(lastVisited?.sectionId || "");
    const slug = String(lastVisited?.slug || "");
    if (sectionId && slug) {
      resumeHref = String(lastVisited?.href || `/${sectionId}/${slug}`);
      sectionLabel = SECTION_LABELS[sectionId] || "Concept Lab";
      nodeLabel = toTitleCaseFromSlug(slug);
    }
  }

  return (
    <section className={styles.card} aria-label="Continue learning">
      <div>
        <p className={styles.label}>Continue Learning</p>
        <p className={styles.title}>
          {sectionLabel}: {nodeLabel}
        </p>
        <p className={styles.meta}>
          {hydrated ? `${visitedKeys.length} topic${visitedKeys.length === 1 ? "" : "s"} visited` : "Loading progress..."}
        </p>
        {suggestion?.href && (
          <p className={styles.suggestion}>
            Next suggestion:{" "}
            <Link href={suggestion.href} className={styles.suggestionLink}>
              {suggestion.title || toTitleCaseFromSlug(suggestion.slug || "")}
            </Link>
          </p>
        )}
      </div>
      <Link href={resumeHref} className={styles.cta}>
        {lastVisited ? "Resume" : "Start"}
      </Link>
    </section>
  );
}
