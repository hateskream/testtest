---
name: new-module
description: Create a complete new feature module in src/modules/. Use when building a new domain feature (not a widget).
disable-model-invocation: true
---

# Creating a New Module

Modules live in `src/modules/<module-name>/` and encapsulate a domain feature.

## Steps

1. Create the directory structure:

```
src/modules/<module-name>/
├── api/
│   ├── get-<resource>.ts
│   └── index.ts
├── composables/
│   ├── use-<name>.ts
│   └── index.ts
├── model/
│   ├── index.ts
│   └── <name>.ts          # Domain interfaces
├── queries/
│   ├── use-query-<name>.ts
│   └── index.ts
├── ui/
│   └── <component>.vue
└── index.ts               # Public API — only export what consumers need
```

2. Follow the api-layer skill for API functions
3. Follow the query-layer skill for TanStack Query hooks
4. Model interfaces: use `I` prefix, keep in `model/`
5. `index.ts` — only export what other modules need, keep internals private

## Key rules

- Module communicates with the outside world only via `index.ts`
- No cross-module imports except through `index.ts` public API
- Server state (API data) goes in TanStack Query, not Pinia
- After creating files: `npx eslint --fix <files>`
