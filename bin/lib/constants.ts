export const META_FILE = "agent-arche.json";

export const PLATFORM_META = {
  claude: {
    label: "Claude Code",
    summary: "Installs into .claude/ with token-lean settings and optional usage-optimized subagents.",
  },
  codex: {
    label: "Codex",
    summary: "Installs into .codex/ and .agents/skills/.",
  },
} as const;

export type Platform = keyof typeof PLATFORM_META;

export const SETUP_PROFILE_META = {
  general: {
    label: "General Engineering",
    summary: "The current technology-agnostic engineering setup.",
  },
  commerce: {
    label: "Commerce Stack",
    summary: "Shopify + Klaviyo + Django skills, integrations, and specialists.",
  },
} as const;

export type SetupProfile = keyof typeof SETUP_PROFILE_META;

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
      "Includes selected skills, hooks, indexed memory, and custom agents",
      "Each subagent performs separate model and tool work, increasing token usage",
    ],
  },
  subagents: {
    label: "Skills + hooks + memory + usage-optimized subagents",
    summary: "Adds cheap read-only subagents that keep noisy search, test, and MCP output out of the main context.",
    details: [
      "Exploration and test runs use a smaller model; implementation stays in the main thread",
      "Claude delegates only when it saves main-context tokens",
    ],
  },
} as const;

export type InstallScope = keyof typeof INSTALL_SCOPE_META;

// Codex coordinates through an orchestrator agent; Claude Code delegates natively,
// so it gets lean subagents instead of a full orchestration layer.
export const PLATFORM_SCOPES = {
  claude: ["skills", "skills-hooks", "skills-memory", "subagents"],
  codex: ["skills", "skills-hooks", "skills-memory", "orchestration"],
} as const satisfies Record<Platform, readonly InstallScope[]>;

export function scopeSupported(platform: Platform, scope: InstallScope): boolean {
  return (PLATFORM_SCOPES[platform] as readonly InstallScope[]).includes(scope);
}

// Scopes that install the indexed memory vault.
export function scopeHasMemory(scope: InstallScope): boolean {
  return scope === "skills-memory" || scope === "orchestration" || scope === "subagents";
}

const GENERAL_SKILL_GROUPS = {
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

const COMMERCE_SKILL_GROUPS = {
  ...GENERAL_SKILL_GROUPS,
  "Klaviyo and commerce operations": [
    { value: "klaviyo-operations", label: "Klaviyo operations", hint: "flows, profiles, events, and account diagnostics" },
    { value: "klaviyo-product-recommendations", label: "Klaviyo product recommendations", hint: "email, feed, catalog, and NBP troubleshooting" },
    { value: "klaviyo-customer-agent", label: "Klaviyo Customer Agent", hint: "skills, tools, guidance, and shopper support" },
    { value: "commerce-integration-debugging", label: "Commerce integration debugging", hint: "trace Shopify, Klaviyo, and Django end to end" },
    { value: "django-commerce-backend", label: "Django commerce backend", hint: "safe APIs, webhooks, jobs, and persistence" },
  ],
  "Shopify AI Toolkit (Official)": [
    { value: "shopify-admin", label: "Shopify Admin GraphQL", hint: "official Shopify API skill" },
    { value: "shopify-liquid", label: "Shopify Liquid", hint: "official Shopify theme skill" },
    { value: "shopify-custom-data", label: "Shopify custom data", hint: "official metafields and metaobjects skill" },
    { value: "shopify-use-shopify-cli", label: "Shopify CLI", hint: "official Shopify CLI workflow skill" },
    { value: "shopify-dev", label: "Shopify developer docs", hint: "official cross-API documentation skill" },
  ],
} as const;

export function skillGroupsForProfile(profile: SetupProfile) {
  return profile === "commerce" ? COMMERCE_SKILL_GROUPS : GENERAL_SKILL_GROUPS;
}

export const PROJECT_TYPE_META = {
  "full-stack": {
    label: "Full-stack",
    summary: "Frontend and backend work in the same project.",
  },
  backend: {
    label: "Backend",
    summary: "APIs, services, data, or infrastructure without a frontend surface.",
  },
  frontend: {
    label: "Frontend",
    summary: "UI-focused project without backend-specific workflows.",
  },
  general: {
    label: "General / other",
    summary: "CLI, library, tooling, documentation, or mixed non-web work.",
  },
} as const;

export const PROJECT_STAGE_META = {
  established: {
    label: "Established project",
    summary: "Already has code, conventions, or an agent harness.",
  },
  greenfield: {
    label: "Greenfield project",
    summary: "New or unconfigured project that benefits from startup context.",
  },
} as const;

const CORE_RECOMMENDED_SKILLS = [
  "implement",
  "diagnosing-bugs",
  "tdd",
  "code-review",
  "karpathy-guidelines",
  "security-review",
  "git",
  "handoff",
] as const;

const PROJECT_TYPE_RECOMMENDATIONS = {
  "full-stack": ["design", "seo", "postgres-patterns"],
  backend: ["postgres-patterns"],
  frontend: ["design", "seo"],
  general: [],
} as const satisfies Record<ProjectType, readonly string[]>;

const PROJECT_STAGE_RECOMMENDATIONS = {
  established: [],
  greenfield: ["project-startup"],
} as const satisfies Record<ProjectStage, readonly string[]>;

const PROFILE_RECOMMENDATIONS = {
  general: [],
  commerce: [
    "klaviyo-operations",
    "klaviyo-product-recommendations",
    "klaviyo-customer-agent",
    "commerce-integration-debugging",
    "django-commerce-backend",
    "shopify-admin",
    "shopify-liquid",
    "shopify-custom-data",
    "shopify-use-shopify-cli",
    "shopify-dev",
  ],
} as const satisfies Record<SetupProfile, readonly string[]>;

const SCOPE_RECOMMENDATIONS = {
  skills: [],
  "skills-hooks": [],
  "skills-memory": [],
  subagents: [],
  orchestration: [
    "to-spec",
    "to-tickets",
    "grill-with-docs",
    "codebase-design",
    "improve-codebase-architecture",
  ],
} as const satisfies Record<InstallScope, readonly string[]>;

export function recommendedSkills(
  profile: SetupProfile,
  scope: InstallScope,
  projectType: ProjectType,
  projectStage: ProjectStage,
): string[] {
  return [...new Set([
    ...CORE_RECOMMENDED_SKILLS,
    ...PROFILE_RECOMMENDATIONS[profile],
    ...PROJECT_TYPE_RECOMMENDATIONS[projectType],
    ...PROJECT_STAGE_RECOMMENDATIONS[projectStage],
    ...SCOPE_RECOMMENDATIONS[scope],
  ])];
}

export const ORCHESTRATION_SKILL = "orchestrate";

// Explicit-request workflows. On Claude Code these load only via /<name>, so their
// descriptions never occupy the model's skill-routing context.
export const CLAUDE_USER_INVOKED_SKILLS: ReadonlySet<string> = new Set([
  "caveman",
  "handoff",
  "project-startup",
  "grill-with-docs",
  "improve-codebase-architecture",
]);

export function selectableSkillsForProfile(profile: SetupProfile): string[] {
  return Object.values(skillGroupsForProfile(profile)).flatMap((group) => group.map((skill) => skill.value));
}

export type ProjectType = keyof typeof PROJECT_TYPE_META;
export type ProjectStage = keyof typeof PROJECT_STAGE_META;
