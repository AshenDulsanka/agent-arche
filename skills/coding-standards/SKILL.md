---
name: coding-standards
description: Use when writing or reviewing TypeScript, Svelte 5 components, or API routes. Covers strict mode requirements, rune syntax ($state, $derived, $effect, $props), naming conventions, file organisation, error handling, import ordering, load() function patterns, and what never to do.
---

# Coding Standards

> **Stack note:** These standards target SvelteKit + Svelte 5 + TypeScript as the default stack. Adapt the Svelte-specific sections when working with a different framework.

This document defines the coding conventions for SvelteKit + Svelte 5 + TypeScript projects. All contributors and AI agents must follow these standards.

## TypeScript

- **Strict mode is required** — `tsconfig.json` enables `strict: true`. Never disable it.
- **No `any` types** without a comment explaining exactly why it is unavoidable.
- **No `@ts-ignore`** unless absolutely necessary, always paired with a comment.
- Use `unknown` instead of `any` when the type is genuinely unknown — then narrow it.
- Prefer `interface` for object shapes that describe data structures.
- Prefer `type` for unions, intersections, and utility types.
- All exported functions must have explicit return type annotations.
- All component props must be typed — no untyped `export let`.

## Svelte 5

- **Use runes only**: `$state`, `$derived`, `$effect`, `$props`, `$bindable`.
- **No Svelte 4 syntax**: `$:` reactive declarations, `let:` slot bindings, `on:event` directives are all forbidden.
- Event handlers use the Svelte 5 `onclick`, `oninput`, `onkeydown` syntax.
- Use `$props()` for component props:
  ```svelte
  <script lang="ts">
    const { label, onClick }: { label: string; onClick: () => void } = $props();
  </script>
  ```
- Avoid deeply nested `$effect` — prefer `$derived` for computed values.

## Svelte File Structure

Every `.svelte` file must follow this exact order — no exceptions:

1. `<script lang="ts">` block
2. Markup (HTML template)
3. `<style>` block (if needed)

```svelte
<script lang="ts">
  // imports, state, logic
</script>

<div class="...">
  <!-- markup -->
</div>

<style>
  /* component-scoped styles */
</style>
```

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| `.svelte` components | PascalCase | `FileTree.svelte`, `SyncButton.svelte` |
| `.ts` utilities and helpers | kebab-case | `sync-messages.ts`, `safe-path.ts` |
| `.ts` type files | kebab-case | `types.ts` |
| SvelteKit route files | SvelteKit convention | `+page.svelte`, `+page.server.ts`, `+server.ts` |
| CSS classes | Tailwind utility classes — no custom class names unless necessary |
| Variables and functions | camelCase | `activeWorkspace`, `loadTree()` |
| Constants | UPPER_SNAKE_CASE for module-level constants | `MAX_SEARCH_RESULTS` |
| TypeScript interfaces | PascalCase | `Workspace`, `FileNode` |

## File and Folder Organisation

- `src/lib/components/` — Svelte UI components, grouped by domain subdirectory
- `src/lib/server/` — server-side only code (database, migrations, file I/O, AI)
- `src/lib/data/` — static data and constants used across the app
- `src/routes/` — SvelteKit routes; API endpoints under `src/routes/api/`
- One component per file — never put two exported components in the same `.svelte` file

## SvelteKit Route Files

| File | When to use |
|------|-------------|
| `+page.server.ts` | Server-only data loading — DB calls, secrets, authentication. Data is serialised and sent to the client. |
| `+page.ts` | Universal load — runs on server at first load, on client for navigations. Use when data can be public and does not need secrets. |
| `+server.ts` | API endpoints — returns `Response` or uses SvelteKit helpers (`json`, `error`). Used for AJAX calls from the client. |

If the choice is non-obvious, add a comment at the top of the file explaining why that route type was chosen.

## Import Ordering

Imports must be ordered as follows, separated by blank lines:

1. External packages (npm dependencies)
2. SvelteKit internals (`$app/navigation`, `$app/environment`, etc.)
3. Internal `$lib` aliases (`$lib/types`, `$lib/server/database`, etc.)
4. Relative imports (`../component.svelte`, `./utils.ts`)

```typescript
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { getDb } from '$lib/server/database';
import type { Workspace } from '$lib/types';
```

## Error Handling

- **No silent catches** — every `catch` block must either re-throw, log, or return a structured error response.
- In `+page.server.ts` and `+page.ts` load functions, use SvelteKit's `error()` and `redirect()` helpers. Never construct manual `Response` objects in load functions.
- In `+server.ts` API routes, return appropriate HTTP status codes (`400`, `404`, `500`) with a JSON body: `{ error: string }`.
- All server errors must be logged with enough context to reproduce the issue.

```typescript
// Correct
} catch (err) {
  console.error('Failed to read note:', err);
  return error(500, 'Failed to read note');
}

// Wrong
} catch (_) {}
```

## `load()` Function Patterns

- Always annotate the return type.
- Always handle errors explicitly — never let load return `undefined` silently.
- Never return raw database objects — map them to typed interfaces first.

```typescript
export const load: PageServerLoad = async ({ params, locals }) => {
  const module = locals.db.prepare('SELECT * FROM modules WHERE id = ?').get(params.id);
  if (!module) error(404, 'Module not found');
  return { module: module as Module };
};
```

## Async Patterns

- Prefer `async/await` over `.then()` chains everywhere.
- Avoid nested `async` functions where a top-level `await` suffices.

## Svelte State: Store vs Local

- `$state` (local runes) — use for state that belongs to a single component or its direct children.
- Svelte stores (`writable`, `readable`, `derived`) — use only for state shared across multiple components that are not in a parent-child relationship.
- Do not create a store just to avoid prop drilling — if only two levels deep, props are cleaner.

## Comments

- Comments explain **why** something is done, not **what** the code does.
- Code that requires a comment to understand **what** it does should be refactored for clarity instead.
- Exception: complex regex, non-obvious algorithms, and security-critical validation logic may have a brief **what** comment.
- All `@ts-ignore` and `any` usages must have a comment explaining the reason.

## Function Length and Responsibility

- Target under 50 lines per function.
- A function should do one thing. If it needs a multi-clause name ("load and validate"), split it.
- Extract repeated logic into named helpers — but only after it appears at least twice.

## What Never to Do

- Do not install React, Vue, Angular, or Radix UI packages.
- Do not write `.js` files where `.ts` files should exist.
- Do not use Svelte 4 syntax anywhere.
- Do not hardcode file paths — always use environment variables with documented fallbacks.
- Do not commit `.env` files, `data/*.db`, or anything in `data/screenshots/`.
- Do not leave dead code, unused imports, or commented-out blocks in commits.
