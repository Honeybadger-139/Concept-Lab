export const MAX_CONTEXT_SNIPPETS = 3;
export const MIN_MATCH_SCORE = 0.12;
export const STRICT_TOPIC_SCORE = 0.2;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "by", "can", "do", "does",
  "for", "from", "how", "i", "if", "in", "into", "is", "it", "its", "me", "my", "of", "on",
  "or", "our", "please", "should", "that", "the", "their", "them", "there", "this", "to",
  "was", "we", "what", "when", "where", "which", "who", "why", "with", "you", "your",
]);

export function htmlToText(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function compactSnippet(text, maxLen = 280) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}...`;
}

export function buildKnowledge(topic) {
  const sources = [];
  if (topic?.excerpt) {
    sources.push({ source: "Excerpt", text: topic.excerpt });
  }
  if (topic?.theoryHtml) {
    sources.push({ source: "Theory", text: htmlToText(topic.theoryHtml) });
  }
  if (topic?.example) {
    sources.push({ source: "Example", text: topic.example });
  }

  const questions = Array.isArray(topic?.interviewPrep?.questions) ? topic.interviewPrep.questions : [];
  const answers = Array.isArray(topic?.interviewPrep?.answers) ? topic.interviewPrep.answers : [];
  questions.forEach((question, index) => {
    const answer = answers[index] || topic?.interviewPrep?.seniorTip || "";
    const pairText = answer ? `Question: ${question}. Answer: ${answer}` : `Question: ${question}`;
    sources.push({ source: "Interview Prep", text: pairText });
  });

  const flashCards = Array.isArray(topic?.flashCards) ? topic.flashCards : [];
  flashCards.forEach((card) => {
    if (!card?.q && !card?.a) return;
    sources.push({
      source: "Flash Card",
      text: `Question: ${card.q || ""}. Answer: ${card.a || ""}`,
    });
  });

  const snippets = [];
  sources.forEach((entry) => {
    const sentences = splitSentences(entry.text);
    if (sentences.length === 0) return;

    for (let i = 0; i < sentences.length; i += 2) {
      const text = compactSnippet(sentences.slice(i, i + 2).join(" "));
      const tokenSet = new Set(tokenize(text));
      if (tokenSet.size === 0) continue;
      snippets.push({ source: entry.source, text, tokenSet });
    }
  });

  return snippets;
}

export function buildTopicVocabulary(topic, knowledge) {
  const frequency = new Map();
  const seed = tokenize(`${topic?.sectionTitle || ""} ${topic?.title || ""} ${topic?.excerpt || ""}`);
  seed.forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 5));

  knowledge.forEach((snippet) => {
    snippet.tokenSet.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });
  });

  const topWords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([word]) => word);

  return new Set(topWords);
}

function scoreSnippet(questionTokens, snippetTokenSet) {
  if (!questionTokens.length) return 0;
  let overlap = 0;
  questionTokens.forEach((token) => {
    if (snippetTokenSet.has(token)) overlap += 1;
  });
  return overlap / questionTokens.length;
}

export function createOutOfScopeReply(topicTitle) {
  return `Sorry, that is not a valid question. I cannot answer regarding topics outside this one.

Please ask something related to "${topicTitle}".`;
}

export function retrieveEvidence(question, knowledge, minScore = MIN_MATCH_SCORE, maxSnippets = MAX_CONTEXT_SNIPPETS) {
  const questionTokens = tokenize(question);
  const scored = knowledge
    .map((snippet) => ({
      ...snippet,
      score: scoreSnippet(questionTokens, snippet.tokenSet),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0] || null;
  const evidence = scored.filter((item) => item.score >= minScore).slice(0, maxSnippets);
  return { questionTokens, scored, best, evidence };
}

export function classifyScope(question, topicVocabulary, bestEvidence, minStrictScore = STRICT_TOPIC_SCORE) {
  const questionTokens = tokenize(question);
  const topicHits = questionTokens.reduce((count, token) => count + (topicVocabulary.has(token) ? 1 : 0), 0);
  const looksOffTopic = topicHits === 0 && (!bestEvidence || bestEvidence.score < minStrictScore);
  return { topicHits, looksOffTopic, questionTokens };
}

export function deterministicTopicAnswer(question, topic, knowledge, topicVocabulary) {
  const { questionTokens, best, evidence } = retrieveEvidence(question, knowledge);
  if (questionTokens.length === 0) {
    return `Please ask a concrete question about "${topic.title}".`;
  }

  const { looksOffTopic } = classifyScope(question, topicVocabulary, best);
  if (!best || best.score < MIN_MATCH_SCORE || looksOffTopic) {
    return createOutOfScopeReply(topic.title);
  }

  const responseLines = evidence.map((item, index) => `${index + 1}. ${item.text} [${item.source}]`);
  return `Based on this topic:

${responseLines.join("\n")}

Ask a narrower follow-up if you want a deeper explanation on one part.`;
}
