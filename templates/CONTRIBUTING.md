# Contributing
<!-- TODO: Replace "[PROJECT NAME]" throughout this file with the actual project name. -->

## Getting started

<!-- TODO: Fill in the actual setup commands for this project. -->

```bash
# 1. Clone the repo
git clone https://github.com/TODO-USERNAME/TODO-REPO-NAME.git
cd TODO-REPO-NAME

# 2. Install dependencies
# TODO: Replace with your package manager (pnpm / npm / yarn)
pnpm install

# 3. Copy environment variables
cp .env.example .env
# TODO: Fill in the required values in .env — see README for what each one does

# 4. Start the dev server
# TODO: Replace with your actual dev command
pnpm dev
```

## Branch naming

Branches must follow this format: `type/short-description`

| Type | When to use |
|------|-------------|
| `feat/` | New feature or capability |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code change with no behaviour change |
| `chore/` | Tooling, config, dependencies |
| `ci/` | CI/CD pipeline changes |

Example: `feat/contact-form-validation`, `fix/mobile-nav-overflow`

Rules:
- All lowercase
- Hyphens only (no underscores, no slashes within the description)
- 2–5 words after the prefix
- No ticket numbers in branch names

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description in imperative mood

Optional longer explanation of what and why (not how).
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

Examples:
- `feat(auth): add magic link sign-in`
- `fix(contact): prevent double form submission on slow connection`
- `docs: update README with Docker setup steps`

Rules:
- Subject line max 72 characters
- Imperative mood ("add" not "added", "fix" not "fixes")
- No period at the end of the subject line
- Breaking changes: append `!` to the type → `feat!: redesign navigation`

## Pull requests

1. Branch from `main` (never commit directly to `main`)
2. Keep PRs focused — one logical change per PR
3. Fill in the PR template completely before requesting review
4. PRs with UI changes must include before/after screenshots
5. All checks must pass before merging
6. Squash merge — one commit per PR on `main`

## Running tests

```bash
# Unit tests
# TODO: Replace with actual test command
pnpm test

# Unit tests with coverage
# TODO: Replace or delete if coverage not set up
pnpm test:coverage

# E2E tests (requires dev server running)
# TODO: Replace or delete if Playwright not set up
pnpm exec playwright test
```

<!-- TODO: Add any additional test setup notes here (e.g. database seeding, env vars needed for tests). -->

## Code standards

Code standards are enforced automatically via `.github/instructions/`:

- **TypeScript** rules auto-load when editing `.ts` files
- **Svelte** rules auto-load when editing `.svelte` files
- **API route** rules auto-load when editing files in `routes/api/` or `server/`
- **Test** rules auto-load when editing `*.test.ts` or `*.spec.ts` files

Run the linter before committing:

```bash
# TODO: Replace with actual lint command (eslint / biome / etc.)
pnpm lint
```

## Changelog

Update `CHANGELOG.md` under `[Unreleased]` for every source change before opening a PR. Format:

```markdown
## [Unreleased]

### Added
- New contact form with honeypot bot detection

### Fixed
- Mobile navigation overflow on 320px viewports

### Changed
- Migrated image assets to WebP format
```

## Questions?

<!-- TODO: Replace with your actual contact method — GitHub Discussions, Discord, email, etc. -->
Open a GitHub Discussion or reach out at TODO-CONTACT.
