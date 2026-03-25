import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { getNodesByTrack, getTrack } from "../data/curriculumData.js";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "data", "generated", "universalLearningEnginePayload.json");
const DEFAULT_BATCH_SIZE = Math.max(1, Number(process.env.ULE_BATCH_SIZE ?? 4));
const DEFAULT_TOPIC_BATCH_PARALLELISM = Math.max(
  1,
  Number(process.env.ULE_TOPIC_BATCH_PARALLELISM ?? 3)
);

const MAIN_TOPIC_SEQUENCE = Object.freeze([
  "supervised-learning-algorithms",
  "advanced-learning-algorithms",
  "unsupervised-recommenders-reinforcement-learning",
  "rag",
  "langchain",
  "langgraph",
  "docker",
]);

const TRANSCRIPT_DIRS_BY_TRACK = Object.freeze({
  "supervised-learning-algorithms": [
    "content/transcripts/machine_learning/supervised_learning_algorithms",
    "scratch_pad/transcripts/machine_learning/supervised_learning_algorithms",
  ],
  "advanced-learning-algorithms": [
    "content/transcripts/machine_learning/advanced_learning_algorithms",
    "scratch_pad/transcripts/machine_learning/advanced_learning_algorithms",
  ],
  "unsupervised-recommenders-reinforcement-learning": [
    "content/transcripts/machine_learning/unsupervised_recommenders_reinforcement_learning",
    "scratch_pad/transcripts/machine_learning/unsupervised_recommenders_reinforcement_learning",
  ],
  rag: ["content/transcripts/rag_systems", "scratch_pad/transcripts/rag_systems"],
  langchain: ["content/transcripts/langchain", "scratch_pad/transcripts/langchain"],
  langgraph: ["content/transcripts/langgraph", "scratch_pad/transcripts/langgraph"],
  docker: ["content/transcripts/docker", "scratch_pad/transcripts/docker"],
});

const PDF_SOURCES = Object.freeze([
  {
    id: "docker-cheat-sheet",
    title: "Docker Cheat Sheet",
    path: "scratch_pad/pdfs/DockerCheatSheet.pdf",
    tracks: new Set(["docker"]),
  },
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    path: "scratch_pad/github_code/rag-for-beginners/docs/attention-is-all-you-need.pdf",
    tracks: new Set(["rag", "langchain", "langgraph", "advanced-learning-algorithms"]),
  },
]);

const TRACK_CODE_DIRS = Object.freeze({
  rag: ["scratch_pad/github_code/rag-for-beginners", "content/github_code/rag-for-beginners"],
  langchain: ["scratch_pad/github_code/langchain-course", "content/github_code/langchain-course"],
  langgraph: ["scratch_pad/github_code/langgraph", "content/github_code/langgraph"],
  docker: ["scratch_pad/github_code/docker", "content/github_code/docker"],
});

const CODE_REFERENCE_PATTERNS = [
  /\bcode\b/i,
  /\bnotebook\b/i,
  /\.py\b/i,
  /\.ipynb\b/i,
  /\bimplementation\b/i,
  /\bgithub\b/i,
  /\brepo\b/i,
  /\bscript\b/i,
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "with",
  "from",
  "this",
  "that",
  "your",
  "into",
  "what",
  "when",
  "where",
  "why",
  "how",
  "over",
  "under",
  "for",
  "use",
  "using",
  "between",
  "about",
  "into",
  "across",
  "through",
  "build",
  "building",
]);

const TRANSCRIPT_NOISE_PATTERNS = [
  /\[MUSIC\]/gi,
  /\bhello guys\b/gi,
  /\ball right guys\b/gi,
  /\bi'll see you in the next[^.?!]*/gi,
  /\bif you have any questions[^.?!]*/gi,
  /\bstructured\.\s*explained\.\s*applied\./gi,
];

const TIME_MARKER_PATTERNS = [
  /\[(?:\d{2}:){1,2}\d{2}\]/g,
  /\((?:\d{2}:){1,2}\d{2}\)/g,
  /Timestamp\s+(?:\d{2}:){1,2}\d{2}\.?\s*/gi,
  /Transcript\s+anchor\s*(?:\((?:\d{2}:){1,2}\d{2}\))?\s*:?\s*/gi,
  /\b(?:\d{2}:){1,2}\d{2}\b/g,
];

const pdfTextCache = new Map();
const transcriptIndexCache = new Map();
const trackCodeFileCache = new Map();

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toSafeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function stripHtmlTags(value) {
  return String(value ?? "").replace(/<[^>]+>/g, " ");
}

function stripTimeMarkers(value) {
  let text = String(value ?? "");
  for (const pattern of TIME_MARKER_PATTERNS) {
    text = text.replace(pattern, " ");
  }
  return text;
}

