---

## 2. Populating `.harness/skills/clean-code.md` (Restrictions & Rules)

This file sets the behavioral boundaries, programming restrictions, and testing expectations for the AI. It stops the AI from taking lazy shortcuts.

Open `.harness/skills/clean-code.md` and add the following:

```markdown
# SKILL: CODE QUALITY & ARCHITECTURAL RESTRICTIONS

## 1. Coding Style & Rules

- **Type Safety:** Explicitly type all variables, function parameters, and return types. The use of `any` is strictly FORBIDDEN. Use `unknown` or generics if dynamic typing is required.
- **Component Architecture:** Prefer functional components with explicit React interfaces for props: `interface Props {}`.
- **Pure Presentation:** UI components must remain pure. Do not hardcode API calls, business logic, or global state triggers inside `src/components/`. Use custom hooks or context injection.
- **Immutability:** State changes must always be immutable. Do not mutate objects or arrays directly.

## 2. Permissions & AI Boundaries

- **Destructive Changes:** The AI is NOT allowed to delete or refactor core architectural files without explicit user consent.
- **Package Installation:** The AI cannot install external npm/bun packages autonomously. If a library is needed, it must suggest it to the user first.
- **Stubbing / Placeholders:** NEVER write placeholder code like `// TODO: Implement later` or leave functions empty. All generated code must be fully functional and ready for production.

## 3. Definition of Done (DoD)

A task is only considered complete by the AI when:

1. The code compiles without TypeScript warnings (`bun x tsc --noEmit` passes).
2. Code matches the exact naming conventions defined in `MEMORY.md`.
3. Basic unit tests are created or updated using Bun's native test runner if logic was introduced.
```
