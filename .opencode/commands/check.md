---
description: Full project check - lint + build with analysis
agent: build
---

Run a full project check: lint and build.

Step 1 - Lint:
!`npm run lint 2>&1`

Step 2 - Build:
!`npm run build 2>&1`

Analyze the combined results:

1. Report any type errors from vue-tsc
2. Report any lint errors (ESLint, oxlint, Stylelint)
3. Report any build errors from Vite
4. If everything passes, confirm the project is in good shape
5. If there are failures, prioritize fixes: build-breaking errors first, then type errors, then lint issues
