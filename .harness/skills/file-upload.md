# SKILL: FILE UPLOAD HANDLING

## 1. Drag-and-Drop UI

- Use a shadcn component or custom drop zone for drag-and-drop file input.
- Accept only PDF files (`accept=".pdf"` and MIME type `application/pdf`).
- Validate file size client-side before uploading (recommended max: 5MB per file).
- Show upload progress with a progress bar during the upload.

## 2. Next.js Route Handler

- Create API routes at `app/api/upload/route.ts` using `POST` method.
- Use `formidable` or the native `Request.formData()` API for file parsing.
- Validate file type and size server-side before processing.
- Pass the file buffer in memory to the processing pipeline — do NOT write to disk (Vercel serverless has a read-only filesystem).
- Save file metadata (original name, size, upload date) to the database via Prisma.

## 3. File Validation

- Check MIME type server-side — never trust client-side validation alone.
- Limit file size with a configurable max size constant.
- Sanitize file names to prevent directory traversal attacks.
- Generate unique file names (UUID + original extension) to avoid collisions.

## 4. Error Handling

- Return appropriate HTTP status codes: 400 for validation errors, 413 for file too large, 500 for server errors.
- Return JSON error responses with a message field.
- Clean up partially uploaded files on error.
