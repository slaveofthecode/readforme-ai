# ReadForMe AI

## Description

ReadForMe AI is a web application that allows users to **upload PDF documents and chat with their content** using artificial intelligence. The app processes documents, extracts text, generates vector embeddings, and uses RAG (Retrieval-Augmented Generation) to answer questions based exclusively on the content of the uploaded documents.

## Key Features

- **PDF Upload:** Drag-and-drop or select PDF files to upload
- **Document Processing:** Text extraction, intelligent chunking with overlap
- **Document Chat:** Conversational interface to ask about document content
- **RAG Pipeline:** Semantic search for relevant chunks before generating responses
- **Multi-Document:** Select multiple documents for combined context
- **Citations & Sources:** Responses with references to source (file + page)
- **Chat History:** Persistent conversations per session

## Architecture

```
User uploads PDF
      ↓
Text extraction (pdfjs-dist)
      ↓
Chunking with overlap (500-1000 tokens)
      ↓
Embedding generation (Gemini text-embedding-004)
      ↓
Storage in PostgreSQL + pgvector
      ↓
─────────────────────────────────
      ↓
User sends question
      ↓
Query embedding
      ↓
Similarity search (cosine) → Top K chunks
      ↓
Prompt construction with context
      ↓
Response generation (Gemini 1.5 Flash)
      ↓
Response streaming to chat
```

## Tech Stack

| Layer              | Technology                | Purpose                              |
| ------------------ | ------------------------- | ------------------------------------ |
| **Framework**      | Next.js 16 (App Router)   | Full-stack React framework           |
| **Runtime**        | Bun                       | JavaScript runtime + package manager |
| **Language**       | TypeScript (Strict)       | Full type safety                     |
| **Frontend**       | React 19                  | UI library                           |
| **Styling**        | Tailwind CSS 4            | Utility-first CSS                    |
| **UI Components**  | Shadcn/ui                 | Pre-built components                 |
| **State (UI)**     | Zustand                   | Client state management              |
| **State (Server)** | TanStack Query            | Server state + cache                 |
| **ORM**            | Prisma 7                  | Database access                      |
| **Database**       | PostgreSQL + pgvector     | Storage + vectors                    |
| **Embeddings**     | Gemini text-embedding-004 | Vector generation (768d)             |
| **LLM**            | Gemini 1.5 Flash          | Response generation                  |
| **PDF Parser**     | pdfjs-dist                | Text extraction                      |
| **Testing**        | Bun Test                  | Unit testing                         |
| **Linting**        | ESLint + Prettier         | Code quality                         |

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (PostgreSQL with pgvector)
DATABASE_URL="postgresql://user:password@localhost:5432/readforme"

# Google Gemini API Key
# Get it at: https://aistudio.google.com/apikey
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Database

1. **PostgreSQL** must be running locally or on a cloud service
2. **pgvector** must be enabled as an extension
3. Run migrations:
   ```bash
   bunx prisma migrate dev --name init
   bunx prisma generate
   ```

### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a free API key
3. Add it to `.env` as `GEMINI_API_KEY`

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes (REST)
│   ├── (routes)/               # Page routes
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/ui/              # Shadcn/ui components
├── features/                   # Feature modules
│   ├── chat/                   # Chat feature
│   │   ├── components/         # Chat UI components
│   │   ├── hooks/              # Chat hooks + stores
│   │   └── services/           # Chat API calls
│   ├── upload/                 # File upload feature
│   │   ├── components/         # Upload UI components
│   │   ├── hooks/              # Upload hooks
│   │   └── services/           # Upload API calls
│   └── files/                  # File management
│       ├── components/         # Document list UI
│       ├── hooks/              # Document hooks
│       └── services/           # Document API calls
├── stores/                     # Global Zustand stores
├── lib/
│   ├── prisma.ts               # Prisma singleton
│   ├── gemini.ts               # Gemini SDK client
│   ├── pdf.ts                  # PDF parsing utilities
│   ├── embedding.ts            # Embedding generation
│   ├── chunker.ts              # Text chunking for RAG
│   ├── file-cleanup.ts         # Temp file cleanup
│   ├── format.ts               # Formatting helpers
│   ├── server-polyfills.ts     # Polyfills for Vercel edge/server runtime
│   ├── upload-processor.ts     # Upload handler pipeline
│   ├── vector-search.ts        # Vector similarity search helper
│   └── utils.ts                # cn() utility
├── hooks/                      # Shared custom hooks
└── utils/                      # Pure utility functions
```

## Available Commands

```bash
# Development
bun run dev                    # Start development server

# Building
bun run build                  # Production build
bun run start                  # Start production server

# Code Quality
bun run lint                   # Check ESLint
bun run lint:fix               # Auto-fix ESLint

# Type Checking
bun x tsc --noEmit             # Check types

# Testing
bun test                       # Run all tests
bun test --watch               # Watch mode
bun test ./path/to/test.ts     # Specific test

# Database
bunx prisma migrate dev        # Create migration
bunx prisma generate           # Generate Prisma Client
bunx prisma studio             # Open Prisma Studio
bunx prisma db seed            # Run seed
```

## Limitations & Costs

- **Gemini Free Tier:** 60 requests/min, 1500 requests/day
- **Embeddings:** text-embedding-004 (768 dimensions)
- **Max PDF:** 100 pages per document (recommended)
- **Chunk Size:** 500-1000 tokens with 10-15% overlap

## License

Private - All rights reserved.
