---
name: code-review
description: Review a branch, PR, commit range, or working-tree diff along two separate axes: Standards and Spec alignment. Use for review requests and as the quality gate after non-trivial implementation. Load security review only for security-sensitive changes.
---

# Code Review

Review only. Do not edit files unless the user also asks for fixes.

Keep the two axes separate:

- **Standards** — is the change correct, maintainable, tested, and consistent with the repository?
- **Spec** — does the change implement what was requested, without missing requirements or adding unrelated scope?

A change can pass one axis and fail the other. Never let strong code quality hide incorrect product behavior, or correct behavior hide poor implementation.

## 1. Establish the review range

Use the fixed point the user supplied. Otherwise infer the safest useful range:

1. PR base or upstream merge-base when available.
2. `origin/main...HEAD` or the documented default branch.
3. Staged and unstaged working-tree changes.

Verify the ref, inspect the commit list, include relevant uncommitted changes, and state exactly what was reviewed. An empty or unresolved range is a blocker, not a pass.

## 2. Load evidence

- Read `AGENTS.md`, applicable nested instructions, and relevant contribution or architecture docs.
- Load `karpathy-guidelines` for scope discipline, assumptions, simplicity, surgical changes, and verification quality.
- Read the originating issue, spec, PRD, acceptance criteria, or user request. If tracker context is required but `docs/agents/issue-tracker.md` is missing, use `project-startup`.
- Inspect affected callers, tests, schemas, and sibling paths when the same failure could recur.
- Load `postgres-patterns` only for confirmed PostgreSQL changes.
- Load `security-review` only for auth, authorization, secrets, untrusted input, routes, SQL, file I/O, uploads, redirects, external calls, serialization, payments, or sensitive data.

## 3. Standards axis

Review:

- correctness, edge cases, state transitions, errors, concurrency, cleanup, and compatibility;
- project conventions and applicable documented standards;
- tests through useful public seams, including missing regression coverage;
- concrete maintainability costs such as duplication, misleading names, shotgun changes, leaky seams, speculative generality, or pass-through abstractions;
- unnecessary scope or complexity identified by `karpathy-guidelines`.

Skip style issues already enforced by tooling. Treat undocumented smells as judgment calls, not hard violations. Repository conventions win.

## 4. Spec axis

Identify:

- missing or partially implemented requirements;
- behavior that contradicts the requirement;
- unrequested scope or speculative functionality;
- behavior that appears implemented but is not verifiably covered.

Cite the requirement for each finding. If no separate spec exists, use the user's request and observable intent. If there is genuinely no product requirement to compare against, mark the axis as unavailable rather than inventing one.

## 5. Execution strategy

For normal changes, review both axes in one context and report them separately.

For a large or high-risk diff, Standards and Spec may be reviewed in parallel only when the user and active environment allow sub-agents. Parallelism is an optimization, not a requirement. Do not duplicate large context unnecessarily; give each reviewer only the evidence its axis needs.

## 6. Report

Report findings first under `## Standards` and `## Spec`. Add `## Security` only when `security-review` was triggered.

Every finding needs:

- severity and confidence;
- file and line;
- concrete failure mode and impact;
- the smallest credible remediation;
- missing test evidence when applicable.

Order findings by severity within each section. Do not merge or rerank the two primary axes. If there are no findings, say so and state remaining test or environment gaps. End with the reviewed range and verification performed.
