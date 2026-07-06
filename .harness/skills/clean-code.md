# SKILL: CODE QUALITY & ARCHITECTURAL RESTRICTIONS

## 1. Strict Type-Safety

- **No Any Allowed:** The use of `any` is strictly FORBIDDEN in this codebase. If a type is unknown or dynamic, utilize generics (`<T>`), explicit unions, or `unknown`.
- **Contract Enforcement:** Every function parameter, object structure, and API response payload must have an explicitly declared TypeScript type or interface.

## 2. Refactoring & Modular Rules

- **Single Responsibility Principle (SRP):** Functions and hooks must perform exactly one action. If a function or component extends past 30-40 lines of execution logic, it must be modularized or broken down into sub-utilities.
- **Error Handling Guard:** All asynchronous processes, storage mutations, or API calls must be wrapped in strict `try/catch` blocks with explicit error logging or safe user feedback fallbacks.

## 3. Production Readiness (No Stubs)

- **Completeness:** The AI must NEVER output placeholders, code stubs, or comments like `// TODO: Implement later`. All logic generated must be fully production-ready, logical, and operational.
