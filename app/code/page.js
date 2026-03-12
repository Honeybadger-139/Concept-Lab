import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const ROOT = process.cwd();
const ALLOWED_PREFIX = path.join(ROOT, "content", "github_code");

export const metadata = {
  title: "Code Viewer | Concept Lab",
  description: "Topic-linked code walkthrough viewer with focused highlights.",
};

function parseTerms(rawTerms) {
  if (!rawTerms) return [];
  return String(rawTerms)
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function getSafeAbsolutePath(fileParam) {
  if (!fileParam || typeof fileParam !== "string") return null;
  const normalized = path.normalize(fileParam);
  const absolute = path.resolve(ROOT, normalized);
  if (!absolute.startsWith(ALLOWED_PREFIX + path.sep) && absolute !== ALLOWED_PREFIX) {
    return null;
  }
  return absolute;
}

export default async function CodeViewerPage({ searchParams }) {
  const params = await searchParams;
  const fileParam = params?.file;
  const fromPath = params?.from ? String(params.from) : "/";
  const focus = params?.focus ? String(params.focus) : "";
  const terms = parseTerms(params?.terms);
  const safeBackPath = fromPath.startsWith("/") && !fromPath.startsWith("//") ? fromPath : "/";

  if (!fileParam) {
    return (
      <main className={styles.main}>
        <section className="section-padding container">
          <Link href="/" className="backLink">← Back to home</Link>
          <h1 className={styles.title}>Code Viewer</h1>
          <p className={styles.muted}>No file was selected.</p>
        </section>
      </main>
    );
  }

  const absolutePath = getSafeAbsolutePath(String(fileParam));
  if (!absolutePath || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    notFound();
  }

  const relativePath = path.relative(ROOT, absolutePath);
  const fileText = fs.readFileSync(absolutePath, "utf8");
  const lines = fileText.split("\n");

  const matchedLineNumbers = new Set();
  if (terms.length > 0) {
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      if (terms.some((term) => lower.includes(term.toLowerCase()))) {
        matchedLineNumbers.add(index + 1);
      }
    });
  }

  if (matchedLineNumbers.size === 0) {
    for (let lineNo = 1; lineNo <= Math.min(lines.length, 8); lineNo += 1) {
      matchedLineNumbers.add(lineNo);
    }
  }

  return (
    <main className={styles.main}>
      <section className="section-padding container">
        <div className={styles.headerRow}>
          <Link href={safeBackPath} className="backLink">← Back to topic</Link>
        </div>

        <h1 className={styles.title}>Code Viewer</h1>
        <p className={styles.path}>
          <code>{relativePath}</code>
        </p>

        {focus && (
          <div className={styles.focusCard}>
            <h2>Topic Focus</h2>
            <p>{focus}</p>
          </div>
        )}

        <div className={styles.legend}>
          Highlighted lines are selected from topic focus terms.
        </div>

        <div className={styles.codeFrame}>
          {lines.map((line, index) => {
            const lineNo = index + 1;
            const highlighted = matchedLineNumbers.has(lineNo);
            return (
              <div
                key={lineNo}
                className={`${styles.lineRow} ${highlighted ? styles.lineRowHighlight : ""}`}
              >
                <span className={styles.lineNo}>{lineNo}</span>
                <code className={styles.lineCode}>{line || " "}</code>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
