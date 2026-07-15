import { describe, test, expect, mock, beforeEach } from "bun:test";

const mockQueryRaw = mock(() => Promise.resolve<never[]>([]));

mock.module("@/lib/prisma", () => ({
  prisma: {
    $queryRawUnsafe: mockQueryRaw,
  },
}));

describe("vector-search", () => {
  beforeEach(() => {
    mockQueryRaw.mockClear();
  });

  test("searchSimilarChunks calls raw SQL with correct params", async () => {
    const { searchSimilarChunks } = await import("./vector-search");
    const embedding = new Array(768).fill(0.1);
    const fileIds = ["file-1", "file-2"];

    mockQueryRaw.mockResolvedValue([
      {
        id: "chunk-1",
        fileId: "file-1",
        text: "test content",
        pageNumber: 1,
        chunkIndex: 0,
        fileName: "test.pdf",
        distance: 0.25,
      },
    ] as never);

    const results = await searchSimilarChunks(embedding, fileIds, 5);

    expect(mockQueryRaw).toHaveBeenCalled();
    expect(results).toHaveLength(1);
    expect(results[0].fileName).toBe("test.pdf");
    expect(results[0].distance).toBe(0.25);
  });

  test("searchSimilarChunks defaults to top K=5", async () => {
    const { searchSimilarChunks } = await import("./vector-search");
    const embedding = new Array(768).fill(0.1);

    await searchSimilarChunks(embedding, ["file-1"]);

    expect(mockQueryRaw).toHaveBeenCalled();
    const callArgs = mockQueryRaw.mock.calls[0] as unknown[];
    expect(callArgs[3]).toBe(5);
  });

  test("searchSimilarChunks respects custom topK", async () => {
    const { searchSimilarChunks } = await import("./vector-search");
    const embedding = new Array(768).fill(0.1);

    await searchSimilarChunks(embedding, ["file-1"], 10);

    expect(mockQueryRaw).toHaveBeenCalled();
    const callArgs = mockQueryRaw.mock.calls[0] as unknown[];
    expect(callArgs[3]).toBe(10);
  });

  test("searchSimilarChunks returns empty array when no matches", async () => {
    const { searchSimilarChunks } = await import("./vector-search");
    const embedding = new Array(768).fill(0.1);

    mockQueryRaw.mockResolvedValue([] as never);

    const results = await searchSimilarChunks(embedding, ["file-1"]);
    expect(results).toEqual([]);
  });
});
