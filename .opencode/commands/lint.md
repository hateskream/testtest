---
description: Run all linters and analyze errors
agent: build
---

Run `npm run lint` to execute all linters (vue-tsc, oxlint, ESLint, Stylelint).

Here are the lint results:
!`npm run lint 2>&1`

Analyze the output and:

1. Group errors by category (TypeScript, ESLint, Stylelint)
2. For each error, explain what's wrong and suggest a fix
3. If there are auto-fixable issues, mention that `npm run lint:fix` can resolve them
4. Prioritize: type errors first, then lint errors, then style issues
