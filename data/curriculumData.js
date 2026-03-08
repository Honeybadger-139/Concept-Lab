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
    theory: "<p>Welcome to the complete RAG course! Large Language Models (LLMs) are incredibly powerful, but their knowledge is frozen at training time and they are prone to hallucinations.</p><p>Retrieval-Augmented Generation (RAG) solves this by providing the model with relevant, up-to-date context extracted from an external database right before generating an answer. In this module, we'll build a complete RAG system from scratch.</p>",
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
    theory: "<p>The injection pipeline is responsible for getting your raw data ready for search.</p><ol><li><b>Load</b>: Ingest documents from PDFs, Notion, or web pages.</li><li><b>Split</b>: Chunk the documents into smaller text pieces that fit within context windows.</li><li><b>Embed</b>: Run each chunk through an embedding model (like text-embedding-ada-002).</li><li><b>Store</b>: Save the embeddings alongside the original text and metadata in a Vector Database like Pinecone or Chroma.</li></ol>",
    example: "Suppose you have a 100-page employee handbook. The injection pipeline will break it down into roughly 500 semantic chunks, generate 500 vectors, and store them so when a user asks 'What is the refund policy?', the system can find that exact paragraph.",
    animation: null,
    tool: null,
  },
  {
    slug: "04-coding-retrieval-pipeline",
    sectionId: "rag",
    title: "Coding the retrieval pipeline",
    order: 4,
    excerpt: "Query → embed → similarity search → top-k chunks → LLM.",
    theory: "<p>The retrieval pipeline executes at runtime when a user asks a question.</p><ol><li>The user submits a text question.</li><li>The system immediately embeds this question using the <b>same</b> model used in the injection pipeline.</li><li>A similarity search (like Cosine Similarity) compares the query vector against all document vectors in the vector DB.</li><li>The top <i>K</i> most similar chunks are retrieved and appended to the prompt.</li></ol>",
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
    theory: "<p>Once the most relevant chunks are retrieved from the Vector DB, they are combined with the user's original question into a single prompt for the Large Language Model.</p><p>The prompt usually follows a structure like: <em>'You are a helpful assistant. Answer the user's question using ONLY the following context. If you don't know the answer, say so.'</em> This heavily restricts the LLM from hallucinating answers outside of your provided data.</p>",
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
    theory: "<p>Standard RAG answers single, isolated questions brilliantly. But in a chatbot setting, users ask follow-up questions with pronouns like <em>'Can you explain <b>that</b> in more detail?'</em></p><p>History-aware RAG introduces a new step: <b>Query Reformation</b>. Before searching the Vector DB, an LLM looks at the chat history and the new question, and rewrites the question into a standalone query. Then, the standard RAG retrieval pipeline takes over.</p>",
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
    theory: "<p>Chunking is the process of breaking down large documents into smaller, meaningful pieces. The strategy you choose significantly impacts retrieval quality: if chunks are too small, they lose context; if they are too large, they introduce noise and waste context window tokens.</p><p>Modern strategies range from simple fixed-character splitting to advanced semantic chunking that determines cut-off points based on changes in embedding similarity.</p>",
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
    theory: "<p>The simplest chunking method is a <b>Character Splitter</b>, which simply cuts text every <i>N</i> characters (e.g., 500 characters). The flaw is that it might cut a word or sentence perfectly in half.</p><p>A <b>Recursive Character Splitter</b> is smarter. It tries to split using a hierarchy of separators: first by double newlines (paragraphs), then single newlines (lines), then spaces (words), and finally characters. It recursively moves down this list until the chunks fit within the desired size, keeping related text together as much as possible.</p>",
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
    theory: "<p>Unlike recursive splitting which looks at syntax (newlines/spaces), <b>Semantic Chunking</b> looks at meaning. It evaluates the embedding vectors of sequential sentences.</p><p>If the distance between Sentence A and Sentence B's embeddings is small, they are likely discussing the same topic and should be grouped in the same chunk. If there's a large jump in semantic distance, the algorithm 'cuts' the chunk, indicating a shift in topic.</p>",
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
    theory: "<p><b>Agentic Chunking</b> treats document parsing as a task for an intelligent LLM agent rather than a deterministic code script.</p><p>The agent dynamically reads through the document and makes decisions on where to split based on logical completeness. It can also generate dynamic metallic metadata representing 'What questions can this specific chunk answer?', dramatically improving later retrieval accuracy.</p>",
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
    theory: "<p>Real-world documents aren't just text; they contain charts, graphs, and images. <b>Multi-Modal RAG</b> handles this by using unified embedding models (like CLIP) that can embed both images and text into the exact same vector space.</p><p>When a user asks 'What does the Q3 revenue chart look like?', the text query is embedded and compared against the image embeddings in the Vector DB. The retrieved image is then passed to a vision-capable LLM (like GPT-4o) to generate a response.</p>",
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
    theory: "<p>Vector similarity is great for semantic meaning, but terrible for exact keyword matching (e.g., finding a specific ID number). <b>Hybrid Search</b> solves this by running both a Vector Search and a traditional Keyword Search (like BM25) simultaneously, and combining the results using Reciprocal Rank Fusion.</p><p>Then, a <b>Reranker</b> model (like Cohere) is often used to score and re-order the retrieved chunks to ensure the absolute most relevant context is at the top of the prompt.</p>",
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
    theory: "<p>Users often write poorly phrased questions. <b>Multi-Query RAG</b> intercepts the user's question and asks an LLM to generate 3-5 variations of it from different perspectives.</p><p>The system runs a Vector DB search for <i>each</i> of these variations independently. It collects all the retrieved chunks, removes duplicates, and passes the massive combined list to a Reranker to find the best possible collection of context. This drastically improves the hit rate for hard-to-find answers.</p>",
    example: null,
    animation: null,
    tool: null,
  },
  {
    slug: "01-ml-basics-supervised",
    sectionId: "ml",
    title: "Introduction to Supervised Learning",
    order: 1,
    excerpt: "Labels, features, and predicting outcomes from existing data.",
    theory: "<p><b>Supervised Learning</b> is the process of training a machine learning model on labeled data. Labeled data means the dataset contains both the input variables (Features or X) and the desired output variable (Label, Target, or Y).</p><p>By showing the algorithm thousands of examples of what a 'cat' looks like, or what features define a '$500,000 house', the model learns a mapping function from input to output so it can predict outputs for new, unseen data.</p>",
    example: "Example: Predicting whether an email is spam (Y=1) or not spam (Y=0) based on the frequency of specific words (X).",
    animation: null,
    tool: null,
  },
  {
    slug: "02-linear-regression",
    sectionId: "ml",
    title: "Linear Regression & Gradient Descent",
    order: 2,
    excerpt: "Fitting a line to data using cost functions and gradients.",
    theory: "<p><b>Linear Regression</b> predicts a continuous numerical output by fitting a straight line through the data points that minimizes the squared errors.</p><p><b>Gradient Descent</b> is the optimization algorithm used to find that best-fit line. It works by calculating the 'cost' (how wrong the line is) and taking small steps down the steepest slope of the error curve until it reaches the minimum point.</p>",
    example: "Example: Predicting a student's final exam score (0-100) based on the number of hours they studied.",
    animation: null,
    tool: null,
  },
  {
    slug: "03-logistic-regression-classification",
    sectionId: "ml",
    title: "Logistic Regression & Classification",
    order: 3,
    excerpt: "Using the sigmoid function to predict probabilities and categories.",
    theory: "<p>Despite the word 'regression' in its name, <b>Logistic Regression</b> is used for <i>Classification</i> problems—predicting a discrete category rather than a continuous number.</p><p>It works by taking the output of a linear equation and passing it through a <b>Sigmoid Function</b>, which squashes the values between 0 and 1. This output can be interpreted as a probability (e.g., 'There is an 82% chance this tumor is malignant'). If the probability is > 0.5, we classify it as Class 1.</p>",
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
