# ReadForMe AI

## Descripción

ReadForMe AI es una aplicación web que permite a los usuarios **subir documentos PDF y chatear con su contenido** utilizando inteligencia artificial. La app procesa los documentos, extrae su texto, genera embeddings vectoriales y utiliza RAG (Retrieval-Augmented Generation) para responder preguntas basadas exclusivamente en el contenido de los documentos subidos.

## Funcionalidades Principales

- **Upload de PDFs:** Arrastrar y soltar o seleccionar archivos PDF para subir
- **Procesamiento de Documentos:** Extracción de texto, chunking inteligente con overlap
- **Chat con Documentos:** Interfaz conversacional para preguntar sobre el contenido
- **RAG Pipeline:** Búsqueda semántica de chunks relevantes antes de generar respuestas
- **Multi-Documento:** Seleccionar múltiples documentos para contexto combinado
- **Citas y Fuentes:** Respuestas con referencias a la fuente (archivo + página)
- **Historial de Chat:** Conversaciones persistentes por sesión

## Arquitectura

```
Usuario sube PDF
      ↓
Extracción de texto (pdfjs-dist)
      ↓
Chunking con overlap (500-1000 tokens)
      ↓
Generación de embeddings (Gemini text-embedding-004)
      ↓
Almacenamiento en PostgreSQL + pgvector
      ↓
─────────────────────────────────
      ↓
Usuario envía pregunta
      ↓
Embedding de la query
      ↓
Búsqueda de similitud (cosine) → Top K chunks
      ↓
Construcción de prompt con contexto
      ↓
Generación de respuesta (Gemini 1.5 Flash)
      ↓
Streaming de respuesta al chat
```

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **Runtime** | Bun | JavaScript runtime + package manager |
| **Language** | TypeScript (Strict) | Type safety total |
| **Frontend** | React 19 | UI library |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **UI Components** | Shadcn/ui | Componentes pre-construidos |
| **State (UI)** | Zustand | Client state management |
| **State (Server)** | TanStack Query | Server state + cache |
| **ORM** | Prisma 7 | Database access |
| **Database** | PostgreSQL + pgvector | Almacenamiento + vectores |
| **Embeddings** | Gemini text-embedding-004 | Generación de vectores (768d) |
| **LLM** | Gemini 1.5 Flash | Generación de respuestas |
| **PDF Parser** | pdfjs-dist | Extracción de texto |
| **Testing** | Bun Test | Unit testing |
| **Linting** | ESLint + Prettier | Code quality |

## Configuración

### Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
# Database (PostgreSQL con pgvector)
DATABASE_URL="postgresql://user:password@localhost:5432/readforme"

# Google Gemini API Key
# Obtener en: https://aistudio.google.com/apikey
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Base de Datos

1. **PostgreSQL** debe estar ejecutándose localmente o en un servicio cloud
2. **pgvector** debe estar habilitado como extensión
3. Ejecutar migraciones:
   ```bash
   bunx prisma migrate dev --name init
   bunx prisma generate
   ```

### Gemini API Key

1. Ir a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crear una API key gratuita
3. Agregarla a `.env` como `GEMINI_API_KEY`

## Estructura del Proyecto

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
│   └── documents/              # Document management
│       ├── components/         # Document list UI
│       ├── hooks/              # Document hooks
│       └── services/           # Document API calls
├── stores/                     # Global Zustand stores
├── lib/
│   ├── prisma.ts               # Prisma singleton
│   ├── gemini.ts               # Gemini SDK client
│   ├── pdf.ts                  # PDF parsing utilities
│   ├── embeddings.ts           # Embedding generation
│   └── utils.ts                # cn() utility
├── hooks/                      # Shared custom hooks
└── utils/                      # Pure utility functions
```

## Comandos Disponibles

```bash
# Desarrollo
bun run dev                    # Iniciar servidor de desarrollo

# Building
bun run build                  # Build de producción
bun run start                  # Iniciar servidor de producción

# Code Quality
bun run lint                   # Verificar ESLint
bun run lint:fix               # Auto-fix ESLint

# Type Checking
bun x tsc --noEmit             # Verificar tipos

# Testing
bun test                       # Ejecutar todos los tests
bun test --watch               # Modo watch
bun test ./path/to/test.ts     # Test específico

# Database
bunx prisma migrate dev        # Crear migración
bunx prisma generate           # Generar Prisma Client
bunx prisma studio             # Abrir Prisma Studio
bunx prisma db seed            # Ejecutar seed
```

## Limitaciones & Costos

- **Gemini Free Tier:** 60 requests/min, 1500 requests/day
- **Embeddings:**文本-embedding-004 (768 dimensiones)
- **PDF Máximo:** 100 páginas por documento (recomendado)
- **Chunk Size:** 500-1000 tokens con 10-15% overlap

## Licencia

Privado - Todos los derechos reservados.
