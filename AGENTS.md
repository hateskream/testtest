# AGENTS.md - Developer Guide for i88-frontend

This file provides guidance for AI agents working in this repository.

## Project Overview

Vue 3 + TypeScript financial dashboard application with trading widgets, charts, and market data visualization.

## Build & Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Type-check with vue-tsc and build for production
npm run preview      # Preview production build locally
npm run lint         # Run all linters concurrently (ts, js, css)
npm run lint:ts      # Type-check only (vue-tsc --noEmit)
npm run lint:js:ox   # Run oxlint for JavaScript/TypeScript
npm run lint:js:eslint # Run ESLint for .vue files
npm run lint:css     # Run Stylelint for .vue and .css files
npm run lint:fix     # Auto-fix ESLint, oxlint, and Stylelint issues
```

**Note**: There are currently no test commands configured in this project.

## Code Style Guidelines

### Formatting

- **Indentation**: Tabs
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Required
- **Max line length**: 120 characters

### Naming Conventions

- **Interfaces**: Prefix with `I` (e.g., `IUserData`, `IMarketConfig`)
- **Types**: PascalCase (e.g., `MarketData`, `TradeConfig`)
- **Enums**: PascalCase or UPPER_CASE
- **Files**: kebab-case (e.g., `use-query-data.ts`, `view-component.vue`)
- **Vue components in templates**: kebab-case (e.g., `<my-component>`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_CASE

### Vue Component Patterns

- Use Composition API with `<script setup lang="ts">`
- Use `defineModel` for two-way bindings
- Props should use typed defineProps
- Components should be registered locally when possible

### Import Order

1. External imports (node_modules)
2. Internal imports (`@/` path alias - maps to `src/`)
3. Blank line between groups
4. Vue components last in their group

Example:

```typescript
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { useHttpService } from "@/shared/service/http-service";
import { formatCurrency } from "@/shared/lib/utils";

import MyComponent from "./my-component.vue";
```

### TypeScript Rules

- `strict: true` enabled in tsconfig
- `noImplicitAny: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- Always define return types for functions
- Use `interface` for object shapes (prefix with `I`)
- Use `type` for unions, intersections, and primitives

### CSS/Styling

- CSS modules pattern: `[local]__[hash]`
- Uses LightningCSS transformer
- Stylelint enforces CSS standards

## Architecture

### Directory Structure

```
src/
├── app/           # Application entry point, router, head config
├── pages/         # Page-level Vue components (routes)
├── modules/       # Feature modules with domain-specific functionality
├── shared/        # Reusable code across modules
│   ├── composables/  # Shared Vue composables
│   ├── lib/          # Utility functions and helpers
│   ├── service/      # Core services (HttpService, query-client, event-bus)
│   └── ui/           # Reusable UI components
├── types/         # Global TypeScript type definitions
└── assets/        # Static assets (styles, icons)
```

### Module Structure Pattern

Each module in `src/modules/` typically follows:

```
module-name/
├── api/           # API calls using HttpService
├── composables/   # Vue composables (use-*.ts)
├── queries/       # TanStack Query hooks (use-query-*.ts)
├── model/         # TypeScript interfaces and types
├── store/         # Pinia stores (if needed)
├── ui/            # Vue components
└── index.ts       # Public exports
```

### Data Fetching Pattern

1. API function in `api/` folder using `useHttpService()`
2. TanStack Query hook in `queries/` folder wrapping the API call
3. Component uses the query hook

Example:

```typescript
// modules/market/api/get-data.ts
export async function getMarketData(): Promise<IMarketData> {
	const httpService = useHttpService();
	return httpService.get<IMarketData>("/api/v1/market");
}

// modules/market/queries/use-query-market-data.ts
export function useQueryMarketData() {
	return useQuery({
		queryKey: ["market-data"],
		queryFn: () => getMarketData(),
	});
}
```

## Key Technologies

- **Framework**: Vue 3 + TypeScript
- **State Management**: Pinia (global state), TanStack Query (server state)
- **HTTP Client**: `ofetch` wrapped in `HttpService` (`@/shared/service/http-service.ts`)
- **Charts**: Chart.js, Lightweight Charts, chartjs-chart-treemap
- **Routing**: Vue Router
- **Build Tool**: Vite with LightningCSS transformer

## Feature Toggles

Features are controlled via environment variables in `.env`:

- Format: `VITE_FEATURE_<FEATURE_NAME>=true|false`
- Check with: `isFeatureEnabled('FEATURE_NAME')` from `@/shared/lib`
- All features defined in `src/shared/lib/feature-toggle.ts`

## Path Aliases

- `@/` maps to `src/` (configured in tsconfig.app.json and vite.config.ts)

## Linting Configuration

This project uses multiple linters:

- **vue-tsc**: TypeScript type-checking
- **oxlint**: JavaScript/TypeScript linting
- **ESLint**: Vue-specific linting
- **Stylint**: CSS linting

All linters run via `npm run lint`. The pre-push hook runs this automatically.

## Error Handling

- Use try/catch for async operations
- Let TypeScript infer types when possible, but be explicit for function parameters and returns
- Use Zod for runtime validation of external data
- Handle API errors gracefully with user feedback

## Commit Format

Follow Conventional Commits:

- `feat: add new feature`
- `fix: resolve bug`
- `refactor: restructure code`
- `docs: update documentation`
- `chore: maintenance tasks`

## Common Development Tasks

### Creating a new module

1. Create directory structure in `src/modules/<module-name>/`
2. Add API functions in `api/`
3. Add TanStack Query hooks in `queries/`
4. Add Vue components in `ui/`
5. Export public APIs from `index.ts`

### Adding a new API endpoint

1. Create API function in appropriate module's `api/` folder
2. Use `useHttpService()` to make HTTP requests
3. Create corresponding TanStack Query hook in `queries/`
4. Use the hook in components

### Working with feature flags

1. Add feature toggle in `.env` file: `VITE_FEATURE_NEW_FEATURE=true`
2. Import and use `isFeatureEnabled('NEW_FEATURE')` from `@/shared/lib`
3. Wrap new functionality with the feature check
