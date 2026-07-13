---
status: draft
created: YYYY-MM-DD
---

# Spec: feat/NNN-feature-name

## 1. Overview

[Qué hace esta feature y por qué existe. Máximo 2-3 oraciones.]

## 2. Acceptance Criteria

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## 3. Architecture (Architect)

### Types & Interfaces

```typescript
// TypeScript types y interfaces requeridas
```

### Data Models

```prisma
// Prisma schema si aplica (modelos, relaciones, índices)
```

### File Structure

```
src/
├── feature/
│   ├── components/     # Componentes UI
│   ├── hooks/          # Hooks personalizados
│   └── services/       # Llamadas a API
```

## 4. UI Design (UI Expert)

### Layout

```
[Descripción visual del layout usando ASCII art]
```

### Components

- Componente 1: [descripción]
- Componente 2: [descripción]

## 5. Implementation Notes

[Detalles de implementación, consideraciones técnicas, dependencias.]

## 6. Verification

```bash
bun run lint
bun x tsc --noEmit
bun test
```
