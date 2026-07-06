# PROJECT MEMORY

## 1. Tech Stack & Environment

- **Runtime & Package Manager:** Bun (Natively executing TypeScript)
- **Frontend Framework:** React with TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Component Library:** Shadcn/ui (Tailwind-based)
- **Testing Framework:** Bun Test (`bun test` native runner)
- **Environment:** Modern Web Ecosystem with strict Mobile-First Responsive Design

## 2. Repository & Architecture Standards

### Naming Conventions

- **Directories/Folders:** `kebab-case` (e.g., `components/auth-form/`)
- **React Components:** `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- **Hooks/Utilities/Files:** `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`)
- **Styles/Assets:** `kebab-case` (e.g., `main-logo.png`)

### Git Branching Strategy (Feature-Driven)

- `main` -> Production ready, stable code. No direct commits allowed.
- `development` -> Integration branch for features.
- `feat/[feature-name]` -> Atomic feature branches (e.g., `feat/login-validation`).
- `bug/[bug-name]` -> Hotfixes or bug resolutions.

## 3. Directory Structure Map (Feature-Driven Template)

```text
src/
├── assets/          # Global static assets (images, fonts, global icons)
├── components/      # Shared global atomic UI components (Button, Input, Modal)
├── features/        # Modular domain-driven features (e.g., auth, dashboard, checkout)
│   └── [feature-name]/
│       ├── components/  # Components exclusive to this feature
│       ├── hooks/       # React hooks exclusive to this feature
│       └── services/    # API calls and data fetching for this feature
├── hooks/           # Global reusable React hooks
├── utils/           # Global pure utility functions (formatting, math, localstorage)
└── main.tsx         # Application entry point
```

## 4. Active Tasks & Progress

- [x] Create core structure and directory layout (`.harness/`)
- [x] Configure global state management contract (`MEMORY.md`)
- [x] Program the central nervous system (`AGENT.md`)
- [x] Configure execution verification protocols (`.harness/commands/`)
- [x] Establish coding quality standards and constraints (`.harness/skills/`)
- [x] Define atomic sub-agent behavior profiles (`.harness/agents/`)
