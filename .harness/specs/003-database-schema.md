---
status: in-progress
created: 2026-07-13
---

# Spec: feat/003-database-schema

## 1. Overview

Define the database schema with Prisma models for File, Chunk, and ChatMessage. Enable pgvector extension for vector embeddings and create initial migration.

## 2. Acceptance Criteria

- [ ] File model created with all required fields
- [ ] Chunk model created with vector embedding support
- [ ] ChatMessage model created for conversation history
- [ ] pgvector extension enabled via migration
- [ ] HNSW index created on embedding column
- [ ] Relations defined (File -> Chunks, File -> ChatMessages)
- [ ] Soft delete enabled on File model
- [ ] Migration runs successfully
- [ ] Prisma Client generates without errors
- [ ] Lint passes: `bun run lint`
- [ ] Type check passes: `bun x tsc --noEmit`

## 3. Architecture (Architect)

### Types & Interfaces

```typescript
// File status enum
type FileStatus = "uploading" | "processing" | "ready" | "error"

// Chat message role
type MessageRole = "user" | "assistant"
```

### Data Models

```prisma
// File model - stores uploaded PDF metadata
model File {
  id            String    @id @default(uuid())
  name          String
  size          Int
  status        FileStatus @default(uploading)
  pageCount     Int?
  errorMessage  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Relations
  chunks        Chunk[]
  chatMessages  ChatMessage[]

  @@map("files")
}

// Chunk model - stores text chunks with vector embeddings
model Chunk {
  id            String   @id @default(uuid())
  fileId        String
  text          String
  embedding     Unsupported("vector(768)")
  pageNumber    Int
  chunkIndex    Int
  createdAt     DateTime @default(now())

  // Relations
  file          File     @relation(fields: [fileId], references: [id], onDelete: Cascade)

  @@index([fileId])
  @@map("chunks")
}

// ChatMessage model - stores conversation history
model ChatMessage {
  id            String   @id @default(uuid())
  fileId        String
  role          MessageRole
  content       String
  createdAt     DateTime @default(now())

  // Relations
  file          File     @relation(fields: [fileId], references: [id], onDelete: Cascade)

  @@index([fileId])
  @@map("chat_messages")
}

// Enums
enum FileStatus {
  uploading
  processing
  ready
  error
}

enum MessageRole {
  user
  assistant
}
```

### File Structure

```
prisma/
├── schema.prisma          # MODIFIED: add models
├── migrations/
│   └── YYYYMMDD_init/     # CREATED: initial migration
└── ...
```

## 4. Implementation Notes

1. **pgvector extension**: Create a raw SQL migration to enable pgvector: `CREATE EXTENSION vector;`
2. **Vector column**: Use `Unsupported("vector(768)")` in Prisma schema for embedding column
3. **HNSW index**: Create via raw SQL migration for fast similarity search
4. **Soft delete**: Add `deletedAt` field to File model, filter manually in queries
5. **Relations**: File has many Chats and ChatMessages, with cascade delete
6. **Indexing**: Add indexes on frequently queried fields (fileId)

## 5. Verification

```bash
bunx prisma migrate dev --name init    # Create and apply migration
bunx prisma generate                    # Regenerate Prisma Client
bun run lint                            # Code style check
bun x tsc --noEmit                      # Type safety check
```

## 6. Dependencies

- PostgreSQL with pgvector extension installed
- `DATABASE_URL` configured in `.env`
