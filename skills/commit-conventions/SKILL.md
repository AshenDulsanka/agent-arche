---
name: commit-conventions
description: Use when writing or reviewing commit messages. Covers type prefixes (feat, fix, docs, chore, ci), scope list, subject line rules (imperative mood, 72 chars max, no period), breaking changes with ! or BREAKING CHANGE footer, body/footer format, and good/bad examples.
---

# Commit Message Conventions

All commits in this repository must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

## Type Prefixes

| Type | Description | Example |
|------|-------------|---------|
| `feat` | A new user-facing feature | `feat(ui): add dark mode toggle to header` |
| `fix` | A bug fix | `fix(auth): handle expired session tokens correctly` |
| `docs` | Documentation changes only | `docs(readme): add Docker setup instructions` |
| `style` | Formatting, whitespace, missing semicolons — no logic change | `style(components): reformat button spacing` |
| `refactor` | Code change that is neither a fix nor a feature | `refactor(api): extract validation logic to shared helper` |
| `perf` | Performance improvement | `perf(db): add index on users.email column` |
| `test` | Adding or correcting tests | `test(api): add user creation endpoint tests` |
| `chore` | Build process, dependency updates, tooling | `chore(deps): update sveltekit to v2.17` |
| `ci` | CI/CD pipeline configuration | `ci: add type-check step to pull request workflow` |
| `revert` | Reverts a previous commit | `revert: feat(auth): revert oauth provider change` |

## Scopes

Use one of the following scopes when the commit is contained to a specific area:

| Scope | Area |
|-------|------|
| `ui` | Client-side UI components and layouts |
| `api` | Server-side API routes and handlers |
| `auth` | Authentication and authorisation |
| `db` | Database schema, migrations, queries |
| `config` | Application configuration files |
| `docs` | Project documentation (use with `docs` type) |
| `deps` | Dependency updates (use with `chore` type) |
| `ci` | CI/CD pipeline (use with `ci` type) |
| `tests` | Test files and test utilities |
| `schema` | Data validation schemas (Zod, JSON Schema, etc.) |
| `infra` | Infrastructure config (Docker, hosting, env) |
| `build` | Build tooling (Vite, webpack, esbuild, etc.) |

Scope is optional but recommended for non-trivial commits.

## Subject Line Rules

- Maximum **72 characters**
- Use **imperative mood**: "add", "fix", "remove" — not "added", "fixes", "removes"
- **No period** at the end
- **No capitalisation** of the first letter after the colon

Examples:
- `feat(sync): add git push on sync button click` — correct
- `feat(Sync): Added git push on sync button click.` — wrong (capital, past tense, period)

## Breaking Changes

For breaking changes, add `!` after the type/scope, or add a `BREAKING CHANGE:` footer:

```
feat(db)!: rename notes_folder column to workspace_folder

BREAKING CHANGE: existing databases must be migrated manually
```

Both forms are valid. The `!` form is more visible at a glance.

## Body

Use a body when the subject line alone does not fully convey the change. Wrap at 72 characters. Explain *what changed and why*, not *how*.

```
fix(sidebar): scope pinned notes to active workspace

Pinned notes were stored in a single global localStorage key, meaning
notes pinned in one workspace appeared in all workspaces. This changes
storage to a workspace-keyed object so each workspace has its own
pinned list.
```

## Footer

Use footers for:
- Breaking change descriptions: `BREAKING CHANGE: ...`
- Issue references: `Closes #42`, `Fixes #17`, `Refs #55`

## Examples

### Good Commits

```
feat(workspace): add modal to select CTF vs general workspace type
```
```
fix(sync): run wal_checkpoint before git add to flush SQLite WAL data
```
```
docs(contributing): add PR standards and branch naming reference
```
```
chore(deps): bump better-sqlite3 to 11.8.0
```
```
refactor(api): extract path validation into shared safePath utility
```
```
perf(editor): lazy-load milkdown plugins on first editor focus
```

### Bad Commits

```
fixed stuff
```
```
WIP
```
```
Update files
```
```
feat: Added the new thing I was working on and also fixed a bug in the sidebar
```

The last example is bad because it conflates two changes. Each commit should represent one logical change.
