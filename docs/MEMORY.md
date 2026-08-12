# Memory design

Memory is tiered by retrieval value:

| Tier | Content | Default behavior |
|---|---|---|
| L0 | `memory/manifest.md` | Small, fixed-size project overview |
| L1 | Cards, decisions, patterns, learnings, features | Indexed and ranked |
| L2 | Referenced source, ADR detail, active handoffs | Read when selected or followed |
| L3 | Sessions, reviews, archive, `_MOC.md` | Cold; excluded by default |

## Durable write gate

Write memory only if at least one is true:

- A new architecture or product decision was made.
- A cross-cutting constraint is not obvious from code.
- A reusable project-specific pattern was verified.
- A recurring non-obvious failure mode was established.
- Another session needs unfinished state not captured elsewhere.

Do not write memory for routine fixes, formatting, ordinary dependency updates, facts visible in source, or completed work already captured by a commit, issue, plan, test, or diff.

## Card metadata

```yaml
id: DEC-014
kind: decision
status: active
summary: Public sessions use opaque server-side tokens.
tags: [auth, session]
paths: [src/auth/**]
symbols: [validateSession]
last_verified_commit: abc1234
supersedes: []
```

Keep the body concise and evidence-backed. Use `supersedes` instead of retaining conflicting active truth.

## Source breadcrumbs

Rare non-obvious implementation ceilings may use:

```ts
// arche: limit=global-lock; revisit=measured-contention; memory=DEC-014
```

These comments are not general documentation. `context.cjs harvest` collects them, and `query` can rank them against a task. Ordinary code should remain free of agent-only commentary.

The generated index lives in the OS temporary directory. Markdown memory changes refresh automatically; run `index --refresh` after adding or changing a source breadcrumb.

## Human navigation

`_MOC.md` is deliberately fixed-size. It links memory areas, not every record. This preserves Obsidian navigation without forcing the model to scan a growing table of contents.
