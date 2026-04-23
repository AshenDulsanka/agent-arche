---
description: Review the selected code against project coding standards. Checks Svelte 5 rune syntax, TypeScript strict compliance, naming conventions, error handling, import ordering, and function quality. References .github/skills/coding-standards/SKILL.md.
---

Review the following code against the project's coding standards.

Read `.github/skills/coding-standards/SKILL.md` first to understand the full rules, then check each category below.

## Review Checklist

### Svelte 5 Runes
- No `$:` reactive declarations (use `$derived` or `$effect`)
- No `on:event` directives (use `onclick`, `oninput`, etc.)
- Props declared with `$props()` — not `export let`
- No Svelte 4 lifecycle functions (`onMount` without import, etc.)

### TypeScript
- No `any` without an explanatory comment
- No `@ts-ignore` without an explanatory comment
- All exported functions have explicit return type annotations
- No implicit `any` from missing generics

### Naming
- `.svelte` files: PascalCase
- Variables and functions: camelCase
- Module-level constants: UPPER_SNAKE_CASE
- TypeScript interfaces: PascalCase

### File Structure
- `.svelte` file order: `<script>` → markup → `<style>`

### Import Ordering
- External packages first, then SvelteKit, then `$lib`, then relative — each group separated by a blank line

### Error Handling
- No empty catch blocks
- API routes return `json({ error: string }, { status: N })`
- Load functions use `error()` from `@sveltejs/kit`

### Function Quality
- Under 50 lines per function
- Single responsibility per function

## Output

List each issue found with:
- **Severity**: Critical / High / Medium / Low
- **File and line**: Where the issue is
- **Rule violated**: Which rule from coding-standards/SKILL.md
- **Fix**: How to correct it

End with: Pass / Needs Work / Fail and a count of issues per severity.
