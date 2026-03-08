# AGENTS.md - Developer Guide for i88-frontend

Vue 3 + TypeScript financial dashboard with trading widgets and market data visualization.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + build
npm run lint         # Run all linters (ts, js, css)
npm run lint:fix     # Auto-fix ESLint, oxlint, Stylelint
```

Pre-push hook runs `npm run lint`. No test commands configured.

## Architecture

`@/` maps to `src/`.

```
src/
├── app/       # Entry point, router
├── pages/     # Route-level components
├── modules/   # Feature modules (api/ composables/ queries/ model/ store/ ui/ index.ts)
├── shared/    # composables/ lib/ service/ ui/ mock/
├── types/     # Global TS types
└── assets/    # Styles, icons
```

**Data fetching**: API fn in `api/` using `useHttpService()` → TanStack Query hook in `queries/` → component.
**State**: Pinia (global), TanStack Query (server).
**HTTP**: `ofetch` via `HttpService` at `@/shared/service/http-service.ts`.
**Feature flags**: `VITE_FEATURE_<NAME>=true|false` in `.env`, check via `isFeatureEnabled('NAME')` from `@/shared/lib`.

## Code Style

- Tabs, single quotes, semicolons, max 120 chars
- Files: kebab-case; Interfaces: `I` prefix; Types: PascalCase; Constants: UPPER_CASE
- Vue components in templates: kebab-case

**MUST after any `.ts`/`.vue` edit:**

```bash
npx eslint --fix <files>
```

## Vue Patterns

- Composition API with `<script setup lang="ts">`
- `defineModel` for two-way bindings
- **Props**: always extract to named `I*Props` interface — never inline generics
- **Emits**: always extract to named `I*Emits` interface — never inline or array syntax

```typescript
interface IMyComponentProps {
	title: string;
	count?: number;
}
interface IMyComponentEmits {
	update: [value: string];
	close: [];
}
const props = defineProps<IMyComponentProps>();
const emit = defineEmits<IMyComponentEmits>();
```

## TypeScript

- `strict: true`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`
- Always define return types for functions
- `interface` for object shapes, `type` for unions/intersections/primitives
- Zod for runtime validation of external data

## Import Order

1. External (node_modules)
2. Internal (`@/`) — blank line between groups
3. Vue components last in their group

## Commits

Conventional Commits: `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`

## Documentation

Use **Context7 MCP** for Vue 3, TanStack Query, Pinia, Vite, Chart.js, ofetch, Zod — call `resolve-library-id` then `query-docs`.