function normalizeTextbookLanguage(value) {
  let text = String(value ?? "");
  text = text.replace(/\bTranscript Deepening\b/gi, "Deepening Notes");
  text = text.replace(/\bTranscript Coverage\b/gi, "Coverage");
  text = text.replace(/\bTranscript-backed\b/gi, "Source-backed");
  text = text.replace(/\bLecture-backed\b/gi, "Source-backed");
  text = text.replace(/\bTranscript-grounded\b/gi, "Source-grounded");
  text = text.replace(/\bTranscript\b/g, "Source Note");
  text = text.replace(/\btranscript\b/g, "source note");
  text = text.replace(/\bLecture\b/g, "Topic");
  text = text.replace(/\blecture\b/g, "topic");
  text = text.replace(/लेक्चर/g, "टॉपिक");
  text = text.replace(/वीडियो|विडियो/g, "मॉड्यूल");
  text = text.replace(/कोर्स/g, "मॉड्यूल");
  return text;
}

function sanitizePlainText(value) {
  return toSafeText(normalizeTextbookLanguage(stripTimeMarkers(value)));
}

function sanitizeHtmlText(value) {
  return normalizeTextbookLanguage(stripTimeMarkers(String(value ?? "")));
}

function normalizeSlug(raw) {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/^adv-/, "")
    .replace(/^urrl-/, "")
    .replace(/^\d+(?:\.\d+)?-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitSentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 20 && sentence.length <= 420);
}

function chunkTextFallback(text, chunkSize = 260, step = 210) {
  const chunks = [];
  const cleaned = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!cleaned) return chunks;
  for (let start = 0; start < cleaned.length; start += step) {
    const slice = cleaned.slice(start, start + chunkSize).trim();
    if (slice.length < 25) continue;
    chunks.push(slice);
  }
  return chunks.slice(0, 120);
}

function cleanTranscript(raw) {
  let text = String(raw ?? "").replace(/\r/g, " ").replace(/\n/g, " ");
  for (const pattern of TRANSCRIPT_NOISE_PATTERNS) text = text.replace(pattern, " ");
  return sanitizePlainText(text);
}

function scoreSentence(sentence, topicTerms = []) {
  const lower = sentence.toLowerCase();
  let score = 0;
  for (const term of topicTerms) {
    if (lower.includes(term)) score += 2;
  }
  if (lower.includes("because") || lower.includes("tradeoff") || lower.includes("however")) score += 2;
  if (/\d/.test(lower)) score += 1;
  if (sentence.length >= 80 && sentence.length <= 200) score += 1;
  return score;
}

function inferTopicTerms(node) {
  return Array.from(
    new Set(
      `${node.slug} ${node.title} ${node.excerpt ?? ""}`
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 4 && !STOP_WORDS.has(token))
    )
  ).slice(0, 12);
}

