---
description: Create a new module structure from template
agent: build
---

Create a new module named `$ARGUMENTS` in `src/modules/`.

Follow the project's module structure pattern exactly:

```
src/modules/$ARGUMENTS/
├── api/              # API calls using HttpService
├── composables/      # Vue composables (use-*.ts)
├── queries/          # TanStack Query hooks (use-query-*.ts)
├── model/            # TypeScript interfaces and types
├── ui/               # Vue components
└── index.ts          # Public exports
```

Requirements:

1. Create all directories listed above
2. Create an `index.ts` that re-exports the public API
3. Create a placeholder `model/types.ts` with a base interface prefixed with `I`
4. Use kebab-case for the module directory name
5. Follow the project's code style: tabs, single quotes, semicolons
6. Do NOT create a `store/` directory unless explicitly needed (Pinia is optional)

After creation, confirm the structure and suggest next steps (e.g., "Now create your API functions in api/").
