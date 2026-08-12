# Agent memory vault

This vault stores durable project knowledge, not a transcript of every coding session.

- `manifest.md` is the fixed-size project overview.
- `cards/`, `decisions/`, `patterns/`, `learnings/`, and `features/` hold durable facts.
- `handoff/` may hold active continuation state.
- `sessions/`, `reviews/`, and `archive/` are cold history and are not retrieved by default.
- `_MOC.md` is a fixed-size human/Obsidian map. Agents must not load it as task context.

Retrieve context with:

```bash
node .codex/context/context.cjs query --task "<request>" --paths "<known paths>"
```

Create or update memory only when work adds a durable decision, constraint, reusable pattern, recurring gotcha, or explicit handoff. Routine fixes and facts already obvious from code need no note.
