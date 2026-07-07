# SKILL: SHADCN/UI COMPONENT PATTERNS

## 1. Installation & Setup

- Install components via `bunx shadcn@latest add [component-name]` (e.g., `bunx shadcn@latest add button`).
- Components are installed into `src/components/ui/` by default.
- Theme is configured in `src/app/globals.css` via CSS variables.

## 2. Component Composition

- Prefer composition over configuration. Combine small shadcn primitives to build complex UIs.
- Extend shadcn components using the `cn()` utility from `src/lib/utils.ts` (uses `clsx` + `tailwind-merge`).
- Never modify installed component files directly. Extend them via wrapper components when customization is needed.

## 3. Variants

- Use the `cva` (Class Variance Authority) pattern for component variants, as shadcn components do.
- Define variants as explicit TypeScript union types.
- Example: `variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"`

## 4. Responsive & Accessible

- Shadcn components are built with Radix UI primitives — they handle keyboard navigation, focus management, and ARIA attributes out of the box.
- Do not override accessibility attributes unless absolutely necessary.
- Wrap shadcn components inside feature components for business logic, never inject logic directly into the ui component.
