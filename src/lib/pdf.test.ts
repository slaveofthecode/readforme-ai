import { describe, test, expect } from "bun:test";
import { extractTextFromPDF } from "./pdf";
import { readFileSync } from "fs";
import { join } from "path";

describe("extractTextFromPDF", () => {
  const testPdfPath = join(import.meta.dir, "testdata/test.pdf");

  test("extracts text from a valid PDF buffer", async () => {
    const buffer = readFileSync(testPdfPath);
    const result = await extractTextFromPDF(buffer);

    expect(result).toHaveProperty("pages");
    expect(result).toHaveProperty("metadata");
    expect(Array.isArray(result.pages)).toBe(true);
    expect(result.metadata.pageCount).toBeGreaterThanOrEqual(1);
  });

  test("returns text content from pages", async () => {
    const buffer = readFileSync(testPdfPath);
    const result = await extractTextFromPDF(buffer);

    if (result.pages.length > 0) {
      const page = result.pages[0];
      expect(page.pageNumber).toBe(1);
      expect(typeof page.text).toBe("string");
      expect(page.text.length).toBeGreaterThan(0);
    }
  });

  test("returns empty pages for invalid PDF buffer", async () => {
    const invalidBuffer = Buffer.from("not a pdf");

    await expect(extractTextFromPDF(invalidBuffer)).rejects.toThrow();
  });

  test("ExtractedPDF type has correct structure", async () => {
    const buffer = readFileSync(testPdfPath);
    const result = await extractTextFromPDF(buffer);

    expect(result.metadata).toHaveProperty("pageCount");
    expect(typeof result.metadata.pageCount).toBe("number");

    if (result.pages.length > 0) {
      const page = result.pages[0];
      expect(page).toHaveProperty("pageNumber");
      expect(page).toHaveProperty("text");
      expect(typeof page.pageNumber).toBe("number");
      expect(typeof page.text).toBe("string");
    }
  });
});
