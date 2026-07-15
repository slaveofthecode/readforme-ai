/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, mock, beforeEach, spyOn } from "bun:test";
import type { File } from "@prisma/client";

function createMockFile(overrides: Partial<File> = {}): File {
  return {
    id: "test-id",
    name: "test.pdf",
    size: 1024,
    status: "pending",
    pageCount: null,
    filePath: "/fake/path.pdf",
    errorMessage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  } as File;
}

const mockPrisma = {
  file: {
    findUnique: mock(() => Promise.resolve(null as File | null)),
    update: mock(() => Promise.resolve({})),
  },
  $executeRaw: mock(() => Promise.resolve(0)),
};

const mockReadFile = mock(() => Promise.resolve(Buffer.from("fake pdf")));

mock.module("@/lib/prisma", () => ({ prisma: mockPrisma }));
mock.module("fs/promises", () => ({
  default: { readFile: mockReadFile },
  readFile: mockReadFile,
}));

const pdfModule = await import("./pdf");
const chunkerModule = await import("./chunker");
const embeddingModule = await import("./embedding");

spyOn(pdfModule, "extractTextFromPDF");
spyOn(chunkerModule, "chunkText");
spyOn(embeddingModule, "generateEmbeddings");

const mockPdf = pdfModule.extractTextFromPDF as any;
const mockChunk = chunkerModule.chunkText as any;
const mockEmbed = embeddingModule.generateEmbeddings as any;

mockPdf.mockResolvedValue({
  pages: [{ pageNumber: 1, text: "Test content" }],
  metadata: { pageCount: 1 },
});
mockChunk.mockReturnValue([
  { text: "Test content", pageNumber: 1, chunkIndex: 0 },
]);
mockEmbed.mockResolvedValue([[0.1, 0.2, 0.3]]);

const { processUpload } = await import("./upload-processor");

describe("processUpload", () => {
  beforeEach(() => {
    mockPrisma.file.findUnique.mockClear();
    mockPrisma.file.update.mockClear();
    mockPrisma.$executeRaw.mockClear();
    mockReadFile.mockClear();
    mockPdf.mockClear();
    mockChunk.mockClear();
    mockEmbed.mockClear();

    mockPrisma.file.findUnique.mockResolvedValue(
      createMockFile({ id: "test-id", filePath: "/fake/path.pdf" }),
    );
    mockPdf.mockResolvedValue({
      pages: [{ pageNumber: 1, text: "Test content" }],
      metadata: { pageCount: 1 },
    });
    mockChunk.mockReturnValue([
      { text: "Test content", pageNumber: 1, chunkIndex: 0 },
    ]);
    mockEmbed.mockResolvedValue([[0.1, 0.2, 0.3]]);
  });

  test("updates file status to processing then ready on success", async () => {
    await processUpload("test-id");

    const updateCalls = mockPrisma.file.update.mock.calls as any[];
    expect(updateCalls.length).toBeGreaterThanOrEqual(2);
    expect(updateCalls[0][0]).toMatchObject({
      where: { id: "test-id" },
      data: { status: "processing" },
    });
    expect(updateCalls[updateCalls.length - 1][0]).toMatchObject({
      where: { id: "test-id" },
      data: { status: "ready" },
    });
  });

  test("updates file status to error when file not found", async () => {
    mockPrisma.file.findUnique.mockResolvedValue(null);

    await processUpload("nonexistent-id");

    const updateCalls = mockPrisma.file.update.mock.calls as any[];
    const lastCall = updateCalls[updateCalls.length - 1][0];
    expect(lastCall).toMatchObject({
      where: { id: "nonexistent-id" },
      data: { status: "error" },
    });
  });

  test("updates pageCount during processing", async () => {
    await processUpload("test-id");

    const updateCalls = mockPrisma.file.update.mock.calls as any[];
    const pageCountCall = updateCalls.find(
      (call: any[]) => call[0]?.data && "pageCount" in call[0].data,
    );
    expect(pageCountCall).toBeDefined();
  });

  test("inserts chunks via raw SQL", async () => {
    await processUpload("test-id");
    expect(mockPrisma.$executeRaw).toHaveBeenCalled();
  });

  test("reads file from disk", async () => {
    await processUpload("test-id");
    expect(mockReadFile).toHaveBeenCalledWith("/fake/path.pdf");
  });

  test("extracts text, chunks, and embeds", async () => {
    await processUpload("test-id");

    expect(mockPdf).toHaveBeenCalled();
    expect(mockChunk).toHaveBeenCalled();
    expect(mockEmbed).toHaveBeenCalled();
  });

  test("handles extraction error gracefully", async () => {
    mockPdf.mockRejectedValue(new Error("Invalid PDF"));

    await processUpload("test-id");

    const updateCalls = mockPrisma.file.update.mock.calls as any[];
    const lastCall = updateCalls[updateCalls.length - 1][0];
    expect(lastCall.data.status).toBe("error");
    expect(lastCall.data.errorMessage).toBe("Invalid PDF");
  });

  test("handles embedding error gracefully", async () => {
    mockEmbed.mockRejectedValue(new Error("API rate limit"));

    await processUpload("test-id");

    const updateCalls = mockPrisma.file.update.mock.calls as any[];
    const lastCall = updateCalls[updateCalls.length - 1][0];
    expect(lastCall.data.status).toBe("error");
    expect(lastCall.data.errorMessage).toBe("API rate limit");
  });

  test("full pipeline calls steps in order", async () => {
    const callOrder: string[] = [];

    mockPrisma.file.findUnique.mockImplementation(async () => {
      callOrder.push("findUnique");
      return createMockFile({ id: "test-id", filePath: "/fake/path.pdf" });
    });
    mockReadFile.mockImplementation(async () => {
      callOrder.push("readFile");
      return Buffer.from("pdf content");
    });
    mockPdf.mockImplementation(async () => {
      callOrder.push("extractText");
      return {
        pages: [{ pageNumber: 1, text: "Test" }],
        metadata: { pageCount: 1 },
      };
    });
    mockChunk.mockImplementation(() => {
      callOrder.push("chunkText");
      return [{ text: "Test", pageNumber: 1, chunkIndex: 0 }];
    });
    mockEmbed.mockImplementation(async () => {
      callOrder.push("generateEmbeddings");
      return [[0.1]];
    });

    await processUpload("test-id");

    expect(callOrder).toEqual([
      "findUnique",
      "readFile",
      "extractText",
      "chunkText",
      "generateEmbeddings",
    ]);
  });
});
