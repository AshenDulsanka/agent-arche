export const META_FILE = "agent-arche.json";

export const INSTALL_SCOPE_META = {
  skills: {
    label: "Skills only",
    summary: "Selected skills only. Lowest runtime overhead.",
    details: [
      "No hooks, context compiler, memory, or subagents",
      "Best when the project already has its own agent setup",
    ],
  },
  "skills-hooks": {
    label: "Skills + hooks",
    summary: "Selected skills, lean safety hooks, and deterministic context tools.",
    details: [
      "No project memory and no automatic subagent orchestration",
      "Good for established projects that want lightweight guardrails",
    ],
  },
  "skills-memory": {
    label: "Skills + hooks + memory (Recommended)",
    summary: "Adds indexed durable memory without reading the full vault.",
    details: [
      "Context compiler retrieves only task-relevant memory cards",
      "Routine work does not create memory notes",
    ],
  },
  orchestration: {
    label: "Full orchestration (High usage)",
    summary: "Orchestrator and specialized subagents. Costs substantially more usage.",
    details: [
      "Includes selected skills, hooks, indexed memory, and custom Codex agents",
      "Each subagent performs separate model and tool work, increasing token usage",
    ],
  },
} as const;

export const SKILL_GROUPS = {
  "Core engineering": [
    { value: "implement", label: "Implement", hint: "code changes end to end" },
    { value: "diagnosing-bugs", label: "Diagnosing bugs", hint: "root-cause workflow" },
    { value: "tdd", label: "TDD", hint: "behavior-first tests" },
    { value: "code-review", label: "Code review", hint: "correctness and spec gate" },
    { value: "karpathy-guidelines", label: "Karpathy guidelines", hint: "surgical coding guardrails" },
  ],
  "Security and backend": [
    { value: "security-review", label: "Security review", hint: "trust-boundary changes" },
    { value: "postgres-patterns", label: "PostgreSQL patterns", hint: "Postgres-specific work" },
  ],
  "Frontend and growth": [
    { value: "design", label: "Design", hint: "UI, UX, motion, and audits" },
    { value: "seo", label: "SEO", hint: "crawlability and search performance" },
  ],
  "Planning and architecture": [
    { value: "project-startup", label: "Project startup", hint: "new or unconfigured projects only" },
    { value: "to-spec", label: "Conversation to spec", hint: "synthesize an approved spec" },
    { value: "to-tickets", label: "Spec to tickets", hint: "split work into vertical tickets" },
    { value: "grill-with-docs", label: "Grill with docs", hint: "pressure-test plans" },
    { value: "codebase-design", label: "Codebase design", hint: "deep modules and seams" },
    { value: "improve-codebase-architecture", label: "Architecture review", hint: "find high-leverage improvements" },
  ],
  "Delivery and communication": [
    { value: "git", label: "Git", hint: "branches, commits, and PRs" },
    { value: "handoff", label: "Handoff", hint: "compact continuation context" },
    { value: "caveman", label: "Caveman", hint: "explicit terse response mode" },
  ],
} as const;

const CORE_DEFAULT_SKILLS = [
  "implement",
  "diagnosing-bugs",
  "tdd",
  "code-review",
  "karpathy-guidelines",
  "security-review",
  "git",
  "handoff",
] as const;

export const DEFAULT_SKILLS_BY_SCOPE = {
  skills: [...CORE_DEFAULT_SKILLS],
  "skills-hooks": [...CORE_DEFAULT_SKILLS],
  "skills-memory": [...CORE_DEFAULT_SKILLS, "project-startup"],
  orchestration: [
    ...CORE_DEFAULT_SKILLS,
    "project-startup",
    "to-spec",
    "to-tickets",
    "grill-with-docs",
    "codebase-design",
    "improve-codebase-architecture",
  ],
} as const satisfies Record<InstallScope, readonly string[]>;

export const ORCHESTRATION_SKILL = "orchestrate";
export const SELECTABLE_SKILLS = Object.values(SKILL_GROUPS).flatMap((group) => group.map((skill) => skill.value));

export type Platform = "codex";
export type InstallScope = keyof typeof INSTALL_SCOPE_META;
