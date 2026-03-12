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
  const { visited } = useProgress();
  const visitedKeys = Array.from(visited);
  const lastVisited = visitedKeys.length > 0 ? visitedKeys[visitedKeys.length - 1] : null;

  let href = "/ml";
  let sectionLabel = "Machine Learning";
  let nodeLabel = "Start your first lesson";

  if (lastVisited) {
    const [sectionId, ...slugParts] = lastVisited.split("/");
    const slug = slugParts.join("/");
    if (sectionId && slug) {
      href = `/${sectionId}/${slug}`;
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
          {visitedKeys.length} topic{visitedKeys.length === 1 ? "" : "s"} visited
        </p>
      </div>
      <Link href={href} className={styles.cta}>
        {lastVisited ? "Resume" : "Start"}
      </Link>
    </section>
  );
}