function inferTradeoffs(node) {
  const source = `${node.slug} ${node.title} ${node.excerpt ?? ""}`.toLowerCase();
  if (source.includes("rag") || source.includes("retriev") || source.includes("chunk")) {
    return [
      "Higher recall often increases context noise; reranking and filtering are required to keep precision high.",
      "Smaller chunks improve semantic precision but can break cross-sentence context needed for accurate answers.",
      "Aggressive grounding reduces hallucinations but can increase abstentions when retrieval coverage is weak.",
    ];
  }
  if (source.includes("docker") || source.includes("container") || source.includes("compose")) {
    return [
      "Immutable images improve reproducibility, but frequent rebuilds increase CI cost without layer optimization.",
      "Container isolation improves dependency safety, but operational complexity grows around networking and storage.",
      "Pinning versions stabilizes releases, but can delay security upgrades if dependency refresh cycles are weak.",
    ];
  }
  if (source.includes("langgraph") || source.includes("agent") || source.includes("tool")) {
    return [
      "More agent autonomy increases adaptability but also increases non-determinism and debugging effort.",
      "Tool-heavy loops improve grounding, but latency and failure surfaces rise with each external dependency.",
      "Fine-grained state graphs improve control, but poor state contracts can create brittle routing behavior.",
    ];
  }
  if (source.includes("langchain") || source.includes("chain") || source.includes("prompt")) {
    return [
      "Composable chains improve reuse, but hidden prompt coupling can create brittle downstream behavior.",
      "Adding memory improves continuity, but unbounded history growth raises token cost and drift risk.",
      "Structured output parsing improves reliability, but strict schemas may reject useful free-form responses.",
    ];
  }
  return [
    "More expressive models improve fit but can reduce interpretability and raise overfitting risk.",
    "Higher optimization speed can reduce training time but may increase instability if learning dynamics are not monitored.",
    "Feature-rich pipelines improve performance ceilings but increase maintenance and monitoring complexity.",
  ];
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildInterviewReadyTheory(node, transcriptHighlights) {
  const theory = sanitizeHtmlText(String(node.theory ?? ""));
  const tradeoffs = inferTradeoffs(node);
  const transcriptList = transcriptHighlights
    .map((line) => `<li>${escapeHtml(sanitizePlainText(line))}</li>`)
    .join("");
  const tradeoffList = tradeoffs.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  return sanitizeHtmlText(`${theory}
<h3>Interview-Ready Deepening</h3>
<p><b>Source-backed reinforcement:</b> these points add detail beyond short-duration UI hints and emphasize production tradeoffs.</p>
<ul>${transcriptList}</ul>
<h4>Tradeoffs You Should Be Able to Explain</h4>
<ul>${tradeoffList}</ul>`);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function listTranscriptEntries(trackId) {
  if (transcriptIndexCache.has(trackId)) return transcriptIndexCache.get(trackId);
  const dirs = TRANSCRIPT_DIRS_BY_TRACK[trackId] ?? [];
  const rows = [];
  for (const relativeDir of dirs) {
    const absDir = path.join(ROOT, relativeDir);
    if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) continue;
    const files = fs.readdirSync(absDir).filter((name) => name.endsWith(".txt"));
    for (const fileName of files) {
      const match = fileName.match(/^(\d+(?:\.\d+)?)_(.+)\.txt$/);
      if (match) {
        rows.push({
          order: Number(match[1]),
          slug: match[2].replaceAll("_", "-"),
          path: path.join(absDir, fileName),
        });
      } else {
        rows.push({
          order: 1,
          slug: fileName.replace(/\.txt$/, "").replaceAll("_", "-"),
          path: path.join(absDir, fileName),
        });
      }
    }
  }
  rows.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  transcriptIndexCache.set(trackId, rows);
  return rows;
}

function findTranscriptForNode(trackId, node) {
  const entries = listTranscriptEntries(trackId);
  const exactOrder = entries.find((entry) => Math.abs(entry.order - Number(node.order)) < 1e-9);
  if (exactOrder) return exactOrder;

  const targetSlug = normalizeSlug(node.slug);
  const slugMatch = entries.find((entry) => normalizeSlug(entry.slug) === targetSlug);
  if (slugMatch) return slugMatch;
  return null;
}

function listFilesRecursive(absDir) {
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) return [];
  const out = [];
  const stack = [absDir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        out.push(entryPath);
      }
    }
  }
  return out;
}

function getTrackCodeFiles(trackId) {
  if (trackCodeFileCache.has(trackId)) return trackCodeFileCache.get(trackId);
  const dirs = TRACK_CODE_DIRS[trackId] ?? [];
  const files = [];
  for (const relativeDir of dirs) {
    const absDir = path.join(ROOT, relativeDir);
    const found = listFilesRecursive(absDir)
      .filter((filePath) => /\.(py|ipynb|js|ts|tsx|md)$/i.test(filePath))
      .map((filePath) => path.relative(ROOT, filePath));
    files.push(...found);
  }
  const deduped = Array.from(new Set(files)).sort();
  trackCodeFileCache.set(trackId, deduped);
  return deduped;
}

function transcriptMentionsCode(cleanedTranscript) {
  return CODE_REFERENCE_PATTERNS.some((pattern) => pattern.test(cleanedTranscript));
}

