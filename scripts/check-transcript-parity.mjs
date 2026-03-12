import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CURRICULUM_PATH = path.join(ROOT, "data", "curriculumData.js");
const TRANSCRIPTS_DIR = path.join(ROOT, "transcripts");

const SECTION_FROM_TRANSCRIPT_TOP = Object.freeze({
  machine_learning: "ml",
  rag_systems: "rag",
  langchain: "langchain",
  langgraph: "langgraph",
});

function normalizeSlug(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/^\d+(?:\.\d+)?-/, "")
    .replace(/regularisation/g, "regularization")
    .replace(/regularised/g, "regularized")
    .replace(/vectorisation/g, "vectorization")
    .replace(/visualisation/g, "visualization")
    .replace(/realtime/g, "real-time")
    .replace(/chat-models-cloud-history/g, "chat-models-chat-history-stored-in-cloud")
    .replace(/chat-models-history/g, "chat-models-passing-chat-history")
    .replace(/chat-models-real-time$/g, "chat-models-real-time-conversation")
    .replace(/prerequisites/g, "pre-requisites")
    .replace(
      /levels-of-autonomy-llm-applications/g,
      "levels-of-autonomy-in-llm-applications"
    )
    .replace(/rags-embeddings-vector-dbs/g, "rags-embeddings-and-vector-dbs")
    .replace(/agents-tools/g, "agents-and-tools")
    .replace(/supervised-regression/g, "supervised-learning-regression")
    .replace(/classification-week3/g, "classification")
    .replace(/gradient-descent-logistic$/g, "gradient-descent-logistic-regression")
    .replace(/overfitting-underfitting$/g, "overfitting-underfitting-addressing")
    .replace(/cost-visualisation/g, "cost-visualization")
    .replace(/intro-rag-course/g, "introduction-to-the-complete-rag-course")
    .replace(/what-is-rag$/g, "what-is-rag-tokens-embeddings-and-vector-databases")
    .replace(/coding-injection-pipeline/g, "coding-the-injection-pipeline")
    .replace(/coding-retrieval-pipeline/g, "coding-the-retrieval-pipeline")
    .replace(/cosine-similarity$/g, "cosine-similarity-explained")
    .replace(/answer-generation-llm/g, "answer-generation-with-llm")
    .replace(
      /character-recursive-splitter/g,
      "character-text-splitter-and-recursive-splitter"
    )
    .replace(/multimodal-rag$/g, "multimodal-rag-with-images-and-documents")
    .replace(/advanced-document-retrieval/g, "advanced-documental-retrieval-techniques")
    .replace(/reflection-agent-building-graph/g, "reflection-agent-building-the-graph")
    .replace(/multi-query-rag$/g, "multi-query-rag-for-better-search-results")
    .replace(/reciprocal-rank-fusion$/g, "reciprocal-rank-fusion-for-enhanced-rag-performance")
    .replace(/hybrid-search$/g, "hybrid-search-combining-vector-and-keyword-search")
    .replace(/rag-reranking-next-steps/g, "rag-reranking-and-next-steps");
}

function getTranscriptTopics() {
  const rows = [];
  for (const top of fs.readdirSync(TRANSCRIPTS_DIR)) {
    const topPath = path.join(TRANSCRIPTS_DIR, top);
    if (!fs.statSync(topPath).isDirectory()) continue;
    const sectionId = SECTION_FROM_TRANSCRIPT_TOP[top];
    if (!sectionId) continue;

    const files = [];
    const stack = [topPath];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const p = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(p);
        } else if (entry.isFile() && entry.name.endsWith(".txt")) {
          files.push(p);
        }
      }
    }

    for (const filePath of files) {
      const base = path.basename(filePath, ".txt");
      const m = base.match(/^([0-9]+(?:\.[0-9]+)?)_(.*)$/);
      if (!m) continue;
      rows.push({
        sectionId,
        order: Number(m[1]),
        slug: m[2].replaceAll("_", "-"),
        source: path.relative(ROOT, filePath),
      });
    }
  }
  rows.sort((a, b) => a.sectionId.localeCompare(b.sectionId) || a.order - b.order);
  return rows;
}

