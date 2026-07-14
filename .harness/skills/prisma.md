# SKILL: PRISMA ORM & DATABASE DESIGN

## 1. Schema Design

- Define models in `schema.prisma` with proper relations (one-to-many, many-to-many).
- Use `@id` with `uuid()` or `autoincrement()` for primary keys.
- Use `@unique` for fields that must be unique.
- Use `@@index()` for frequently queried fields.
- Use `@@map()` and `@map()` for table/column naming (snake_case in DB, camelCase in Prisma).

## 2. Migrations

- Run `bunx prisma migrate dev --name [description]` to create and apply migrations in development.
- Run `bunx prisma generate` after schema changes to regenerate the Prisma Client.
- Never edit migration files manually. Create a new migration instead.

## 3. Soft Delete

- Add a `deletedAt DateTime?` field to models that need soft delete.
- Add `@@where("@deletedAt(null)")` or filter manually in queries.
- Do not use cascading deletes for soft-deleted records.

## 4. pgvector Setup

- Add the `pgvector` extension to PostgreSQL: run `CREATE EXTENSION vector;` as a migration.
- Use `Unsupported("vector")` type in Prisma schema for embedding columns, or use raw SQL queries for vector operations.
- Create HNSW indexes on vector columns for fast similarity search.

## 5. Connection Management

- Use a singleton pattern for the Prisma client in Next.js to prevent connection pooling issues in serverless environments.
- Extend the global object in development to avoid hot-reload connection exhaustion:

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```
