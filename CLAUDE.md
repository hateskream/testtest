# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Type-check with vue-tsc and build for production
npm run preview      # Preview production build locally

npm run lint         # Run all linters concurrently (ts, js, css)
npm run lint:ts      # Type-check only (vue-tsc --noEmit)
npm run lint:js      # ESLint for .js,.jsx,.ts,.tsx,.vue,.cjs,.mjs
npm run lint:css     # Stylelint for .vue and .css files
npm run lint:fix     # Auto-fix ESLint and Stylelint issues
```

The pre-push hook runs `npm run lint` automatically.

## Architecture Overview

This is a Vue 3 + TypeScript financial dashboard application with trading widgets, charts, and market data visualization.

### Source Structure (`src/`)

- **app/** - Application entry point, router setup, and head configuration
- **pages/** - Page-level Vue components (routes)
- **modules/** - Feature modules containing domain-specific functionality
- **shared/** - Reusable code across modules
- **types/** - Global TypeScript type definitions
- **assets/** - Static assets (styles, icons)

### Module Structure Pattern

Each module in `src/modules/` typically follows this structure:
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

### Shared Directory (`src/shared/`)

- **composables/** - Shared Vue composables
- **lib/** - Utility functions and helpers
- **service/** - Core services (HttpService, query-client, event-bus, logger, real-time)
- **ui/** - Reusable UI components
- **mock/** - Mock data utilities for development

### Key Technologies

- **State Management**: Pinia for global state, TanStack Query for server state
- **HTTP Client**: `ofetch` wrapped in `HttpService` (`@/shared/service/http-service.ts`)
- **Charts**: Chart.js, Lightweight Charts, chartjs-chart-treemap
- **Styling**: CSS with LightningCSS transformer, CSS modules pattern `[local]__[hash]`
- **Routing**: Vue Router with feature-flag-based route guards

### Data Fetching Pattern

API calls follow this pattern:
1. API function in `api/` folder using `useHttpService()`
2. TanStack Query hook in `queries/` folder wrapping the API call
3. Component uses the query hook

Example:
```typescript
// api/get-data.ts
export async function getData(): Promise<IData> {
  const httpService = useHttpService();
  return httpService.get<IData>('/api/v1/endpoint');
}

// queries/use-query-data.ts
export function useQueryData() {
  return useQuery({
    queryKey: ['data-key'],
    queryFn: () => getData(),
  });
}
```

### Feature Toggles

Features are controlled via environment variables in `.env`:
- Format: `VITE_FEATURE_<FEATURE_NAME> = true|false`
- Check with: `isFeatureEnabled('FEATURE_NAME')` from `@/shared/lib`
- All features defined in `src/shared/lib/feature-toggle.ts`

### Path Aliases

- `@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`)

## Code Style

- **Indentation**: Tabs
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Max line length**: 120 characters
- **Interface naming**: Prefix with `I` (e.g., `IUserData`)
- **Vue components in templates**: kebab-case (e.g., `<my-component>`)
- **File naming**: kebab-case with dots for type (e.g., `use-query-data.ts`, `view-component.vue`)

### Import Order

External imports first, then internal imports separated by a blank line. Vue components should be last in their group.

### Vue Component Props & Emits

- **defineProps**: Always extract the type into a named interface prefixed with `I` and suffixed with `Props` (e.g., `IMyComponentProps`). Never use inline generics like `defineProps<{ ... }>()`.
- **defineEmits**: Always extract the type into a named interface prefixed with `I` and suffixed with `Emits` (e.g., `IMyComponentEmits`). Never use inline generics or array syntax.

```typescript
interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
	isActive?: boolean;
}

interface IWidgetComponentEmits {
	select: [id: string];
}

const props = defineProps<IWidgetComponentProps>();
const emit = defineEmits<IWidgetComponentEmits>();
```

### Code Style Enforcement Workflow

After creating or modifying any `.ts`, `.tsx`, or `.vue` file, you **MUST** run ESLint auto-fix on the changed files before considering the task done:

```bash
npx eslint --fix <file1> <file2> ...
```

This ensures all stylistic rules (`@stylistic/quotes`, `@stylistic/indent`, `@stylistic/semi`, etc.) are automatically applied. Do **NOT** rely on manually writing correct formatting — always let the linter enforce it.

### Conventions

- commit format: Conventional Commits
- style: eslint (configs in eslint.config.js)
