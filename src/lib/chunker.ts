import type { ExtractedPage } from "./pdf";

export interface Chunk {
  text: string;
  pageNumber: number;
  chunkIndex: number;
}

interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

const DEFAULT_CHUNK_SIZE = 2000;
const DEFAULT_OVERLAP = 300;

export function chunkText(
  pages: ExtractedPage[],
  options?: ChunkOptions,
): Chunk[] {
  const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options?.overlap ?? DEFAULT_OVERLAP;
  const chunks: Chunk[] = [];
  let chunkIndex = 0;

  for (const page of pages) {
    const text = page.text;
    if (text.length === 0) continue;

    if (text.length <= chunkSize) {
      chunks.push({
        text,
        pageNumber: page.pageNumber,
        chunkIndex: chunkIndex++,
      });
      continue;
    }

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);

      chunks.push({
        text: chunk,
        pageNumber: page.pageNumber,
        chunkIndex: chunkIndex++,
      });

      if (end >= text.length) break;
      start += chunkSize - overlap;
    }
  }

  return chunks;
}
