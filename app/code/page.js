import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuthPage } from "@/lib/requireAuthPage";
import styles from "./page.module.css";

const ROOT = process.cwd();
const ALLOWED_PREFIXES = [
  path.join(ROOT, "content", "github_code"),
  path.join(ROOT, "scratch_pad", "github_code"),
];
const MAX_NOTES = 8;

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
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => absolute === prefix || absolute.startsWith(prefix + path.sep)
  );
  if (!allowed) {
    return null;
  }
  return absolute;
}

const NOTE_RULES = [
  {
    key: "graph",
    terms: ["stategraph", "messagegraph", "add_node", "add_edge", "set_entry_point", "conditional"],
    title: "Graph Structure",
    what: "This block defines the node/edge topology and execution path of the graph.",
    why: "Graph structure decides control flow, so mistakes here cause wrong routing and hard-to-debug behavior.",
  },
  {
    key: "state",
    terms: ["typeddict", "state", "annotated", "history", "intermediate_steps"],
    title: "State Contract",
    what: "This block defines what data the graph carries between nodes and how state fields are merged.",
    why: "A clear state contract prevents hidden coupling between nodes and makes multi-turn behavior reliable.",
  },
  {
    key: "tools",
    terms: ["tool", "toolnode", "bind_tools", "tool_calls", "execute_tools"],
    title: "Tool Execution Loop",
    what: "This block handles tool-call planning, execution, and returning tool output back to the model loop.",
    why: "Without this loop, agents either hallucinate actions or cannot ground answers with external evidence.",
  },
  {
    key: "prompt",
    terms: ["prompt", "chatprompttemplate", "messagesplaceholder", "systemmessage"],
    title: "Prompt & Role Design",
    what: "This block shapes model behavior using role instructions and prompt templates.",
    why: "Prompt contracts are the behavioral boundary of the system; weak prompts create inconsistent outputs.",
  },
  {
    key: "memory",
    terms: ["memorysaver", "sqlitesaver", "checkpointer", "thread_id", "checkpoint"],
    title: "Memory & Persistence",
    what: "This block persists conversation/graph state so future turns can reuse prior context.",
    why: "Durable memory is essential for coherent multi-turn systems and post-restart continuity.",
  },
  {
    key: "retrieval",
    terms: ["retriever", "chroma", "embeddings", "similarity", "mmr", "fusion", "rerank"],
    title: "Retrieval Pipeline",
    what: "This block covers document indexing/retrieval and relevance ranking before generation.",
    why: "Retrieval quality is the main lever for factual RAG output; bad retrieval leads to weak answers.",
  },
  {
    key: "fallback",
    terms: [],
    title: "Implementation Context",
    what: "This block is part of the topic implementation flow and should be read with surrounding logic.",
    why: "Understanding local context around this block helps connect syntax to system behavior.",
  },
];

function findLineMatches(lines, terms) {
  if (terms.length === 0) return [];
  const normalizedTerms = terms.map((term) => term.toLowerCase());
  const matches = [];

  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    const matchedTerms = normalizedTerms.filter((term) => lower.includes(term));
    if (matchedTerms.length > 0) {
      matches.push({
        lineNo: index + 1,
        matchedTerms,
      });
    }
  });

  return matches;
}

function buildHighlightBlocks(lines, matches) {
  if (matches.length === 0) {
    return [
      {
        start: 1,
        end: Math.min(lines.length, 8),
        terms: new Set(),
      },
    ];
  }

  const blocks = [];
  let current = {
    start: matches[0].lineNo,
    end: matches[0].lineNo,
    terms: new Set(matches[0].matchedTerms),
  };

  for (let i = 1; i < matches.length; i += 1) {
    const next = matches[i];
    if (next.lineNo - current.end <= 3) {
      current.end = next.lineNo;
      next.matchedTerms.forEach((term) => current.terms.add(term));
    } else {
      blocks.push(current);
      current = {
        start: next.lineNo,
        end: next.lineNo,
        terms: new Set(next.matchedTerms),
      };
    }
  }
  blocks.push(current);
  return blocks;
}

function chooseNoteRule(block, lines) {
  const snippet = String(lines[block.start - 1] ?? "").toLowerCase();
  let bestRule = NOTE_RULES[NOTE_RULES.length - 1];
  let bestScore = 0;

  for (const rule of NOTE_RULES) {
    if (!rule.terms.length) continue;
    const score = rule.terms.reduce((acc, term) => {
      if (block.terms.has(term)) return acc + 2;
      if (snippet.includes(term)) return acc + 1;
      return acc;
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return bestRule;
}

function buildLearningNotes(blocks, lines, focus) {
  return blocks.slice(0, MAX_NOTES).map((block, index) => {
    const rule = chooseNoteRule(block, lines);
    const sample = String(lines[block.start - 1] ?? "").trim();
    const sampleSnippet = sample.length > 110 ? `${sample.slice(0, 110)}...` : sample;
    const contextLine =
      sampleSnippet.length > 0
        ? `Key code near this block starts with: ${sampleSnippet}`
        : "This block contains setup or flow-control statements.";

    const what = index === 0 && focus
      ? `${rule.what} In this topic, it directly supports: ${focus}`
      : `${rule.what} ${contextLine}`;

    return {
      id: `note-${index + 1}`,
      title: rule.title,
      start: block.start,
      end: block.end,
      what,
      why: rule.why,
    };
  });
}

export default async function CodeViewerPage({ searchParams }) {
  await requireAuthPage("/code");
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
  const lineMatches = findLineMatches(lines, terms);
  const blocks = buildHighlightBlocks(lines, lineMatches);
  const learningNotes = buildLearningNotes(blocks, lines, focus);
  const matchedLineNumbers = new Set();
  blocks.forEach((block) => {
    for (let lineNo = block.start; lineNo <= block.end; lineNo += 1) {
      matchedLineNumbers.add(lineNo);
    }
  });

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

        <div className={styles.viewerGrid}>
          <div className={styles.codeFrame}>
            {lines.map((line, index) => {
              const lineNo = index + 1;
              const highlighted = matchedLineNumbers.has(lineNo);
              return (
                <div
                  key={lineNo}
                  id={`L${lineNo}`}
                  className={`${styles.lineRow} ${highlighted ? styles.lineRowHighlight : ""}`}
                >
                  <span className={styles.lineNo}>{lineNo}</span>
                  <code className={styles.lineCode}>{line || " "}</code>
                </div>
              );
            })}
          </div>

          <aside className={styles.notesPanel}>
            <h2 className={styles.notesTitle}>Learning Notes</h2>
            <p className={styles.notesIntro}>
              Each note explains what the highlighted block is doing and why it matters.
            </p>
            <div className={styles.noteList}>
              {learningNotes.map((note) => (
                <article key={note.id} className={styles.noteCard}>
                  <a href={`#L${note.start}`} className={styles.noteAnchor}>
                    Lines {note.start}{note.end !== note.start ? `-${note.end}` : ""}
                  </a>
                  <h3>{note.title}</h3>
                  <p><strong>What:</strong> {note.what}</p>
                  <p><strong>Why:</strong> {note.why}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
