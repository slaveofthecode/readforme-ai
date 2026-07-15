import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { pathToFileURL } from "url";
import { resolve } from "path";

const workerPath = resolve(
  process.cwd(),
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPDF {
  pages: ExtractedPage[];
  metadata: { pageCount: number };
}

export async function extractTextFromPDF(
  buffer: Buffer,
): Promise<ExtractedPDF> {
  const data = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const pages: ExtractedPage[] = [];
  const maxPages = Math.min(doc.numPages, 100);

  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => {
        if ("str" in item) {
          return item.str;
        }
        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length > 0) {
      pages.push({ pageNumber: i, text });
    }
  }

  return {
    pages,
    metadata: { pageCount: doc.numPages },
  };
}
