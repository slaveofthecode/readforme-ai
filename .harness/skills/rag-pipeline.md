# SKILL: RAG PIPELINE (RETRIEVAL-AUGMENTED GENERATION)

## 1. Architecture Overview

The RAG pipeline follows this workflow:

```
Upload PDF → Extract Text → Chunk → Embed → Store in pgvector
                                                      ↓
User Query → Embed Query → Vector Search → Retrieve Chunks → Build Prompt → LLM → Stream Response
```

## 2. Ingestion Pipeline (Upload)

1. User uploads a PDF file.
2. Extract text content from the PDF.
3. Split text into chunks with overlap.
4. Generate embeddings for each chunk via Gemini API.
5. Store chunks with embeddings and metadata in pgvector.
6. Store file metadata (name, size, status) in the database.

## 3. Retrieval Pipeline (Query)

1. User sends a chat message with selected file IDs.
2. Embed the user's query using the same embedding model.
3. Perform vector similarity search against chunks that belong to the selected files.
4. Retrieve top K most relevant chunks (K = 5-10).
5. Format chunks as context for the LLM prompt.

## 4. Generation Pipeline (Response)

1. Build a system prompt with the retrieved context.
2. Send the prompt to Gemini with streaming enabled.
3. Stream the response back to the chat interface.
4. Include citations referencing source file names and page numbers.
5. Store the query and response in chat history (database or Zustand).

## 5. Prompt Template

```
You are an assistant that answers questions based on the provided documents.
Answer only using the context below. If the answer is not in the context,
say "I cannot find this information in the selected documents."

Context:
{retrieved_chunks}

Question: {user_query}
```

## 6. Quality Considerations

- Chunk overlap prevents losing context at chunk boundaries.
- Filtering by selected files ensures responses only reference user-approved documents.
- Streaming provides a better user experience for long responses.
- Caching embeddings reduces API costs and latency.
