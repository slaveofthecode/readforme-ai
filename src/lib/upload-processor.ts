import { prisma } from "./prisma"
import { extractTextFromPDF } from "./pdf"
import { chunkText } from "./chunker"
import { generateEmbeddings } from "./embedding"
import fs from "fs/promises"

export async function processUpload(fileId: string): Promise<void> {
  try {
    console.log(`[UploadProcessor] Starting processing for file ${fileId}`)

    const file = await prisma.file.findUnique({ where: { id: fileId } })
    if (!file) throw new Error("File not found")

    await prisma.file.update({
      where: { id: fileId },
      data: { status: "processing" },
    })

    console.log(`[UploadProcessor] Reading file from ${file.filePath}`)
    const buffer = await fs.readFile(file.filePath!)

    console.log(`[UploadProcessor] Extracting text from PDF`)
    const extracted = await extractTextFromPDF(buffer)
    console.log(`[UploadProcessor] Extracted ${extracted.pages.length} pages`)

    await prisma.file.update({
      where: { id: fileId },
      data: { pageCount: extracted.metadata.pageCount },
    })

    const chunks = chunkText(extracted.pages)
    console.log(`[UploadProcessor] Created ${chunks.length} chunks`)

    const texts = chunks.map((c) => c.text)
    console.log(`[UploadProcessor] Generating embeddings for ${texts.length} chunks`)
    const embeddings = await generateEmbeddings(texts)
    console.log(`[UploadProcessor] Generated ${embeddings.length} embeddings`)

    for (let i = 0; i < chunks.length; i++) {
      await prisma.$executeRaw`
        INSERT INTO chunks (id, "fileId", text, embedding, "pageNumber", "chunkIndex", "createdAt")
        VALUES (gen_random_uuid(), ${fileId}, ${chunks[i].text}, ${JSON.stringify(embeddings[i])}::vector, ${chunks[i].pageNumber}, ${chunks[i].chunkIndex}, NOW())
      `
    }

    await prisma.file.update({
      where: { id: fileId },
      data: { status: "ready" },
    })

    console.log(`[UploadProcessor] File ${fileId} ready`)
  } catch (error) {
    console.error(`[UploadProcessor] Error processing file ${fileId}:`, error)

    const message =
      error instanceof Error ? error.message : "Unknown processing error"

    await prisma.file.update({
      where: { id: fileId },
      data: { status: "error", errorMessage: message },
    })
  }
}
