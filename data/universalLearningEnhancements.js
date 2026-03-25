import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAYLOAD_CANDIDATES = [
  path.join(ROOT, "data", "generated", "universalLearningEnginePayload.json"),
];

let cachedMap = null;

function loadPayloadPath() {
  return PAYLOAD_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function flattenTieredInterview(interviewQA = {}) {
  const tiers = ["beginner", "intermediate", "expert"];
  const questions = [];
  const answers = [];
  for (const tier of tiers) {
    const pairs = Array.isArray(interviewQA[tier]) ? interviewQA[tier] : [];
    for (const pair of pairs) {
      const question = String(pair?.question ?? "").trim();
      const answer = String(pair?.answer ?? "").trim();
      if (!question) continue;
      questions.push(`[${tier}] ${question}`);
      answers.push(answer);
    }
  }
  return { questions, answers };
}

function buildMap() {
  const payloadPath = loadPayloadPath();
  if (!payloadPath) return new Map();

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  } catch {
    return new Map();
  }

  const map = new Map();
  const topics = Array.isArray(parsed?.topics) ? parsed.topics : [];
  for (const topic of topics) {
    const batches = Array.isArray(topic?.batches) ? topic.batches : [];
    for (const batch of batches) {
      const subtopics = Array.isArray(batch?.subtopics) ? batch.subtopics : [];
      for (const subtopic of subtopics) {
        const sectionId = String(subtopic?.sectionId ?? "").trim();
        const slug = String(subtopic?.slug ?? "").trim();
        if (!sectionId || !slug) continue;

        const curriculumNode = subtopic?.curriculumNode ?? {};
        const assessments = subtopic?.assessments ?? {};
        const interviewQA = assessments?.interviewQA ?? {};
        const flattenedInterview = flattenTieredInterview(interviewQA);

        map.set(`${sectionId}/${slug}`, {
          theory: String(curriculumNode?.theory ?? "").trim(),
          example: String(curriculumNode?.example ?? "").trim(),
          flashCards: Array.isArray(assessments?.activeRecall) ? assessments.activeRecall : [],
          interviewPrep: {
            questions: flattenedInterview.questions,
            answers: flattenedInterview.answers,
            seniorTip:
              "Use the tier progression: beginner correctness -> intermediate tradeoffs -> expert production constraints and incident readiness.",
          },
          interviewTiers: interviewQA,
          transcriptCoverage: Array.isArray(subtopic?.resourceGrounding?.transcript?.coveragePoints)
            ? subtopic.resourceGrounding.transcript.coveragePoints
            : [],
          transcriptHighlights: Array.isArray(subtopic?.resourceGrounding?.transcript?.highlights)
            ? subtopic.resourceGrounding.transcript.highlights
            : [],
          interactiveLayer: Array.isArray(subtopic?.interactiveLayer) ? subtopic.interactiveLayer : [],
          interactiveSessions: Array.isArray(subtopic?.interactiveSessions)
            ? subtopic.interactiveSessions
            : [],
          architectureFlow: subtopic?.architectureFlow ?? null,
          beginnerExamples: Array.isArray(subtopic?.beginnerExamples) ? subtopic.beginnerExamples : [],
          codeGuide: curriculumNode?.codeGuide ?? null,
          codeWalkthroughMarkdown: String(subtopic?.resourceGrounding?.code?.walkthroughMarkdown ?? ""),
          codeFiles: Array.isArray(subtopic?.resourceGrounding?.code?.files)
            ? subtopic.resourceGrounding.code.files
            : [],
        });
      }
    }
  }
  return map;
}

function getEnhancementMap() {
  if (!cachedMap) cachedMap = buildMap();
  return cachedMap;
}

export function getUniversalEnhancement(sectionId, slug) {
  return getEnhancementMap().get(`${sectionId}/${slug}`) ?? null;
}

