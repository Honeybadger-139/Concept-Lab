import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LANGGRAPH_TRANSCRIPT_DIR_CANDIDATES = [
  path.join(ROOT, "content", "transcripts", "langgraph"),
  path.join(ROOT, "scratch_pad", "transcripts", "langgraph"),
];

const TRANSCRIPT_KEYWORDS = [
  "graph",
  "state",
  "agent",
  "tool",
  "router",
  "interrupt",
  "resume",
  "checkpointer",
  "stream",
  "messages",
  "retriever",
  "validator",
  "supervisor",
  "subgraph",
  "rag",
  "structured output",
  "command",
  "node",
];

const NOISE_PATTERNS = [
  /\bhello guys\b/gi,
  /\ball right guys\b/gi,
  /\bwelcome to (?:a|the|this) [^.?!]{0,90}/gi,
  /\bi'll see you in the next[^.?!]*/gi,
  /\bif you have any questions[^.?!]*/gi,
  /\bpull the code[^.?!]*/gi,
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
    .replace(/\n/g, " ")
    .replace(/Uh /g, " ")
    .replace(/uh /g, " ")
    .replace(/Okay\./g, " ")
    .replace(/Right\?/g, " ")
    .replace(/All right\./g, " ")
    .replace(/Perfect\./g, " ")
    .replace(/So let me /g, " ")
    .replace(/So right here /g, " ")
    .replace(/So now /g, " ")
    .replace(/So this is /g, " This is ")
    .replace(/So we are /g, " We are ")
    .replace(/So if /g, " If ")
    .replace(/So what /g, " What ")
    .replace(/So the /g, " The ")
    .replace(/So /g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(NOISE_PATTERNS[0], " ")
    .replace(NOISE_PATTERNS[1], " ")
    .replace(NOISE_PATTERNS[2], " ")
    .replace(NOISE_PATTERNS[3], " ")
    .replace(NOISE_PATTERNS[4], " ")
    .replace(NOISE_PATTERNS[5], " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 55 && item.length <= 260);
}

function buildFallbackChunks(text) {
  const chunks = [];
  const chunkSize = 180;
  const step = 140;

  for (let start = 0; start < text.length; start += step) {
    const slice = text.slice(start, start + chunkSize).trim();
    if (slice.length < 60) continue;
    chunks.push(slice);
  }

  return chunks
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 60 && item.length <= 220);
}

function scoreSentence(sentence) {
  const lower = sentence.toLowerCase();
  let score = 0;

  for (const keyword of TRANSCRIPT_KEYWORDS) {
    if (lower.includes(keyword)) score += 2;
  }

  if (lower.includes("because") || lower.includes("so that") || lower.includes("if")) score += 1;
  if (lower.includes("flow") || lower.includes("route") || lower.includes("pattern")) score += 2;
  if (/\d/.test(lower)) score += 1;
  if (sentence.length >= 85 && sentence.length <= 170) score += 1;

  return score;
}

function buildDeepeningHtml(rawTranscript) {
  const cleaned = cleanTranscript(rawTranscript);
  let sentences = splitSentences(cleaned);
  if (sentences.length < 3) {
    sentences = buildFallbackChunks(cleaned);
  }
  if (sentences.length === 0) return "";

  const scored = sentences
    .map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index);

  if (scored.length === 0) return "";

  const items = scored.map((entry) => `<li>${escapeHtml(entry.sentence)}</li>`).join("");
  return `<h3>Transcript Deepening</h3><p><b>Lecture-backed reinforcement:</b> these points are extracted from the LangGraph transcript to sharpen architecture and flow intuition.</p><ul>${items}</ul>`;
}

let cachedByOrder = null;

export function getLangGraphTranscriptDeepeningByOrder() {
  if (cachedByOrder) return cachedByOrder;

  const transcriptDir = LANGGRAPH_TRANSCRIPT_DIR_CANDIDATES.find((dir) => fs.existsSync(dir));
  const byOrder = new Map();

  if (!transcriptDir) {
    cachedByOrder = byOrder;
    return byOrder;
  }

  const files = fs.readdirSync(transcriptDir).filter((fileName) => fileName.endsWith(".txt"));
  for (const fileName of files) {
    const match = fileName.match(/^(\d+(?:\.\d+)?)_/);
    if (!match) continue;
    const order = Number(match[1]);
    const fullPath = path.join(transcriptDir, fileName);
    const html = buildDeepeningHtml(fs.readFileSync(fullPath, "utf8"));
    if (html) byOrder.set(order, html);
  }

  cachedByOrder = byOrder;
  return byOrder;
}
