---
description: Review current changes using git diff
agent: reviewer
subtask: true
---

Review the current uncommitted changes in this project.

Here are the staged changes:
!`git diff --cached 2>&1`

Here are the unstaged changes:
!`git diff 2>&1`

Here are untracked files:
!`git status --short 2>&1`

Perform a thorough code review following the project's conventions:

1. Check TypeScript types and interfaces (prefix `I`)
2. Verify Vue 3 patterns: `<script setup>`, `defineModel()`, typed props/emits
3. Check data fetching pattern: api/ -> queries/ -> component
4. Verify import order: external, then internal (`@/`), blank line between
5. Check code style: tabs, single quotes, semicolons, 120 char max
6. Look for security issues (XSS, data exposure, hardcoded secrets)
7. Check for performance issues (unnecessary re-renders, missing computed)

Provide structured feedback with severity levels (Critical, Warning, Suggestion).