function inferAutoCodeGuide(trackId, node, cleanedTranscript) {
  if (!transcriptMentionsCode(cleanedTranscript)) return null;
  const candidateFiles = getTrackCodeFiles(trackId);
  if (candidateFiles.length === 0) return null;

  const terms = inferTopicTerms(node);
  const scored = candidateFiles
    .map((filePath) => {
      const lower = filePath.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (lower.includes(term)) score += 2;
      }
      const orderToken = String(node.order).replace(".5", "");
      if (lower.match(new RegExp(`(^|[\\/_-])${orderToken}([\\/_.-]|$)`))) score += 2;
      if (lower.includes(normalizeSlug(node.slug))) score += 3;
      return { filePath, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.filePath);

  if (scored.length === 0) return null;
  return {
    summary: "Auto-mapped source-mentioned code references from local GitHub mirror.",
    files: scored.map((filePath) => ({
      path: filePath,
      focus: `Auto-matched from source/code cues for ${node.title}.`,
      highlightTerms: inferTopicTerms(node),
    })),
    checkpoints: [
      "Read the control flow in file order before tuning details.",
      "Trace how data/state moves through each core function.",
      "Tie each implementation choice back to theory and tradeoffs.",
    ],
  };
}

function inferFallbackCodeGuide(trackId, node) {
  const candidateFiles = getTrackCodeFiles(trackId);
  const terms = inferTopicTerms(node);

  const scored = candidateFiles
    .map((filePath) => {
      const lower = filePath.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (lower.includes(term)) score += 2;
      }
      if (lower.includes(normalizeSlug(node.slug))) score += 3;
      if (/\.(py|ipynb)$/i.test(filePath)) score += 1;
      return { filePath, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((row) => row.filePath);

  const files = scored.map((filePath) => ({
    path: filePath,
    focus: `Reference implementation path for ${sanitizePlainText(node.title)}.`,
    highlightTerms: terms,
  }));

  return {
    summary:
      files.length > 0
        ? "Topic-aligned code references for conceptual-to-implementation mapping."
        : "Concept-to-code walkthrough checklist for this topic.",
    files,
    checkpoints: [
      "Define input/output contract before reading implementation details.",
      "Map each conceptual step to one concrete function/class decision.",
      "Call out one tradeoff and one failure mode in interview wording.",
    ],
  };
}

function languageFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".py") return "python";
  if (ext === ".ipynb") return "json";
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return "javascript";
  if (ext === ".ts") return "typescript";
  if (ext === ".tsx") return "tsx";
  if (ext === ".md") return "markdown";
  if (ext === ".sh") return "bash";
  return "";
}

function deriveHighlightTerms(focus = "", node = null) {
  const seeded = `${focus} ${node?.slug ?? ""} ${node?.title ?? ""}`
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
  const terms = new Set(seeded);
  const source = `${focus} ${node?.slug ?? ""}`.toLowerCase();
  if (source.includes("graph")) terms.add("stategraph");
  if (source.includes("tool")) terms.add("tool");
  if (source.includes("retriev")) terms.add("retriever");
  if (source.includes("prompt")) terms.add("prompt");
  if (source.includes("memory")) terms.add("checkpointer");
  return Array.from(terms).slice(0, 12);
}

function explainCodeLine(line) {
  const trimmed = line.trim();
  if (/^(from|import)\s/.test(trimmed)) return "Imports a dependency required for this implementation step.";
  if (/^(def|class)\s/.test(trimmed)) return "Declares a core unit of logic that shapes the execution flow.";
  if (/^\s*return\b/.test(trimmed)) return "Returns a value consumed by the next stage in the pipeline.";
  if (trimmed.includes("StateGraph") || trimmed.includes("MessageGraph")) {
    return "Builds graph topology, which controls agent routing and loop behavior.";
  }
  if (trimmed.includes("retriever") || trimmed.includes("similarity")) {
    return "Configures retrieval behavior, directly affecting answer grounding quality.";
  }
  if (trimmed.includes("tool") || trimmed.includes("bind_tools")) {
    return "Connects tool-calling capability, enabling the model to query external context.";
  }
  if (trimmed.includes("prompt") || trimmed.includes("ChatPromptTemplate")) {
    return "Defines prompt contract that governs model behavior and response structure.";
  }
  if (trimmed.includes("checkpointer") || trimmed.includes("thread_id")) {
    return "Persists state across turns for durable multi-step conversations.";
  }
  return "Contributes to the end-to-end behavior of this topic's implementation path.";
}

function collectLineMatches(lines, terms) {
  const loweredTerms = terms.map((term) => term.toLowerCase());
  const matches = [];
  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const lower = rawLine.toLowerCase();
    const hasTerm = loweredTerms.some((term) => lower.includes(term));
    if (!hasTerm) continue;
    if (rawLine.trim().length === 0) continue;
    matches.push({ line: i + 1, code: rawLine.trim() });
    if (matches.length >= 8) break;
  }

  if (matches.length === 0) {
    for (let i = 0; i < lines.length; i += 1) {
      const rawLine = lines[i].trim();
      if (!rawLine) continue;
      if (/^(def|class|function|const|let|from|import)\b/.test(rawLine)) {
        matches.push({ line: i + 1, code: rawLine });
      }
      if (matches.length >= 6) break;
    }
  }

  if (matches.length === 0) {
    for (let i = 0; i < Math.min(lines.length, 6); i += 1) {
      const rawLine = lines[i].trim();
      if (rawLine) matches.push({ line: i + 1, code: rawLine });
    }
  }
  return matches;
}

