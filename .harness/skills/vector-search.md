# SKILL: VECTOR SEARCH & EMBEDDINGS

## 1. PostgreSQL + pgvector Setup

- Enable the pgvector extension: `CREATE EXTENSION vector;`.
- Define the vector column in Prisma schema using `Unsupported("vector(768)")` for Gemini embeddings.
- Create a HNSW index on the vector column for fast approximate nearest neighbor search.
- Connection string must include the database name where pgvector is installed.

## 2. Embedding Generation

- Use Google Gemini Embedding API (`gemini-embedding-001` model).
- Embedding dimension: 768 (reduced from 3072 default via `outputDimensionality`).
- Use raw REST API (`batchEmbedContents`) for `outputDimensionality` support (SDK v0.24.1 lacks this parameter).
- Batch embed chunks to reduce API calls (max 100 chunks per batch).
- Store embeddings in the database alongside the chunk text and metadata.

## 3. Similarity Search

- Use cosine similarity for comparing embeddings (default for Gemini).
- Raw SQL query for vector search (Prisma does not natively support vector operations):

```sql
SELECT * FROM chunks
ORDER BY embedding <=> $1
LIMIT $2
```

- Return top K results (K = 5-10 for RAG context).
- Include similarity score in results for relevance filtering.
- Filter by file ID to search within specific files only (respecting checkboxes).

## 4. Indexing

- Use HNSW index for best search performance (accuracy vs speed tradeoff).
- Index configuration: `m = 16` (max connections per layer), `ef_construction = 200`.
- Re-index after bulk inserts to maintain performance.

## 5. Cost & Rate Limits

- Gemini free tier has rate limits for embeddings — batch requests and cache embeddings when possible.
- Monitor token usage for embedding generation.
- Implement exponential backoff on rate limit errors.
