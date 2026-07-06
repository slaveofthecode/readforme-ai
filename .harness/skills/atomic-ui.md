# SKILL: ATOMIC UI & RESPONSIVE DESIGN PRINCIPLES

## 1. Mobile-First Responsive Design

- **Core Rule:** All UI layouts and components MUST be designed using Tailwind CSS following a strict **Mobile-First** approach.
- **Implementation:** Write base utility classes for mobile devices first, and then scale up to larger screens using Tailwind responsive modifiers (e.g., `md:`, `lg:`, `xl:`).
- **Verification:** Before delivering a UI component, mentally verify that layout grids, flexboxes, margins, and paddings look completely unbroken on small smartphone viewports.

## 2. UI Component Isolation (Purity)

- **Shared Components:** Components inside `src/components/` (Buttons, Inputs, Modals) must remain completely pure and generic. They must rely exclusively on incoming `props` and TypeScript interfaces.
- **Zero Business Logic:** Never inject API fetching, global context triggers (like state dispatchers), or specific route navigation inside shared presentation components.
- **Tailwind Extensions:** Utilize robust utility classes or tools like `clsx` or `tailwind-merge` if dynamic style variations (variants) are required based on props.