function buildCodeGrounding(trackId, node, cleanedTranscript) {
  const guide =
    node.codeGuide ??
    inferAutoCodeGuide(trackId, node, cleanedTranscript) ??
    inferFallbackCodeGuide(trackId, node);
  if (!guide) {
    return { files: [], walkthroughMarkdown: "", codeGuide: null };
  }

  const guideFiles = Array.isArray(guide.files) ? guide.files : [];
  if (guideFiles.length === 0) {
    return { files: [], walkthroughMarkdown: "", codeGuide: guide };
  }

  const fileEntries = [];
  const markdownChunks = [];

  for (const entry of guideFiles) {
    const relativePath = entry.path ?? entry.sourcePath;
    if (!relativePath) continue;
    const absPath = path.join(ROOT, relativePath);
    if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) continue;

    const fileText = fs.readFileSync(absPath, "utf8");
    const lines = fileText.split("\n");
    const terms = Array.isArray(entry.highlightTerms) && entry.highlightTerms.length > 0
      ? entry.highlightTerms
      : deriveHighlightTerms(entry.focus, node);
    const matches = collectLineMatches(lines, terms);
    const language = languageFromPath(relativePath);

    const numberedSnippet = matches
      .map((match) => `${String(match.line).padStart(4, " ")} | ${match.code}`)
      .join("\n");

    const lineByLine = matches.map((match) => ({
      line: match.line,
      code: match.code,
      explanation: explainCodeLine(match.code),
    }));

    const markdown = [
      `### ${relativePath}`,
      entry.focus ? `Focus: ${entry.focus}` : "Focus: Implementation walkthrough",
      `\`\`\`${language}`,
      numberedSnippet,
      "```",
      ...lineByLine.map((item) => `- L${item.line}: ${item.explanation}`),
    ].join("\n");

    markdownChunks.push(markdown);
    fileEntries.push({
      path: relativePath,
      focus: entry.focus ?? "",
      lineByLine,
      codeBlock: `\`\`\`${language}\n${numberedSnippet}\n\`\`\``,
    });
  }

  return {
    codeGuide: guide,
    files: fileEntries,
    walkthroughMarkdown: markdownChunks.join("\n\n"),
  };
}

function extractPdfTextSnippet(relativePdfPath) {
  if (pdfTextCache.has(relativePdfPath)) return pdfTextCache.get(relativePdfPath);

  const absPath = path.join(ROOT, relativePdfPath);
  if (!fs.existsSync(absPath)) {
    pdfTextCache.set(relativePdfPath, "");
    return "";
  }

  const pythonCode = [
    "import re, sys",
    "from pypdf import PdfReader",
    "reader = PdfReader(sys.argv[1])",
    "parts = []",
    "for page in reader.pages[:3]:",
    "    parts.append(page.extract_text() or '')",
    "text = re.sub(r'\\s+', ' ', ' '.join(parts)).strip()",
    "print(text[:5000])",
  ].join("\n");

  try {
    const out = execFileSync("python3", ["-c", pythonCode, absPath], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 1024 * 1024 * 4,
    });
    const cleaned = toSafeText(out);
    pdfTextCache.set(relativePdfPath, cleaned);
    return cleaned;
  } catch {
    pdfTextCache.set(relativePdfPath, "");
    return "";
  }
}

