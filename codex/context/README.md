# Context compiler

This deterministic helper keeps broad project history out of the model context.

```bash
node .codex/context/context.cjs index
node .codex/context/context.cjs query --task "fix session expiry" --paths "src/auth/session.ts"
node .codex/context/context.cjs check
node .codex/context/context.cjs harvest
```

`query` returns at most six ranked snippets within a configurable token estimate. It searches durable memory and project instruction documents. Raw session history, reviews, archives, templates, `_MOC.md`, dependencies, and build output stay cold by default.

The generated index is stored in the OS temporary directory, so retrieval does not dirty the repository or require writes inside `.codex/`. Markdown changes refresh automatically; use `index --refresh` after changing a source breadcrumb.

Use rare `arche:` source comments only for non-obvious deliberate constraints:

```ts
// arche: limit=global-lock; revisit=measured-contention; memory=DEC-014
```

Run `index --refresh` after adding or changing a breadcrumb.
