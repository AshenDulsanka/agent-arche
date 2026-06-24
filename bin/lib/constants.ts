// ─── Model names ──────────────────────────────────────────────────────────────
export const META_FILE = "agent-arche.json";

export const MODELS = {
  SONNET: "Claude Sonnet 4.6 (copilot)",
  OPUS: "Claude Opus 4.7 (copilot)",
  GPT5: "GPT-5.4 (copilot)",
  CODEX: "GPT-5.3-Codex (copilot)",
  GEMINI: "Gemini 3.1 Pro (Preview) (copilot)",
  AUTO: "Auto (copilot)",
} as const;

// ─── Platform definitions ─────────────────────────────────────────────────────
export const PLATFORM_META = {
  codex: {
    name: "Codex (Recommended)",
    short: "Codex",
    accent: "cyan",
    destination: ".codex/ + .agents/skills/ + AGENTS.md",
    capabilities: [
      "Agents, hooks, rules, config, and instruction globs",
      "Shared skills folder plus project-root AGENTS.md context",
    ],
    note: "Strong choice for MCP-enabled Codex sessions.",
  },
  copilot: {
    name: "GitHub Copilot",
    short: "Copilot",
    accent: "green",
    destination: ".github/",
    capabilities: [
      "Agents, prompts, hooks, and file-matched instructions",
      "Obsidian-style memory vault for long-term project context",
    ],
    note: "Best when you want the deepest GitHub-native workflow.",
  },
  claude: {
    name: "Claude Code (beta)",
    short: "Claude",
    accent: "yellow",
    destination: ".claude/ + CLAUDE.md",
    capabilities: [
      "Agents, hooks, rules, commands, and memory",
      "Project-root CLAUDE.md for persistent team context",
    ],
    note: "Good fit for terminal-first Claude workflows.",
  },
} as const;

// ─── Subscription definitions ─────────────────────────────────────────────────
export const SUBSCRIPTION_META = {
  auto: {
    label: "Auto",
    accent: "cyan",
    summary: "Force all bundled agent models to Auto mode.",
    details: [
      `${MODELS.OPUS} -> ${MODELS.AUTO}`,
      `${MODELS.SONNET} -> ${MODELS.AUTO}`,
      `${MODELS.GPT5} -> ${MODELS.AUTO}`,
      `${MODELS.CODEX} -> ${MODELS.AUTO}`,
      `${MODELS.GEMINI} -> ${MODELS.AUTO}`,
    ],
  },
  student: {
    label: "Student",
    accent: "magenta",
    summary: "Maximize availability on limited Copilot access.",
    details: [
      `${MODELS.OPUS} -> ${MODELS.GPT5}`,
      `${MODELS.SONNET} -> ${MODELS.CODEX}`,
    ],
  },
  pro: {
    label: "Pro",
    accent: "yellow",
    summary: "Keep the stack close to default since Opus is not available.",
    details: [`${MODELS.OPUS} -> ${MODELS.SONNET}`],
  },
  "pro+": {
    label: "Pro+",
    accent: "green",
    summary: "Install the full default model lineup with no substitutions.",
    details: ["No model substitutions"],
  },
} as const;

// ─── Install scope definitions ───────────────────────────────────────────────
export const INSTALL_SCOPE_META = {
  "skills-memory": {
    label: "Skills + hooks + memory (Recommended)",
    accent: "magenta",
    summary: "Install shared skills, safety hooks, and root memory without agents.",
    details: [
      "No agents, prompts, rules/instructions, or root agent docs",
      "Hooks remind the assistant to update memory before finishing",
    ],
  },
  orchestration: {
    label: "Full orchestration",
    accent: "green",
    summary: "Install agents, hooks, instructions/rules, prompts/commands, skills, and root memory.",
    details: [
      "Best for first-time setup",
      "Includes all platform-specific orchestration files",
    ],
  },
  lean: {
    label: "Small orchestration",
    accent: "yellow",
    summary: "Install a 3-agent workflow, hooks, instructions/rules, skills, and root memory.",
    details: [
      "Orchestrator, Coder, and Docs-updater only",
      "Keeps memory support without the full specialist roster",
    ],
  },
  skills: {
    label: "Skills only",
    accent: "cyan",
    summary: "Install only shared skills into the platform's skills destination.",
    details: [
      "No agents, hooks, prompts, rules, or memory",
      "Great for lightweight skill updates",
    ],
  },
} as const;

