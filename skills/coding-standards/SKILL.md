---
name: coding-standards
description: Use when writing or reviewing code in any language. Covers typed-language rules (TypeScript, Python, Go), naming conventions, file organisation, error handling, import ordering, and universal quality rules. Read project conventions first to identify the stack, then apply only the relevant language sections.
---

# Coding Standards

> Before reviewing, read `copilot-instructions.md` / `AGENTS.md` / `CLAUDE.md` to identify the project's language, framework, and version. Adapt stack-specific rules accordingly.

## Typed Language Rules (apply only when project uses the language)

**TypeScript**
- Strict mode required — never disable `strict: true`
- No `any` without comment explaining why unavoidable
- No `@ts-ignore` without comment
- Use `unknown` + narrowing instead of `any` when type genuinely unknown
- `interface` for object shapes; `type` for unions, intersections, utilities
- All exported functions: explicit return type annotations

**Python**
- Type hints required on all function signatures (`def fn(x: int) -> str:`)
- No `# type: ignore` without explanatory comment
- Use `T | None` (Python 3.10+) or `Optional[T]` — no implicit `None` returns
- Use `dataclasses` or `pydantic` for structured data shapes

**Go**
- All errors must be checked — never discard with `_` unless intentional + commented
- Exported identifiers must have doc comments
- No `interface{}` / `any` without justification
- Prefer table-driven tests; use `errors.Is`/`errors.As` for error checking

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| UI components / classes | PascalCase | `UserCard`, `NoteEditor` |
| Utility / helper files | kebab-case | `sync-messages.ts`, `format-date.py` |
| Variables and functions | camelCase | `activeUser`, `loadData()` |
| Module-level constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Type / interface names | PascalCase | `UserSchema`, `ApiResponse` |
| Route / endpoint files | Follow framework convention | `+page.server.ts`, `router.py` |

## File Organisation

- Group by feature/domain, not by type
- One exported component per file
- Target under 400 lines per file; split larger files by concern
- Before creating a new file, check if logic fits in an existing module

## Error Handling

- Never empty `catch` blocks — re-throw, log, or return structured error
- Server errors: log with context server-side; return safe message to client (no stack traces, no internal paths)
- API routes: return appropriate HTTP status codes with structured error body
- Validate all user input at system boundaries before use

## Security (non-negotiable)

- No hardcoded secrets, credentials, or API keys — use environment variables
- Parameterized queries only — never interpolate user input into SQL/queries
- Sanitize user-controlled HTML before rendering (DOMPurify or equivalent)
- Never return stack traces or internal paths to the client

## Import Ordering

Groups separated by a blank line:
1. External packages / standard library
2. Framework internals
3. Internal path aliases
4. Relative imports

## Code Quality

- Functions under 50 lines, single responsibility
- No dead code, unused imports, or commented-out blocks in commits
- No logic repeated at 3+ call sites without extraction into a named helper
- Comment the *why*, not the *what*

## What Never to Do

- No syntax from the wrong framework version — check project conventions
- No untyped code where the language supports type annotations
- No hardcoded environment-specific values
- No deprecated APIs without a migration comment
