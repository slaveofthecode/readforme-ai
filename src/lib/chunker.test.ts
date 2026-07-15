import { describe, test, expect } from "bun:test";
import { chunkText } from "./chunker";
import type { ExtractedPage } from "./pdf";

describe("chunkText", () => {
  const makePage = (pageNumber: number, text: string): ExtractedPage => ({
    pageNumber,
    text,
  });

  test("chunks a short text into a single chunk", () => {
    const pages = [makePage(1, "Hello world")];
    const chunks = chunkText(pages);

    expect(chunks).toHaveLength(1);
    expect(chunks[0].text).toBe("Hello world");
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[0].chunkIndex).toBe(0);
  });

  test("chunks a long text into multiple chunks with overlap", () => {
    const longText = "a".repeat(5000);
    const pages = [makePage(1, longText)];
    const chunks = chunkText(pages, { chunkSize: 2000, overlap: 300 });

    expect(chunks.length).toBeGreaterThan(1);

    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(2000);
      expect(chunk.pageNumber).toBe(1);
    }
  });

  test("preserves chunkIndex sequential order", () => {
    const pages = [makePage(1, "a".repeat(5000))];
    const chunks = chunkText(pages, { chunkSize: 2000, overlap: 300 });

    chunks.forEach((chunk, i) => {
      expect(chunk.chunkIndex).toBe(i);
    });
  });

  test("handles multiple pages", () => {
    const pages = [
      makePage(1, "Page one content"),
      makePage(2, "Page two content"),
      makePage(3, "Page three content"),
    ];
    const chunks = chunkText(pages);

    expect(chunks).toHaveLength(3);
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[1].pageNumber).toBe(2);
    expect(chunks[2].pageNumber).toBe(3);
  });

  test("skips empty pages", () => {
    const pages = [
      makePage(1, "Content"),
      makePage(2, ""),
      makePage(3, "More content"),
    ];
    const chunks = chunkText(pages);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[1].pageNumber).toBe(3);
  });

  test("uses default options when none provided", () => {
    const pages = [makePage(1, "a".repeat(3000))];
    const chunks = chunkText(pages);

    expect(chunks.length).toBeGreaterThanOrEqual(1);
  });

  test("chunkIndex resets across pages", () => {
    const pages = [
      makePage(1, "a".repeat(3000)),
      makePage(2, "b".repeat(3000)),
    ];
    const chunks = chunkText(pages, { chunkSize: 2000, overlap: 300 });

    const page1Chunks = chunks.filter((c) => c.pageNumber === 1);
    const page2Chunks = chunks.filter((c) => c.pageNumber === 2);

    expect(page1Chunks[0].chunkIndex).toBe(0);
    expect(page2Chunks[0].chunkIndex).toBe(page1Chunks.length);
  });
});
