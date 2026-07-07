# COMMAND: DATABASE OPERATIONS

## 1. Tooling & Ecosystem

- **ORM:** Prisma
- **Database:** PostgreSQL with pgvector extension

## 2. Terminal Commands

- **Create migration:** `bunx prisma migrate dev --name [description]`
- **Apply migrations:** `bunx prisma migrate deploy`
- **Generate client:** `bunx prisma generate`
- **Open database UI:** `bunx prisma studio`
- **Reset database:** `bunx prisma migrate reset`
- **Run seed:** `bunx prisma db seed`

## 3. Protocol & Trigger Conditions

- **AI Trigger:** The AI MUST run `bunx prisma migrate dev` after any modification to `schema.prisma`.
- **AI Trigger:** The AI MUST run `bunx prisma generate` immediately after a migration to regenerate the Prisma Client types.
- **AI Trigger:** The AI should run `bunx prisma studio` when debugging database state.
- **Failure Protocol:** If a migration fails, the AI must analyze the error, fix the schema, and re-run the migration.