function getCurriculumNodes() {
  const src = fs.readFileSync(CURRICULUM_PATH, "utf8");
  const rows = [];
  const re = /\{\n\s+slug: "([^"]+)",\n\s+sectionId: "([^"]+)",[\s\S]*?\n\s+order: ([0-9.]+),/g;
  let m;
  while ((m = re.exec(src))) {
    const [, slug, sectionId, orderRaw] = m;
    if (!["ml", "rag", "langchain", "langgraph"].includes(sectionId)) continue;
    rows.push({ slug, sectionId, order: Number(orderRaw) });
  }
  return rows;
}

function getLangGraphCanonicalRowsIfPresent() {
  const src = fs.readFileSync(CURRICULUM_PATH, "utf8");
  const mapMatch = src.match(/const langGraphCanonicalTopicMap = Object\.freeze\(\{([\s\S]*?)\}\);/);
  if (!mapMatch) return null;
  const body = mapMatch[1];
  const rows = [];
  const re = /"([^"]+)": \{ order: ([0-9.]+), title: "([^"]+)" \}/g;
  let m;
  while ((m = re.exec(body))) {
    rows.push({ slug: m[1], order: Number(m[2]), title: m[3] });
  }
  rows.sort((a, b) => a.order - b.order);
  return rows;
}

function bySection(rows, sectionId) {
  return rows.filter((r) => r.sectionId === sectionId).sort((a, b) => a.order - b.order);
}

function parityForSection(sectionId, transcripts, curriculum) {
  const t = bySection(transcripts, sectionId);
  const c = bySection(curriculum, sectionId);

  const failures = [];
  if (t.length !== c.length) {
    failures.push(
      `[${sectionId}] Count mismatch: transcripts=${t.length}, curriculum=${c.length}`
    );
  }

  const n = Math.max(t.length, c.length);
  for (let i = 0; i < n; i += 1) {
    const tr = t[i];
    const cu = c[i];
    if (!tr || !cu) {
      failures.push(`[${sectionId}] Missing row at index ${i}: transcript=${Boolean(tr)} curriculum=${Boolean(cu)}`);
      continue;
    }
    if (Math.abs(tr.order - cu.order) > 1e-9) {
      failures.push(`[${sectionId}] Order mismatch at index ${i}: transcript=${tr.order} curriculum=${cu.order}`);
    }
    const a = normalizeSlug(tr.slug);
    const b = normalizeSlug(cu.slug);
    if (a !== b) {
      failures.push(
        `[${sectionId}] Slug mismatch at order ${tr.order}: transcript=${tr.slug} curriculum=${cu.slug}`
      );
    }
  }

  return { sectionId, transcriptCount: t.length, curriculumCount: c.length, failures };
}

function main() {
  const transcripts = getTranscriptTopics();
  const allNodes = getCurriculumNodes();

  const canonicalLangGraph = getLangGraphCanonicalRowsIfPresent();
  const curriculum = {
    ml: bySection(allNodes, "ml").filter((n) => n.slug !== "advanced-placeholder"),
    rag: bySection(allNodes, "rag"),
    langchain: bySection(allNodes, "langchain"),
    langgraph: canonicalLangGraph
      ? canonicalLangGraph.map((n) => ({ sectionId: "langgraph", slug: n.slug, order: n.order }))
      : bySection(allNodes, "langgraph"),
  };

  const sections = ["ml", "rag", "langchain", "langgraph"];
  const results = sections.map((sid) =>
    parityForSection(sid, transcripts, curriculum[sid])
  );

  let hasFailures = false;
  for (const r of results) {
    console.log(
      `[${r.sectionId}] transcripts=${r.transcriptCount} curriculum=${r.curriculumCount} failures=${r.failures.length}`
    );
    if (r.failures.length) {
      hasFailures = true;
      for (const f of r.failures) console.log(`  - ${f}`);
    }
  }

  if (hasFailures) {
    process.exitCode = 1;
    return;
  }
  console.log("Parity check passed.");
}

main();
