---
status: completed
created: 2026-07-13
---

# Spec: feat/002-layout-providers

## 1. Overview

Set up the application shell with global providers (QueryClientProvider, ThemeProvider, Toaster) and a responsive layout structure with sidebar navigation and main content area. This feature establishes the foundation for all subsequent features.

## 2. Acceptance Criteria

- [ ] Providers wrapped: QueryClientProvider (TanStack Query), ThemeProvider (next-themes), Toaster (sonner)
- [ ] Layout structure: Sidebar (fixed 256px) + Main area (flex-1)
- [ ] Responsive design: Sidebar hidden on mobile (< md breakpoint), hamburger menu toggle
- [ ] Metadata updated: Title "ReadForMe AI", description for the app
- [ ] Homepage replaced: Remove default Next.js starter, show empty app shell
- [ ] Theme configured: shadcn CSS variables for light/dark mode
- [ ] Lint passes: `bun run lint`
- [ ] Type check passes: `bun x tsc --noEmit`

## 3. Architecture (Architect)

### Types & Interfaces

No custom types required for this feature. Uses existing library types:
- `QueryClient` from `@tanstack/react-query`
- `ThemeProviderProps` from `next-themes`

### Data Models

No database models required for this feature.

### File Structure

```
src/
├── components/
│   └── providers/
│       └── index.tsx          # Providers wrapper component
├── app/
│   ├── layout.tsx             # MODIFIED: wrap with Providers
│   ├── page.tsx               # MODIFIED: app shell layout
│   └── globals.css            # MODIFIED: shadcn theme variables
```

## 4. UI Design (UI Expert)

### Layout

```
┌─────────────────────────────────────────────────┐
│ <Providers>                                      │
│  ┌────────────┬──────────────────────────────────┐│
│  │            │                                  ││
│  │  Sidebar   │         Main Area                ││
│  │  (256px)   │        (flex-1)                  ││
│  │            │                                  ││
│  │  ┌──────┐  │   ┌──────────────────────────┐   ││
│  │  │ Logo │  │   │                          │   ││
│  │  └──────┘  │   │   <Content />            │   ││
│  │            │   │                          │   ││
│  │  ────────  │   └──────────────────────────┘   ││
│  │            │                                  ││
│  │  Nav Items │                                  ││
│  │            │                                  ││
│  └────────────┴──────────────────────────────────┘│
│ </Providers>                                      │
└─────────────────────────────────────────────────┘
```

### Components

- **Providers** (`src/components/providers/index.tsx`): Wraps children with QueryClientProvider, ThemeProvider, and Toaster
- **Sidebar**: Fixed left sidebar with logo and navigation (hidden on mobile)
- **Main content area**: Scrollable flex-1 area for page content

### Responsive Behavior

- **Desktop (>= md)**: Sidebar visible (256px), main area fills remaining space
- **Mobile (< md)**: Sidebar hidden, hamburger menu icon in top-left to toggle sidebar

## 5. Implementation Notes

1. **Providers setup**: Create `src/components/providers/index.tsx` that wraps children with all three providers
2. **Layout modification**: Update `src/app/layout.tsx` to import and use the Providers component
3. **Homepage replacement**: Replace `src/app/page.tsx` content with the app shell layout
4. **Theme configuration**: Ensure `globals.css` has proper shadcn CSS variables for light/dark mode
5. **Sidebar component**: Can be a simple div for now, will be enhanced in future features
6. **Responsive toggle**: Use React state to manage sidebar visibility on mobile
7. **No navigation links yet**: Sidebar will show logo and placeholder nav items

## 6. Verification

```bash
bun run lint          # Code style check
bun x tsc --noEmit    # Type safety check
```

## 7. Dependencies

- `next-themes`: Already installed
- `@tanstack/react-query`: Already installed
- `sonner`: Already installed
- `lucide-react`: Already installed (for hamburger icon)
