import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ML_TRANSCRIPT_DIR_CANDIDATES = [
  path.join(ROOT, "content", "transcripts", "machine_learning", "supervised_learning_algorithms"),
  path.join(ROOT, "scratch_pad", "transcripts", "machine_learning", "supervised_learning_algorithms"),
];

const TRANSCRIPT_KEYWORDS = [
  "model",
  "parameter",
  "prediction",
  "training",
  "error",
  "cost",
  "gradient",
  "descent",
  "feature",
  "classification",
  "regression",
  "decision boundary",
  "sigmoid",
  "bias",
  "variance",
  "overfitting",
  "underfitting",
  "regularization",
  "generalize",
];

const NOISE_PATTERNS = [
  /^\s*#\s*prompt/i,
  /^\s*structured\.\s*explained\.\s*applied\./i,
  /^\s*upload your first lecture transcript\./i,
  /what would you like to do next/i,
  /you are no longer a beginner/i,
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanTranscript(raw) {
  return String(raw)
    .replace(/\[MUSIC\]/gi, " ")
    .replace(/\r/g, " ")
    .split("\n")
    .filter((line) => !NOISE_PATTERNS.some((pattern) => pattern.test(line)))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  const chunks = text.split(/(?<=[.!?])\s+/);
  return chunks
    .map((item) => item.trim())
    .filter((item) => item.length >= 45 && item.length <= 260);
}

function scoreSentence(sentence) {
  const lower = sentence.toLowerCase();
  let score = 0;
  for (const keyword of TRANSCRIPT_KEYWORDS) {
    if (lower.includes(keyword)) score += 2;
  }
  if (lower.includes("because") || lower.includes("means") || lower.includes("called")) score += 2;
  if (/\d/.test(lower)) score += 1;
  if (sentence.length >= 80 && sentence.length <= 180) score += 1;
  return score;
}

function buildDeepeningHtml(rawTranscript) {
  const cleaned = cleanTranscript(rawTranscript);
  const sentences = splitSentences(cleaned);
  if (sentences.length === 0) return "";

  const scored = sentences
    .map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index);

  if (scored.length === 0) return "";

  const items = scored
    .map((entry) => `<li>${escapeHtml(entry.sentence)}</li>`)
    .join("");

  return `<h3>Transcript Deepening</h3><p><b>Lecture-backed reinforcement:</b> these points are extracted from the session transcript to strengthen your theory intuition.</p><ul>${items}</ul>`;
}

let cachedByOrder = null;

export function getMlTranscriptDeepeningByOrder() {
  if (cachedByOrder) return cachedByOrder;

  const transcriptDir = ML_TRANSCRIPT_DIR_CANDIDATES.find((dir) => fs.existsSync(dir));
  const byOrder = new Map();

  if (!transcriptDir) {
    cachedByOrder = byOrder;
    return cachedByOrder;
  }

  const files = fs.readdirSync(transcriptDir).filter((fileName) => fileName.endsWith(".txt"));
  for (const fileName of files) {
    const match = fileName.match(/^(\d+)_/);
    if (!match) continue;
    const order = Number(match[1]);
    const fullPath = path.join(transcriptDir, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const html = buildDeepeningHtml(raw);
    if (html) byOrder.set(order, html);
  }

  cachedByOrder = byOrder;
  return cachedByOrder;
}
