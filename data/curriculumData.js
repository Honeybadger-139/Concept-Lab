/**
 * Concept Lab curriculum: sections and nodes (one node ≈ one transcript).
 * RAG 01–14 from blueprint; ML and Advanced are placeholders for future content.
 */

export const sections = [
  {
    id: "rag",
    title: "RAG Systems",
    description:
      "Retrieval Augmented Generation: from fundamentals (tokens, embeddings, vector DBs) to chunking, multi-query, and hybrid search.",
    order: 1,
  },
  {
    id: "ml",
    title: "Machine Learning",
    description:
      "Supervised learning, linear and logistic regression, gradient descent, and core ML concepts.",
    order: 0,
  },
  {
    id: "advanced",
    title: "Advanced Learning",
    description:
      "Advanced algorithms and deeper dives. Content added as you learn.",
    order: 2,
  },
  {
    id: "langgraph",
    title: "LangGraph",
    description:
      "Building stateful, multi-actor applications with LLMs using LangGraph.",
    order: 3,
  },
];

export const nodes = [
  {
    slug: "01-intro-rag-course",
    sectionId: "rag",
    title: "Introduction to the complete RAG course",
    order: 1,
    excerpt:
      "Course goals, why RAG matters for AI engineering, and what you'll build.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "02-what-is-rag",
    sectionId: "rag",
    title: "What is RAG, tokens, embeddings & vector databases",
    order: 2,
    excerpt:
      "Context windows, chunking, embedding models, and the injection vs retrieval pipeline.",
    theory: "<p>RAG (Retrieval-Augmented Generation) connects Large Language Models to external data sources. It involves two main pipelines: <strong>Injection</strong> (chunking documents and generating embeddings) and <strong>Retrieval</strong> (searching for relevant chunks to augment the LLM prompt).</p><p>Context windows are limited, so we split documents into smaller chunks. Embeddings convert these text chunks into numerical vectors (points in space) capturing semantic meaning.</p>",
    example: "Example: Assuming a 8k token context window, if each chunk is ~500 tokens, you can fit about 10-12 chunks in a prompt alongside instructions, leaving room for the generated response.",
    animation: "VectorSearchVisualizer",
    tool: "TokenCounter",
  },
  {
    slug: "03-coding-injection-pipeline",
    sectionId: "rag",
    title: "Coding the injection pipeline",
    order: 3,
    excerpt: "Chunk → embed → store in a vector DB. Implement from scratch.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "04-coding-retrieval-pipeline",
    sectionId: "rag",
    title: "Coding the retrieval pipeline",
    order: 4,
    excerpt: "Query → embed → similarity search → top-k chunks → LLM.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "05-cosine-similarity",
    sectionId: "rag",
    title: "Cosine similarity explained",
    order: 5,
    excerpt: "How vector similarity is measured; angle between embeddings.",
    theory: "<p>Cosine similarity is a metric used to measure how similar two vectors are, irrespective of their size. It measures the cosine of the angle between two vectors projected in a multi-dimensional space.</p><ul><li><strong>1</strong> means vectors point in the exact same direction (highly similar)</li><li><strong>0</strong> means they are orthogonal (unrelated)</li><li><strong>-1</strong> means they point in opposite directions (dissimilar)</li></ul>",
    example: null,
    animation: "CosineSimilarityDemo",
    tool: null,
  },
  {
    slug: "06-answer-generation-llm",
    sectionId: "rag",
    title: "Answer generation with LLM",
    order: 6,
    excerpt: "From retrieved chunks and user question to final answer.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "07-history-aware-conversational-rag",
    sectionId: "rag",
    title: "History-aware conversational RAG",
    order: 7,
    excerpt: "Multi-turn context and state in RAG chatbots.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "08-chunking-strategies-overview",
    sectionId: "rag",
    title: "Chunking strategies overview",
    order: 8,
    excerpt: "Why chunking matters; fixed-size vs semantic vs agentic.",
    theory: null,
    example: null,
    animation: null,
    tool: "ChunkingDemo",
  },
  {
    slug: "09-character-recursive-splitter",
    sectionId: "rag",
    title: "Character text splitter and recursive splitter",
    order: 9,
    excerpt: "Splitting by character count and by hierarchy of separators.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "10-semantic-chunking",
    sectionId: "rag",
    title: "Semantic chunking",
    order: 10,
    excerpt: "Meaning-preserving chunks using embedding similarity.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "11-agentic-chunking",
    sectionId: "rag",
    title: "Agentic chunking",
    order: 11,
    excerpt: "Adaptive chunking driven by agents or query context.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "12-multimodal-rag",
    sectionId: "rag",
    title: "Multi-Modal RAG with images and documents",
    order: 12,
    excerpt: "Combining text and image retrieval and embeddings.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "13-advanced-document-retrieval",
    sectionId: "rag",
    title: "Advanced document retrieval techniques",
    order: 13,
    excerpt: "Hybrid search, rerankers, and beyond vector similarity.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "14-multi-query-rag",
    sectionId: "rag",
    title: "Multi-Query RAG for better search results",
    order: 14,
    excerpt: "One query → multiple sub-queries; fuse and rerank results.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "ml-placeholder",
    sectionId: "ml",
    title: "Machine Learning (coming soon)",
    order: 0,
    excerpt: "Supervised learning, regression, classification. Content in progress.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "advanced-placeholder",
    sectionId: "advanced",
    title: "Advanced Learning (coming soon)",
    order: 0,
    excerpt: "Advanced topics. Content added as you learn.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "15-rag-langgraph",
    sectionId: "langgraph",
    title: "RAG with LangGraph",
    order: 15,
    excerpt: "Building agentic RAG workflows using LangGraph.",
    theory: "<p>LangGraph is an extension of LangChain aimed at building robust and stateful multi-actor applications with LLMs by modeling them as graphs.</p>",
    example: null,
    animation: null,
    tool: null,
  },
];

export function getSections() {
  return [...sections].sort((a, b) => a.order - b.order);
}

export function getNodesBySection(sectionId) {
  return nodes
    .filter((n) => n.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

export function getSection(sectionId) {
  return sections.find((s) => s.id === sectionId) ?? null;
}

export function getNode(sectionId, slug) {
  return nodes.find((n) => n.sectionId === sectionId && n.slug === slug) ?? null;
}
