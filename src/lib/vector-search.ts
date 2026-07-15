import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  fileId: string;
  text: string;
  pageNumber: number;
  chunkIndex: number;
  fileName: string;
  distance: number;
}

export async function searchSimilarChunks(
  queryEmbedding: number[],
  fileIds: string[],
  topK = 5,
): Promise<SearchResult[]> {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRawUnsafe<SearchResult[]>(
    `SELECT c.id, c."fileId", c.text, c."pageNumber", c."chunkIndex",
            f.name AS "fileName",
            (c.embedding <=> $1::vector) AS distance
     FROM chunks c
     JOIN files f ON f.id = c."fileId"
     WHERE c."fileId" = ANY($2::text[])
       AND f."deletedAt" IS NULL
       AND f.status = 'ready'
     ORDER BY c.embedding <=> $1::vector
     LIMIT $3`,
    embeddingStr,
    fileIds,
    topK,
  );

  return results;
}
