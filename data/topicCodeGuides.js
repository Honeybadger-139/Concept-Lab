const guide = (summary, files, checkpoints = []) => ({ summary, files, checkpoints });
const fileRef = (sourcePath, focus, highlightTerms = []) => ({
  sourcePath,
  path: sourcePath.replace(/^scratch_pad\/github_code\//, "content/github_code/"),
  focus,
  highlightTerms,
});

const RAG_BASE = "scratch_pad/github_code/rag-for-beginners";
const LANGCHAIN_BASE = "scratch_pad/github_code/langchain-course";
const LANGGRAPH_BASE = "scratch_pad/github_code/langgraph";

const REFLEXION_CHAIN_FILES = [
  fileRef(`${LANGGRAPH_BASE}/4_reflexion_agent_system/chains.py`, "Responder/revisor prompts and tool-bound structured outputs."),
  fileRef(`${LANGGRAPH_BASE}/4_reflexion_agent_system/schema.py`, "Pydantic output schema for answer, critique, and references."),
];

const REACT_AGENT_FILES = [
  fileRef(`${LANGGRAPH_BASE}/6_react_agent/agent_reason_runnable.py`, "Reason step using ReAct prompt and tool-enabled runnable."),
  fileRef(`${LANGGRAPH_BASE}/6_react_agent/react_state.py`, "Typed state contract for agent outcome + intermediate steps."),
  fileRef(`${LANGGRAPH_BASE}/6_react_agent/nodes.py`, "Reason and act node implementations."),
  fileRef(`${LANGGRAPH_BASE}/6_react_agent/react_graph.py`, "StateGraph wiring and stop condition."),
];

const CHATBOT_FILES = [
  fileRef(`${LANGGRAPH_BASE}/7_chatbot/1_basic_chatbot.py`, "Single-node chatbot baseline."),
  fileRef(`${LANGGRAPH_BASE}/7_chatbot/2_chatbot_with_tools.py`, "Tool router + ToolNode loop."),
  fileRef(`${LANGGRAPH_BASE}/7_chatbot/3_chat_with_in_memory_checkpointer.py`, "Thread memory with in-memory checkpointer."),
  fileRef(`${LANGGRAPH_BASE}/7_chatbot/4_chat_with_sqlite_checkpointer.py`, "Durable memory with SQLite checkpointer."),
];

export const topicCodeGuides = Object.freeze({
  "rag/03-coding-injection-pipeline": guide(
    "Use the ingestion script from the course repo to revisit document loading, chunking, embedding, and vector-store persistence.",
    [
      fileRef(`${RAG_BASE}/1_ingestion_pipeline.py`, "End-to-end ingestion flow: loader -> splitter -> embeddings -> Chroma."),
    ],
    [
      "Trace where documents are loaded and validated before indexing.",
      "Observe chunk_size/chunk_overlap and how they affect context granularity.",
      "Confirm persisted vector DB path and embedding model configuration.",
    ]
  ),
  "rag/04-coding-retrieval-pipeline": guide(
    "Follow retrieval wiring from vector store to retriever invocation.",
    [fileRef(`${RAG_BASE}/2_retrieval_pipeline.py`, "Loads persisted Chroma DB and retrieves top-k context for a query.")],
    ["Compare basic similarity search vs threshold search (commented options)."]
  ),
  "rag/06-answer-generation-llm": guide(
    "This script shows grounding an answer by combining retrieved chunks with a final LLM call.",
    [fileRef(`${RAG_BASE}/3_answer_generation.py`, "RAG answer generation prompt that uses retrieved docs as context.")],
    ["Inspect how prompt constrains the model to provided documents only."]
  ),
  "rag/07-history-aware-conversational-rag": guide(
    "This implementation rewrites follow-up questions into standalone retrieval queries using chat history.",
    [fileRef(`${RAG_BASE}/4_history_aware_generation.py`, "History-aware query rewriting + retrieval + answer generation loop.")],
    ["Watch the question-rewrite step before retrieval and compare retrieval quality."]
  ),
  "rag/09-character-recursive-splitter": guide(
    "Compare fixed character splitting and recursive splitting behavior on the same text.",
    [fileRef(`${RAG_BASE}/5_recursive_character_text_spliiter.py`, "Demonstrates why recursive separators preserve coherence better.")],
    ["Review separator order and how fallback splitting works."]
  ),
  "rag/10-semantic-chunking": guide(
    "Semantic chunking groups content by meaning, not only by fixed character boundaries.",
    [fileRef(`${RAG_BASE}/6_semantic_chunking.py`, "Uses SemanticChunker with embedding-based breakpoints.")],
    ["Observe breakpoint threshold settings and resulting chunk boundaries."]
  ),
  "rag/11-agentic-chunking": guide(
    "Agentic chunking asks an LLM to decide chunk boundaries explicitly.",
    [fileRef(`${RAG_BASE}/7_agentic_chunking.py`, "Prompt-driven chunk planning and split marker parsing.")],
    ["Note tradeoff: better semantic grouping vs higher latency/cost."]
  ),
  "rag/12-multimodal-rag": guide(
    "Multimodal workflow reference is provided as a notebook in the local code mirror.",
    [fileRef(`${RAG_BASE}/8_multi_modal_rag.ipynb`, "Notebook flow for image + document retrieval context.")],
    ["Review modality-specific preprocessing and retrieval steps."]
  ),
  "rag/13-advanced-document-retrieval": guide(
    "Use this script to compare retrieval strategies and understand practical tuning knobs.",
    [fileRef(`${RAG_BASE}/9_retrieval_methods.py`, "Similarity/MMR/threshold retrieval patterns.")],
    ["Contrast diversity vs strict relevance in returned results."]
  ),
  "rag/14-multi-query-rag": guide(
    "Multi-query retrieval broadens recall by generating alternate query phrasings.",
    [fileRef(`${RAG_BASE}/10_multi_query_retrieval.py`, "Structured generation of query variations and per-query retrieval.")],
    ["Review structured output model used for query variants."]
  ),
  "rag/15-reciprocal-rank-fusion": guide(
    "RRF combines ranked outputs from multiple query passes into a stronger final ranking.",
    [fileRef(`${RAG_BASE}/11_reciprocal_rank_fusion.py`, "Implements reciprocal-rank scoring over multi-query results.")],
    ["Check how rank position contributes to final fusion score."]
  ),
  "rag/16-hybrid-search": guide(
    "Hybrid search reference notebook combines dense and keyword matching signals.",
    [fileRef(`${RAG_BASE}/12_hybrid_search.ipynb`, "Dense + sparse retrieval blend and ranking.")],
    ["Compare pure dense retrieval vs hybrid retrieval on the same question set."]
  ),
  "rag/17-rag-reranking-next-steps": guide(
    "Reranking notebook demonstrates a second-pass rank improvement stage.",
    [fileRef(`${RAG_BASE}/13_reranker.ipynb`, "Post-retrieval reranking pass before generation.")],
    ["Inspect latency/quality tradeoff of adding rerank stage."]
  ),

  "langchain/07-chat-models-setup": guide(
    "Starter chat-model setup script aligns with basic model invocation topics.",
    [fileRef(`${LANGCHAIN_BASE}/1_chat_models/1_chat_models_starter.py`, "Minimal chat model initialization and invoke pattern.")],
    ["Pin model/provider setup before composing larger chains."]
  ),
  "langchain/08-chat-models-history": guide(
    "Conversation handling baseline for carrying prior messages through turns.",
    [fileRef(`${LANGCHAIN_BASE}/1_chat_models/2_chat_models_conversation.py`, "Message-list based multi-turn conversation flow.")],
    ["Track how history is appended and reused per turn."]
  ),
  "langchain/09-chat-models-alternative-llms": guide(
    "This file compares provider/model swaps with minimal code changes.",
    [fileRef(`${LANGCHAIN_BASE}/1_chat_models/3_chat_models-alternative_models.py`, "Alternative model wiring without changing app-level flow.")],
    ["Review provider abstraction benefits and model-specific caveats."]
  ),
  "langchain/10-chat-models-realtime": guide(
    "Real-time conversation loop from the course code.",
    [fileRef(`${LANGCHAIN_BASE}/1_chat_models/4_chat_model_conversation_with_user.py`, "Interactive user input loop for live chat.")],
    ["Observe termination handling and message accumulation flow."]
  ),
  "langchain/11-chat-models-cloud-history": guide(
    "Cloud-backed history persistence implementation.",
    [fileRef(`${LANGCHAIN_BASE}/1_chat_models/5_chat_model_save_message_history_firebase.py`, "Stores and rehydrates chat messages from Firebase.")],
    ["Focus on session/thread identity and history retrieval path."]
  ),
  "langchain/12-prompt-templates": guide(
    "Prompt template starter aligns with prompt parameterization lessons.",
    [fileRef(`${LANGCHAIN_BASE}/2_prompt_templates/1_prompt_templates_starter.py`, "Parameterized prompt construction and invocation.")],
    ["Keep prompts parameterized to improve reuse and testing."]
  ),
  "langchain/14-chains-basic": guide(
    "Basic chain composition example using prompt + model pipeline.",
    [fileRef(`${LANGCHAIN_BASE}/3_chains/1_chains_basics.py`, "Simple chain construction and invoke path.")],
    ["Identify typed input/output boundaries in the chain."]
  ),
  "langchain/15-chains-inner-workings": guide(
    "Inspect internals of chain execution and data flow.",
    [fileRef(`${LANGCHAIN_BASE}/3_chains/2_chains_inner_workings.py`, "Demonstrates how intermediate values move through a chain.")],
    ["Map each stage input/output to avoid silent prompt/data mismatch."]
  ),
  "langchain/16-chains-sequential-chaining": guide(
    "Sequential composition pattern where output of one step feeds the next.",
    [fileRef(`${LANGCHAIN_BASE}/3_chains/3_chains_sequential.py`, "Linear multi-step chain design.")],
    ["Validate each stage output contract before downstream use."]
  ),
  "langchain/17-chains-parallel-chaining": guide(
    "Parallel chain execution pattern for independent branches.",
    [fileRef(`${LANGCHAIN_BASE}/3_chains/4_chains_parallel.py`, "Branch computation and merge pattern.")],
    ["Use parallel steps only when branches are independent."]
  ),
  "langchain/18-chains-conditional-chaining": guide(
    "Conditional branching based on runtime signal.",
    [fileRef(`${LANGCHAIN_BASE}/3_chains/5_chains_conditional.py`, "Route selection logic inside chain flow.")],
    ["Define explicit branch conditions and fallback behavior."]
  ),
  "langchain/24-rags-basic-example-1": guide(
    "First LangChain RAG basic example from the mirrored repo.",
    [fileRef(`${LANGCHAIN_BASE}/4_RAGs/1a_basic_part_1.py`, "Initial retrieval + generation assembly.")],
    ["Verify document loading and retriever setup before generation."]
  ),
  "langchain/25-rags-basic-example-2": guide(
    "Second basic RAG example that extends part 1 with additional flow detail.",
    [fileRef(`${LANGCHAIN_BASE}/4_RAGs/1b_basic_part_2.py`, "Continuation of baseline RAG pipeline.")],
    ["Compare part-1 and part-2 prompt/retrieval differences."]
  ),
  "langchain/26-rags-with-metadata": guide(
    "Metadata-aware retrieval examples for scoped filtering.",
    [
      fileRef(`${LANGCHAIN_BASE}/4_RAGs/2a_rag_basics_metadata.py`, "Adds metadata fields into retrieval pipeline."),
      fileRef(`${LANGCHAIN_BASE}/4_RAGs/2b_rag_basics_metadata.py`, "Extended metadata filtering/search behavior."),
    ],
    ["Check how metadata constraints alter retriever result sets."]
  ),
  "langchain/27-rags-one-off-question": guide(
    "Single-question retrieval path from local LangChain examples.",
    [fileRef(`${LANGCHAIN_BASE}/4_RAGs/3_rag_one_off_question.py`, "One-off query flow for ad-hoc retrieval.")],
    ["Useful for debugging retrieval quality before chat-state complexity."]
  ),
  "langchain/28-agents-tools-intro": guide(
    "Agent/tool baseline for introducing autonomous tool calling.",
    [fileRef(`${LANGCHAIN_BASE}/5_agents/1_basics.py`, "Basic agent + tool orchestration flow.")],
    ["Observe where tool selection is delegated to the model."]
  ),
  "langchain/29-agents-tools-deep-dive": guide(
    "Use the same agent baseline to inspect deeper behavior (tool schema, loop, and stop conditions).",
    [fileRef(`${LANGCHAIN_BASE}/5_agents/1_basics.py`, "Single reference implementation for agent/tool control flow.")],
    ["Deep-dive by tracing each action/observation turn."]
  ),

  "langgraph/01-introduction": guide(
    "Initial LangGraph orientation can be reinforced with the basic ReAct example.",
    [fileRef(`${LANGGRAPH_BASE}/1_Introduction/react_agent_basic.py`, "Foundational graph-first agent wiring.")],
    ["Read this before diving into reflection/reflexion variants."]
  ),
  "langgraph/03-agents-tools-intro": guide(
    "Agent/tool intro maps to the basic ReAct starter in the local LangGraph code.",
    [fileRef(`${LANGGRAPH_BASE}/1_Introduction/react_agent_basic.py`, "Minimal agent + tool scaffold in LangGraph.")],
    ["Identify how tool definitions plug into graph execution."]
  ),
  "langgraph/04-agents-and-tools-implementation": guide(
    "Implementation-level reference for agent + tool orchestration.",
    [fileRef(`${LANGGRAPH_BASE}/1_Introduction/react_agent_basic.py`, "Concrete implementation pattern for agent/tool wiring.")],
    ["Follow node execution sequence and state handoff."]
  ),
  "langgraph/13-reflection-agent-introduction": guide(
    "Reflection system starter implementation.",
    [fileRef(`${LANGGRAPH_BASE}/2_basic_reflection_system/basic.py`, "MessageGraph loop with generate/reflect cycle.")],
    ["Observe iterative critique loop and stop condition."]
  ),
  "langgraph/14-reflection-agent-creating-chains": guide(
    "Reflection and generation chains used inside the loop.",
    [fileRef(`${LANGGRAPH_BASE}/2_basic_reflection_system/chains.py`, "Prompt + model chains for generation and critique.")],
    ["Compare role of generation chain vs reflection chain."]
  ),
  "langgraph/15-reflection-agent-building-graph": guide(
    "Graph assembly for the reflection pattern.",
    [fileRef(`${LANGGRAPH_BASE}/2_basic_reflection_system/basic.py`, "Node wiring and conditional loop control.")],
    ["Track where graph exits vs where it loops back."]
  ),
  "langgraph/09.5-structured-llm-outputs": guide(
    "Structured output references from local LangGraph code.",
    [
      fileRef(`${LANGGRAPH_BASE}/3_structured_outputs/types.ipynb`, "Notebook examples for typed/structured output."),
      fileRef(`${LANGGRAPH_BASE}/4_reflexion_agent_system/schema.py`, "Pydantic schema used for strict output contracts."),
    ],
    ["Check how schema enforcement reduces parser ambiguity."]
  ),
  "langgraph/10-reflexion-agent-introduction": guide(
    "Reflexion architecture setup from local code.",
    REFLEXION_CHAIN_FILES,
    ["Review actor prompt instructions and structured tool output contract."]
  ),
  "langgraph/11-reflexion-agent-building-responder-chain": guide(
    "Responder chain details are in the Reflexion chain module.",
    REFLEXION_CHAIN_FILES,
    ["Focus on first_responder_chain and tool binding."]
  ),
  "langgraph/12-reflexion-agent-building-revisor-chain": guide(
    "Revisor chain implementation and revision constraints.",
    REFLEXION_CHAIN_FILES,
    ["Inspect revise_instructions and citation requirements."]
  ),
  "langgraph/13-reflexion-agent-tool-execution-component": guide(
    "Tool execution adapter from the Reflexion example.",
    [fileRef(`${LANGGRAPH_BASE}/4_reflexion_agent_system/execute_tools.py`, "Executes search queries from tool calls and returns ToolMessage payloads.")],
    ["Check how tool-call args are parsed and normalized before returning to state."]
  ),
  "langgraph/14-reflexion-agent-building-graph": guide(
    "Full Reflexion graph wiring with bounded iteration.",
    [fileRef(`${LANGGRAPH_BASE}/4_reflexion_agent_system/reflexion_graph.py`, "Draft -> execute_tools -> revise loop with max iteration guard.")],
    ["Confirm event_loop termination condition is explicit and bounded."]
  ),
  "langgraph/16-manual-state-transformation": guide(
    "Manual state updates are demonstrated in this state deep-dive script.",
    [fileRef(`${LANGGRAPH_BASE}/5_state_deepdive/1_basic_state.py`, "Explicitly updates state fields each step.")],
    ["Track how count field is mutated until stop condition."]
  ),
  "langgraph/17-declarative-annotated-state-transformation": guide(
    "Annotated reducers for additive/concat state merges.",
    [fileRef(`${LANGGRAPH_BASE}/5_state_deepdive/2_complex_state.py`, "Uses Annotated reducers for sum/history fields.")],
    ["Compare reducer-driven updates vs manual field mutation."]
  ),
  "langgraph/05-react-using-langgraph-overview": guide(
    "ReAct overview ties directly to the local multi-file ReAct agent implementation.",
    REACT_AGENT_FILES,
    ["Read files in order: state -> reason runnable -> nodes -> graph."]
  ),
  "langgraph/06-react-using-langgraph-reasoning-runnable": guide(
    "Reasoning runnable details and prompt/tool setup.",
    REACT_AGENT_FILES,
    ["Focus on create_react_agent and tool list wiring."]
  ),
  "langgraph/07-react-using-langgraph-state": guide(
    "State contract used by the ReAct graph loop.",
    REACT_AGENT_FILES,
    ["Understand each state key before tracing node behavior."]
  ),
  "langgraph/08-react-using-langgraph-building-nodes": guide(
    "Node-level implementation for reasoning and acting.",
    REACT_AGENT_FILES,
    ["Trace how tool output is appended into intermediate_steps."]
  ),
  "langgraph/10-react-using-langgraph-final-graph": guide(
    "Final ReAct graph assembly and loop termination.",
    REACT_AGENT_FILES,
    ["Validate conditional edge logic from reason node."]
  ),
  "langgraph/25-chatbot-basic": guide(
    "Baseline chatbot implementation without tools/memory.",
    CHATBOT_FILES,
    ["Start with file 1 and verify single-turn flow first."]
  ),
  "langgraph/26-chatbot-with-tools": guide(
    "Tool-enabled chatbot implementation with conditional routing.",
    CHATBOT_FILES,
    ["Focus on tool router condition and loop-back to chatbot node."]
  ),
  "langgraph/27-chatbot-with-memory-what-is-checkpointer": guide(
    "Memory-enabled chatbot with in-memory checkpointer and thread_id config.",
    CHATBOT_FILES,
    ["Use same thread_id to observe memory persistence across turns."]
  ),
  "langgraph/28-chatbot-with-sqlitesaver-checkpointer": guide(
    "Durable memory variant using SQLite checkpointer.",
    CHATBOT_FILES,
    ["Compare restart behavior of SQLite saver vs in-memory saver."]
  ),
  "langgraph/29-human-in-the-loop-introduction": guide(
    "Human review loop baseline from local HITL examples.",
    [fileRef(`${LANGGRAPH_BASE}/8_human-in-the-loop/1_using_input().py`, "Manual review gate that loops with human feedback.")],
    ["Observe approve/revise branch and return-to-generate cycle."]
  ),
  "langgraph/30-human-in-the-loop-command-class": guide(
    "Command-based control-flow example notebook for HITL routing.",
    [fileRef(`${LANGGRAPH_BASE}/8_human-in-the-loop/2_command.ipynb`, "Command object usage for goto + state update decisions.")],
    ["Map resume payload to explicit Command routing output."]
  ),
  "langgraph/31-human-in-the-loop-resume-graph": guide(
    "Resume flow reference notebook for interrupt/resume orchestration.",
    [fileRef(`${LANGGRAPH_BASE}/8_human-in-the-loop/3_resume.ipynb`, "Resume-time continuation pattern after interrupt.")],
    ["Inspect how state is resumed using persisted execution context."]
  ),
  "langgraph/32-human-in-the-loop-review-tool-calls": guide(
    "Tool-call review pattern reference notebook.",
    [fileRef(`${LANGGRAPH_BASE}/8_human-in-the-loop/4_approval.ipynb`, "Approval gate before tool execution.")],
    ["Validate pre-tool approval path and rejection fallback."]
  ),
  "langgraph/33-human-in-the-loop-multi-turn-conversations": guide(
    "Multi-turn HITL implementation with interrupt + memory.",
    [fileRef(`${LANGGRAPH_BASE}/8_human-in-the-loop/5_multiturn_conversation.py`, "Iterative human feedback loop with finalization control.")],
    ["Follow model -> human_node -> Command loop until done signal."]
  ),
});
