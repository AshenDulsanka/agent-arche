export const META_FILE = "agent-arche.json";

export const PLATFORM_META = {
  codex: {
    name: "Codex",
    short: "Codex",
    accent: "cyan",
    destination: ".codex/ + .agents/skills/ + AGENTS.md",
    capabilities: [
      "Agents, hooks, rules, config, and instruction globs",
      "Shared skills folder plus project-root AGENTS.md context",
    ],
    note: "Built for MCP-enabled Codex sessions.",
  },
} as const;

export const INSTALL_SCOPE_META = {
  "skills-memory": {
    label: "Skills + hooks + memory (Recommended)",
    accent: "magenta",
    summary: "Install shared skills, safety hooks, and root memory without agents.",
    details: [
      "No agents, rules/instructions, or root agent docs",
      "Hooks remind the assistant to update memory before finishing",
    ],
  },
  orchestration: {
    label: "Full orchestration",
    accent: "green",
    summary: "Install agents, hooks, instructions, rules, skills, and root memory.",
    details: [
      "Best for first-time setup",
      "Includes all Codex orchestration files",
    ],
  },
  lean: {
    label: "Small orchestration",
    accent: "yellow",
    summary: "Install a 3-agent workflow, hooks, instructions, skills, and root memory.",
    details: [
      "Orchestrator, Coder, and Docs-updater only",
      "Keeps memory support without the full specialist roster",
    ],
  },
  skills: {
    label: "Skills only",
    accent: "cyan",
    summary: "Install only shared skills into .agents/skills/.",
    details: [
      "No agents, hooks, instructions, rules, or memory",
      "Great for lightweight skill updates",
    ],
  },
} as const;

export const STEP_ORDER = ["scope", "preview", "install", "done"] as const;

export type Platform = keyof typeof PLATFORM_META;
export type InstallScope = keyof typeof INSTALL_SCOPE_META;
export type Step = (typeof STEP_ORDER)[number];

export const STEP_LABELS = {
  scope: "Scope",
  preview: "Preview",
  install: "Install",
  done: "Done",
} as const;

export const NEXT_STEPS = {
  codex: [
    "Commit .codex/, .agents/skills/, AGENTS.md, and memory/ to your repo",
    "Run codex from the repo root and ask it to use the orchestrator agent",
    "Run startup: ask the orchestrator agent to use the project-startup skill and remove skills that are not needed for your workflow",
  ],
} as const;

export const PRIMARY_COMMANDS = {
  codex: "codex",
} as const;

export const COPY = {
  app: {
    name: "agent-arche",
    tagline: "Codex agent orchestration for terminal-first teams.",
  },
  scope: {
    eyebrow: "Install mode",
    title: "Choose what you want to install.",
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
    missingMessage: "Run npx agent-arche install to set up Codex first.",
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
  labels: {
    installScope: "Install scope",
    platform: "Platform",
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