// ─── Step order & labels ──────────────────────────────────────────────────────
export const STEP_ORDER = ["scope", "platform", "subscription", "preview", "install", "done"] as const;

export type Platform = keyof typeof PLATFORM_META;
export type Subscription = keyof typeof SUBSCRIPTION_META;
export type InstallScope = keyof typeof INSTALL_SCOPE_META;
export type Step = (typeof STEP_ORDER)[number];

export const STEP_LABELS = {
  scope: "Scope",
  platform: "Platform",
  subscription: "Plan",
  preview: "Preview",
  install: "Install",
  done: "Done",
} as const;

// ─── Next steps per platform ──────────────────────────────────────────────────
export const NEXT_STEPS = {
  copilot: [
    "Commit .github/ and memory/ to your repo",
    "Open Copilot Chat and use @Orchestrator to start",
    "Run startup: ask Orchestrator to use the project-startup skill and remove skills that are not needed for your workflow",
  ],
  claude: [
    "Commit .claude/, CLAUDE.md, and memory/ to your repo",
    "Run claude to start Claude Code",
    "Use @orchestrator agent to begin",
    "Run startup: ask Orchestrator to use the project-startup skill and remove skills that are not needed for your workflow",
  ],
  codex: [
    "Commit .codex/, .agents/skills/, AGENTS.md, and memory/ to your repo",
    "Run codex from the repo root and ask it to use the orchestrator agent",
    "Run startup: ask the orchestrator agent to use the project-startup skill and remove skills that are not needed for your workflow",
  ],
} as const;

// ─── Primary post-install commands ───────────────────────────────────────────
export const PRIMARY_COMMANDS = {
  copilot: "Open Copilot Chat and use @Orchestrator",
  claude: "claude",
  codex: "codex",
} as const;

// ─── All UI copy ──────────────────────────────────────────────────────────────
// Edit this object to change any visible text in the CLI without touching logic.
export const COPY = {
  app: {
    name: "agent-arche",
    tagline: "Multi-platform AI agent orchestration for terminal-first teams.",
  },
  platform: {
    eyebrow: "Start",
    title: "Choose where to install this package set.",
  },
  scope: {
    eyebrow: "Install mode",
    title: "Choose what you want to install.",
  },
  subscription: {
    eyebrow: "Copilot plan",
    title: "Choose your Copilot plan so the bundled models match your access.",
  },
  preview: {
    eyebrow: "Preview",
    includes: "What this setup includes",
    targets: "Install targets",
    missingWarning: "Missing sources will be skipped",
    confirmHints: "Enter/Y confirm  N cancel",
  },
  existing: {
    eyebrow: "Detected",
    nextAction: "npx agent-arche update",
    noFilesChanged: "No files were changed.",
    latestTitle: "agent-arche is already on the latest version for this project.",
    latestMessage: "No update is required.",
    missingTitle: "No existing agent-arche installation was detected.",
    missingMessage: "Run npx agent-arche install to set up your assistant first.",
  },
  install: {
    eyebrow: "Installing",
    title: "Applying the package set to your repository.",
    completed: "Completed",
    hashFetching: "Fetching integrity hash from npm...",
    updateChecking: "Checking for a newer version on npm...",
  },
  success: {
    eyebrow: "Ready",
    integrity: "Integrity",
    integrityCommand: "npm view agent-arche dist.integrity",
    integrityOnline: "Fetched from npm registry",
    integrityOffline: "Unavailable offline / unpublished",
    nextSteps: "Next steps",
    skippedNote: "Skipped because source files were not found",
  },
  cancelled: {
    eyebrow: "Cancelled",
    title: "Installation cancelled before any files were changed.",
    message: "You can run the command again whenever you're ready.",
  },
  // Row labels used in info tables
  labels: {
    installScope: "Install scope",
    platform: "Platform",
    copilotPlan: "Copilot plan",
    destination: "Destination",
    installUnits: "Install units",
    metadata: "Metadata",
    filesWritten: "Files written",
    primaryCommand: "Primary next command",
    integrity: "Integrity",
    installedVersion: "Installed version",
    npmLatestVersion: "NPM latest",
    installedAt: "Installed at",
    nextAction: "Next action",
    completedTargets: "Completed targets",
    filesCopied: "Files copied so far",
  },
};
