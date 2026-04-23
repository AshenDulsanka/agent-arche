---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

TypeScript strict mode is required. These rules apply to every `.ts` and `.tsx` file.

## Types
- No `any` without an explanatory comment justifying why it's unavoidable
- No `@ts-ignore` without an explanatory comment
- All exported functions must have explicit return type annotations
- Prefer `type` for object shapes; use `interface` only when extension via `extends` is needed
- Use `unknown` instead of `any` when the type is genuinely not known — then narrow it

## Naming
- Variables and functions: `camelCase`
- Types and interfaces: `PascalCase`
- Module-level constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts` for utilities, `PascalCase.ts` for class/type definitions

## Functions
- Maximum 50 lines per function — extract helpers if exceeded
- Single responsibility — one function does one thing
- Pure functions preferred — avoid side effects unless necessary
- No deeply nested callbacks (max 3 levels)

## Imports
Order imports in this sequence, each group separated by a blank line:
1. External packages (`import ... from 'package'`)
2. Framework imports (`import ... from 'sveltekit'` / `'next'` / etc.)
3. Internal aliases (`import ... from '$lib/...'`)
4. Relative imports (`import ... from './...'`)

## Error Handling
- Never use empty `catch` blocks — at minimum log the error
- Use typed errors — `catch (error: unknown)` then narrow with `instanceof`
- Fail fast with descriptive messages at system boundaries
- Validate all external input before use — never trust API responses, user input, or file content

## Security (API boundaries)
- Validate all user input before processing
- Never pass raw input to file paths, SQL queries, shell commands, or HTML templates
- Use parameterized queries — never string-interpolate into SQL
- Sanitize before rendering dynamic content as HTML
