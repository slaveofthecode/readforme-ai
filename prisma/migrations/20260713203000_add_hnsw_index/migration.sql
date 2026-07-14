-- CreateIndex
CREATE INDEX "chunks_embedding_idx" ON "chunks" USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200);
