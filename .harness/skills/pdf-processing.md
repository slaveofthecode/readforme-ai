# SKILL: PDF PROCESSING & TEXT EXTRACTION

## 1. PDF Parsing Libraries

- Use `pdf.js` (pdfjs-dist) for browser-side or server-side PDF text extraction.
- Use `pdf-parse` as a simpler alternative for Node.js environments (server-side only).
- For complex PDFs (scanned documents), consider OCR solutions as a fallback.

## 2. Text Extraction

- Extract text content from each page of the PDF.
- Preserve page numbers as metadata for citation in chat responses.
- Clean extracted text: remove excessive whitespace, normalize line breaks.
- Return structured output: `{ pages: [{ pageNumber, text }], metadata: { title, author, pageCount } }`.

## 3. Chunking Strategy

- Split extracted text into chunks for embedding and retrieval.
- Recommended chunk size: 500-1000 tokens (approximately 2000-4000 characters).
- Use overlapping chunks (10-15% overlap) to preserve context across chunk boundaries.
- Strategy options:
  - **Fixed-size chunking:** Simple, split by character/token count.
  - **Recursive chunking:** Split by paragraphs first, then sentences, then characters.
  - **Semantic chunking:** Split at natural boundaries (paragraphs, sections).
- Store chunk metadata: source file ID, chunk index, page range, character offset.

## 4. Error Handling

- Handle corrupted PDFs gracefully with descriptive error messages.
- Set a maximum page limit per file (e.g., 100 pages) to prevent abuse.
- Log extraction failures without crashing the upload pipeline.
