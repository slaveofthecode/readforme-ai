-- DropIndex
DROP INDEX "chunks_embedding_idx";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "filePath" TEXT;
