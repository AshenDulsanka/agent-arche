# agent-arche

A Codex skills harness with reusable engineering workflows, optional safety hooks, and project memory (obsidian memory).

## Install

```bash
npx agent-arche install
```

Run it from the project root and choose a scope:

| Scope | Installs |
|---|---|
| Skills + hooks + memory | Skills, hooks, activation/config files, and memory |
| Skills only | `.agents/skills/` plus `.agents/agent-arche.json` install metadata |

After installation, run `project-startup` once. In Skills-only workspaces it configures only available project context and does not create a memory vault.

Update later with:

```bash
npx agent-arche update
```

## Skill Model

The skills use progressive disclosure: Codex sees concise names and descriptions first, then reads a full `SKILL.md` only when its trigger matches. The default engineering chain is:

```text
request/spec/ticket
  -> implement
     -> tdd                 when a useful behavior seam exists
     -> design              for UI/UX work
     -> postgres-patterns   only for confirmed PostgreSQL work
     -> seo                 only for search-specific work
     -> security-review     only for trust-boundary changes
  -> code-review            after non-trivial edits
  -> git or handoff         only when requested
```

Other entry paths:

```text
existing plan -> grill-with-docs -> to-spec -> to-tickets -> implement
broken behavior -> diagnosing-bugs -> implement -> code-review
architecture friction -> improve-codebase-architecture -> codebase-design -> grill-with-docs
```

Chaining is conditional. It never authorizes automatic commits, pushes, PRs, external issue creation, or sub-agent spawning.

## Skill Routing

| Skill | Trigger |
|---|---|
| `project-startup` | First run or missing `docs/agents/` context; seeds memory only in memory-capable scopes |
| `implement` | Any requested code change; central router and completion workflow |
| `diagnosing-bugs` | Broken, failing, throwing, flaky, or slow behavior that needs root-cause diagnosis |
| `tdd` | Test-first work or behavior changes with a useful public seam |
| `code-review` | Branch, PR, commit-range, or working-tree review; post-implementation quality gate |
| `security-review` | Auth, authorization, secrets, untrusted input, routes, SQL, files/uploads, redirects, SSRF, serialization, payments, sensitive data, or explicit vulnerability audit |
| `grill-with-docs` | Pressure-test a plan against existing code and documented decisions |
| `to-spec` | Explicitly synthesize the current discussion into a spec; implicit invocation is disabled |
| `to-tickets` | Split approved work into independently verifiable vertical tickets |
| `codebase-design` | Design deep modules, interfaces, seams, and test surfaces |
| `improve-codebase-architecture` | Find and explore architecture-deepening opportunities |
| `design` | UI/UX direction, implementation, redesign, audit, motion, and performance |
| `postgres-patterns` | Confirmed PostgreSQL schemas, SQL, migrations, RLS, indexes, pooling, or query plans |
| `seo` | Crawlability, metadata, structured data, search performance, web vitals, and internal linking |
| `git` | Branch, commit, PR, squash, or release-ready Git work |
| `handoff` | Compact continuation context for another session or person |
| `karpathy-guidelines` | Default implementation and review guardrails for assumptions, scope, simplicity, and verification |
| `caveman` | Explicit compressed communication mode |

`api-design` and `coding-standards` were removed. Their generic rules overlapped repo instructions, `implement`, `code-review`, and `security-review`, while loading extra context on common tasks. API shape should follow the project's actual conventions; trust-boundary checks belong in the security workflow.

## Security

`security-review` is a portable, evidence-first workflow. It scopes assets and trust boundaries, selects only applicable OWASP-style threats, runs safe local proofs, and separates confirmed vulnerabilities from defense-in-depth suggestions.

The skill does not claim an entire application is secure from a partial diff review and does not authorize testing production or third-party systems.

## Codex Files

Codex automatically discovers durable instructions from:

- global `~/.codex/AGENTS.md` or `AGENTS.override.md`;
- project `AGENTS.md` or `AGENTS.override.md`, walking from repo root to the current directory;
- fallback filenames explicitly listed in `project_doc_fallback_filenames`.

`.codex/instructions.md` is not a special auto-discovered filename. This package does not create a parallel instruction system. Put durable project rules in `AGENTS.md`; use nested `AGENTS.md` or `AGENTS.override.md` for subtree-specific rules.

Each skill must contain `SKILL.md` with `name` and `description`. `agents/openai.yaml` is optional. Use it when UI metadata, invocation policy, or tool dependencies add value; it is not required just because the skill runs in Codex. This repo uses it selectively, including disabling implicit invocation for `to-spec`.

Project-scoped runtime settings, MCP servers, hooks, model defaults, and sandbox behavior belong in `.codex/config.toml`, not in skill prose.

## Runtime Pieces

| Piece | Purpose |
|---|---|
| Hooks | Compact session context and a narrow pre-command blocklist for catastrophic shell operations |
| Memory | Repo-local durable decisions and patterns for the Skills + hooks + memory scope |
| `.codex/config.toml` | Codex runtime and disabled MCP examples without committed secrets |

The hook bundle uses `SessionStart` for low-cost durable context and `PreToolUse` only for destructive shell blocking. It deliberately avoids per-prompt and post-tool hooks. Project hooks run only in trusted projects and changed hook definitions must be reviewed in Codex with `/hooks`.

## Validate

```bash
npm run check
```

The check typechecks the installer. Skill structure should be reviewed when skills are added or renamed.

## Manual Setup

For Skills only, copy `skills/` to `.agents/skills/`. For Skills + hooks + memory, also copy `codex/config.toml`, `codex/hooks.json`, `codex/hooks/`, and `memory/` to their matching project paths.

The CLI is preferred because it applies the correct workspace-flavor boundaries.

Older Full or Small installations are migrated to the Skills + hooks + memory scope in package metadata. Updates stop managing custom-agent, instruction, rule, and generated `AGENTS.md` files; existing project copies are left untouched so local customizations are never deleted automatically.

## Credits

Built on top of excellent open-source work:

Some of the referenced skills have been adapted, renamed, combined, or otherwise updated to fit this Codex harness. They may therefore differ from their upstream versions; the links below credit the original projects and inspiration rather than implying that every skill remains an unchanged copy.

- [mattpocock/skills](https://github.com/mattpocock/skills): engineering workflow and deep-module skills.
- [cyxzdev/Uncodixfy](https://github.com/cyxzdev/Uncodixfy), [pbakaus/impeccable](https://github.com/pbakaus/impeccable), and [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill): design workflows.
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman): compressed communication.
- [Akindu23/my-agent-skills](https://github.com/Akindu23/my-agent-skills): Karpathy-style guardrails and PostgreSQL patterns.