function getPdfInsights(trackId, node) {
  const relevantPdfs = PDF_SOURCES.filter((pdf) => pdf.tracks.has(trackId));
  const nodeTerms = inferTopicTerms(node);
  const insights = [];

  for (const pdf of relevantPdfs) {
    const extractedText = extractPdfTextSnippet(pdf.path);
    if (!extractedText) continue;
    const sentences = splitSentences(extractedText).slice(0, 80);
    const scored = sentences
      .map((sentence) => ({
        sentence,
        score: scoreSentence(sentence, nodeTerms),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((row) => row.sentence);

    insights.push({
      title: pdf.title,
      reference: pdf.path,
      citations: scored,
      note: "PDF enrichment excerpt chosen to add formal language and definitions.",
    });
  }
  return insights;
}

function buildInteractiveProposal(node) {
  const source = `${node.slug} ${node.title}`.toLowerCase();
  const proposals = [];

  if (node.animation || node.tool) {
    proposals.push({
      type: "react-component",
      name: node.animation || node.tool,
      rationale: "Existing Concept Lab interactive component already mapped for this topic.",
      implementationHint: "Reuse current component and add progressive controls for interview-style drills.",
    });
  }

  if (source.includes("backprop") || source.includes("gradient")) {
    proposals.push({
      type: "svg-diagram",
      name: "BackpropagationFlowDiagram",
      rationale: "Visualize forward pass, loss gradient propagation, and parameter updates by layer.",
      implementationHint: "Use animated arrows and step-wise Jacobian labels.",
    });
  } else if (source.includes("retriev") || source.includes("rag")) {
    proposals.push({
      type: "react-component",
      name: "RetrievalDecisionWorkbench",
      rationale: "Show query rewrite, retrieval, rerank, and final answer grounding path.",
      implementationHint: "Include toggles for chunk size, top-k, reranker on/off.",
    });
  } else if (source.includes("docker") || source.includes("container")) {
    proposals.push({
      type: "svg-diagram",
      name: "ContainerLifecycleFlow",
      rationale: "Explain image build, container run, volume/network attach, and logs/inspect path.",
      implementationHint: "Add layered image visualization and port mapping overlay.",
    });
  } else {
    proposals.push({
      type: "svg-diagram",
      name: "ConceptMechanismMap",
      rationale: "Map input -> transformation -> decision pipeline for rapid interview explanation.",
      implementationHint: "Use three-lane flow: data, model logic, operational outcomes.",
    });
  }

  return proposals;
}

function synthesizeInterviewAnswer(node, question, transcriptHighlights = []) {
  const anchor = transcriptHighlights[0] ?? node.example ?? node.excerpt ?? "";
  const tradeoff = inferTradeoffs(node)[0] ?? "State explicit tradeoffs and failure handling.";
  return `Strong answer structure: define the concept in one sentence, ground it in a concrete scenario (${anchor}), then explain one tradeoff (${tradeoff}) and how you'd monitor it in production.`;
}

function buildTieredInterview(node, transcriptHighlights = []) {
  const prep = node.interviewPrep ?? {};
  const questions = Array.isArray(prep.questions) ? prep.questions : [];
  const answers = Array.isArray(prep.answers) ? prep.answers : [];

  const pairs = questions.map((question, index) => ({
    question: sanitizePlainText(question),
    answer:
      sanitizePlainText(String(answers[index] ?? "").trim()) ||
      sanitizePlainText(synthesizeInterviewAnswer(node, question, transcriptHighlights)),
  }));

  const tiered = { beginner: [], intermediate: [], expert: [] };
  if (pairs.length === 0) return tiered;

  const beginnerCut = Math.max(1, Math.ceil(pairs.length / 3));
  const intermediateCut = Math.max(beginnerCut, Math.ceil((pairs.length * 2) / 3));

  pairs.forEach((pair, index) => {
    if (index < beginnerCut) {
      tiered.beginner.push(pair);
    } else if (index < intermediateCut) {
      tiered.intermediate.push(pair);
    } else {
      tiered.expert.push(pair);
    }
  });

  if (prep.seniorTip) {
    tiered.expert.push({
      question: "How would you explain this in a production interview with tradeoffs?",
      answer: sanitizePlainText(prep.seniorTip),
    });
  }

  return tiered;
}

function buildActiveRecallCards(node, transcriptHighlights) {
  if (Array.isArray(node.flashCards) && node.flashCards.length > 0) {
    return node.flashCards.map((card) => ({
      q: sanitizePlainText(card?.q),
      a: sanitizePlainText(card?.a),
    }));
  }
  return transcriptHighlights.slice(0, 4).map((line, index) => ({
    q: `What is the key idea from highlight ${index + 1}?`,
    a: sanitizePlainText(line),
  }));
}

function buildBeginnerExamples(node, transcriptHighlights) {
  const examples = [];
  if (node.example) {
    examples.push({
      level: "beginner",
      title: "Guided Starter Example",
      explanation: sanitizePlainText(node.example),
    });
  }

  for (const line of transcriptHighlights.slice(0, 2)) {
    examples.push({
      level: "beginner",
      title: "Source-grounded Practical Scenario",
      explanation: sanitizePlainText(line),
    });
  }

  if (examples.length === 0) {
    examples.push({
      level: "beginner",
      title: "Foundational Walkthrough",
      explanation: `Start with a minimal implementation of ${sanitizePlainText(node.title)}, then gradually add one production constraint at a time.`,
    });
  }
  return examples.slice(0, 3);
}

function buildArchitectureFlow(trackId, node) {
  const base = [
    `Define the objective for ${node.title}`,
    "Prepare and validate inputs/state",
    "Execute core algorithmic step",
    "Evaluate outputs and detect failure modes",
    "Apply feedback loop and iterate",
  ];

  if (trackId === "rag") {
    return {
      title: "RAG Architecture Flow",
      steps: [
        "Ingest and normalize source documents",
        "Chunk and embed for retriever indexing",
        "Retrieve top-k evidence for user query",
        "Rerank/filter context for precision",
        "Generate grounded answer with citations",
      ],
      draggable: true,
    };
  }
  if (trackId === "langgraph") {
    return {
      title: "LangGraph Agent Flow",
      steps: [
        "Receive request and initialize graph state",
        "Route through planner/reasoning node",
        "Invoke tools and capture observations",
        "Update state and decide next edge",
        "Finalize response with traceable state path",
      ],
      draggable: true,
    };
  }
  if (trackId === "docker") {
    return {
      title: "Container Lifecycle Flow",
      steps: [
        "Author Dockerfile with runtime contract",
        "Build image layers and cache dependencies",
        "Run container with network/volume bindings",
        "Inspect logs and health signals",
        "Promote versioned artifact across environments",
      ],
      draggable: true,
    };
  }
  return {
    title: `${node.title} - Architecture Flow`,
    steps: base,
    draggable: true,
  };
}

function buildInteractiveSessions(node, architectureFlow) {
  return [
    {
      title: "Concept Drill",
      objective: `Manipulate key parameters and observe behavior shifts for ${node.title}.`,
    },
    {
      title: "Failure Mode Lab",
      objective: "Trigger an edge case and explain remediation decisions.",
    },
    {
      title: "Architecture Reorder Exercise",
      objective: `Reorder ${architectureFlow.steps.length} flow steps into the correct production sequence.`,
    },
  ];
}

function buildTranscriptInsights(trackId, node) {
  const transcript = findTranscriptForNode(trackId, node);
  if (!transcript) {
    const fallbackSource = sanitizePlainText(
      `${stripHtmlTags(node.theory ?? "")} ${node.excerpt ?? ""} ${node.example ?? ""}`
    );
    const fallbackCandidates = splitSentences(fallbackSource);
    const fallbackCoverage = (fallbackCandidates.length > 0
      ? fallbackCandidates
      : chunkTextFallback(fallbackSource)
    ).slice(0, 40);
    const topicTerms = inferTopicTerms(node);
    const fallbackHighlights = fallbackCoverage
      .map((sentence, index) => ({
        sentence,
        index,
        score: scoreSentence(sentence, topicTerms),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 8)
      .map((row) => row.sentence);

    return {
      sourcePath: null,
      highlights: fallbackHighlights,
      coveragePoints: fallbackCoverage,
      cleanedTranscript: "",
      deepTheoryHtml: buildInterviewReadyTheory(node, fallbackHighlights.length > 0 ? fallbackHighlights : [
        "Source notes not found for this topic. Base theory retained and enriched with generic interview tradeoffs.",
      ]),
    };
  }

  const raw = fs.readFileSync(transcript.path, "utf8");
  const cleaned = cleanTranscript(raw);
  const sentenceCandidates = splitSentences(cleaned);
  const coveragePoints = (sentenceCandidates.length > 0
    ? sentenceCandidates
    : chunkTextFallback(cleaned)
  ).slice(0, 80);
  const topicTerms = inferTopicTerms(node);
  const highlights = coveragePoints
    .map((sentence, index) => ({
      sentence,
      index,
      score: scoreSentence(sentence, topicTerms),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 8)
    .map((row) => sanitizePlainText(row.sentence));

  return {
    sourcePath: path.relative(ROOT, transcript.path),
    highlights,
    coveragePoints: coveragePoints.map((line) => sanitizePlainText(line)),
    cleanedTranscript: cleaned,
    deepTheoryHtml: buildInterviewReadyTheory(node, highlights),
  };
}

function buildSubtopicPayload(trackId, node, batchIndex, slot, topicAgentId = 1) {
  const transcript = buildTranscriptInsights(trackId, node);
  const code = buildCodeGrounding(trackId, node, transcript.cleanedTranscript);
  const pdf = getPdfInsights(trackId, node);
  const interactive = buildInteractiveProposal(node);
  const architectureFlow = buildArchitectureFlow(trackId, node);
  const interactiveSessions = buildInteractiveSessions(node, architectureFlow);
  const beginnerExamples = buildBeginnerExamples(node, transcript.highlights);
  const interview = buildTieredInterview(node, transcript.highlights);
  const flashcards = buildActiveRecallCards(node, transcript.highlights);

  return {
    slug: node.slug,
    title: sanitizePlainText(node.title),
    sectionId: node.sectionId,
    conceptId: node.conceptId ?? null,
    order: node.order,
    execution: {
      macroMode: "sequential-main-topics",
      microMode: "parallel-batches",
      batchIndex,
      topicAgentId,
      topicAgentLabel: `topic-agent-${topicAgentId}`,
      subAgentSlot: slot,
    },
      curriculumNode: {
      slug: node.slug,
      sectionId: node.sectionId,
      conceptId: node.conceptId ?? null,
      title: sanitizePlainText(node.title),
      order: node.order,
      excerpt: sanitizePlainText(node.excerpt ?? ""),
      theory: sanitizeHtmlText(transcript.deepTheoryHtml),
      example: sanitizePlainText(node.example ?? ""),
      animation: node.animation ?? null,
      tool: node.tool ?? null,
      interviewPrep: {
        questions: (Array.isArray(node.interviewPrep?.questions) ? node.interviewPrep.questions : []).map((q) =>
          sanitizePlainText(q)
        ),
        answers: (Array.isArray(node.interviewPrep?.answers) ? node.interviewPrep.answers : []).map((a) =>
          sanitizePlainText(a)
        ),
        seniorTip: sanitizePlainText(node.interviewPrep?.seniorTip ?? ""),
      },
      flashCards: flashcards,
        codeGuide: code.codeGuide ?? inferFallbackCodeGuide(trackId, node),
      },
    resourceGrounding: {
      transcript: {
        sourcePath: transcript.sourcePath,
        highlights: transcript.highlights,
        coveragePoints: transcript.coveragePoints,
        durationHintIgnored: true,
      },
      code: {
        files: code.files,
        walkthroughMarkdown: code.walkthroughMarkdown,
      },
      pdf: pdf,
    },
    interactiveLayer: interactive,
    interactiveSessions,
    architectureFlow,
    beginnerExamples,
    assessments: {
      activeRecall: flashcards,
      interviewQA: interview,
    },
  };
}

async function buildTrackPayload(trackId, sequenceOrder, batchSize) {
  const track = getTrack(trackId);
  if (!track) {
    throw new Error(`Track not found: ${trackId}`);
  }

  const nodes = getNodesByTrack(trackId);
  const batches = chunkArray(nodes, batchSize);
  const payloadBatches = new Array(batches.length);

  for (let groupStart = 0; groupStart < batches.length; groupStart += DEFAULT_TOPIC_BATCH_PARALLELISM) {
    const group = batches.slice(groupStart, groupStart + DEFAULT_TOPIC_BATCH_PARALLELISM);
    const groupResults = await Promise.all(
      group.map(async (batch, offset) => {
        const batchIndex = groupStart + offset + 1;
        const topicAgentId = ((batchIndex - 1) % DEFAULT_TOPIC_BATCH_PARALLELISM) + 1;
        const batchSubtopics = await Promise.all(
          batch.map(async (node, index) =>
            buildSubtopicPayload(trackId, node, batchIndex, index + 1, topicAgentId)
          )
        );
        return {
          batchIndex,
          size: batchSubtopics.length,
          topicAgentId,
          topicAgentLabel: `topic-agent-${topicAgentId}`,
          subtopics: batchSubtopics,
        };
      })
    );

    for (const result of groupResults) {
      payloadBatches[result.batchIndex - 1] = result;
    }
  }

  return {
    topicId: track.id,
    topicTitle: track.title,
    sectionId: track.sectionId,
    sequenceOrder,
    strategy: {
      macro: "sequential",
      micro: "parallel-grouped-batches",
      batchSize,
      topicBatchParallelism: DEFAULT_TOPIC_BATCH_PARALLELISM,
    },
    totals: {
      subtopics: nodes.length,
      batches: payloadBatches.length,
    },
    batches: payloadBatches,
  };
}

async function main() {
  const startedAt = new Date().toISOString();
  const topics = [];

  for (let i = 0; i < MAIN_TOPIC_SEQUENCE.length; i += 1) {
    const topicId = MAIN_TOPIC_SEQUENCE[i];
    const trackPayload = await buildTrackPayload(topicId, i + 1, DEFAULT_BATCH_SIZE);
    topics.push(trackPayload);
    console.log(
      `[topic ${i + 1}/${MAIN_TOPIC_SEQUENCE.length}] ${trackPayload.topicTitle}: ${trackPayload.totals.subtopics} subtopics, ${trackPayload.totals.batches} batches`
    );
  }

  const output = {
    metadata: {
      name: "Universal Learning Engine Payload",
      generatedAt: new Date().toISOString(),
      startedAt,
      generator: "scripts/build-universal-learning-engine.mjs",
      conceptLabCompatibility: "curriculumNode shape mirrors Concept Lab node schema",
      batchSize: DEFAULT_BATCH_SIZE,
    },
    executionStrategy: {
      macroSequence: MAIN_TOPIC_SEQUENCE,
      microParallelism: true,
      topicSequential: true,
      batchGroupingWithinTopic: true,
      topicBatchParallelism: DEFAULT_TOPIC_BATCH_PARALLELISM,
      subAgentModel: "topic-level agent pool with grouped parallel batch execution",
    },
    topics,
  };

  ensureDir(path.dirname(OUTPUT_PATH));
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote Universal Learning Engine payload to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(error?.stack ?? String(error));
  process.exit(1);
});
