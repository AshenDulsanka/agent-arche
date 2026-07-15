export const META_FILE = "agent-arche.json";

export const PLATFORM_META = {
  codex: {
    name: "Codex",
    short: "Codex",
    accent: "cyan",
    destination: ".agents/skills/ with optional .codex/ hooks and memory/",
    capabilities: [
      "Shared Codex skills with progressive disclosure",
      "Optional safety hooks, runtime config, and repo-local memory",
    ],
    note: "Built for MCP-enabled Codex sessions.",
  },
} as const;

export const INSTALL_SCOPE_META = {
  "skills-memory": {
    label: "Skills + hooks + memory (Recommended)",
    accent: "magenta",
    summary: "Install shared skills, safety hooks, runtime config, and root memory.",
    details: [
      "No custom-agent, instruction, rule, or root AGENTS.md templates",
      "Hooks remind the assistant to update memory before finishing",
    ],
  },
  skills: {
    label: "Skills only",
    accent: "cyan",
    summary: "Install only shared skills into .agents/skills/.",
    details: [
      "No hooks, runtime config, or memory",
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

export const PRIMARY_COMMANDS = {
  codex: "codex",
} as const;

export const COPY = {
  app: {
    name: "agent-arche",
    tagline: "Codex skills, hooks, and project memory for terminal-first teams.",
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
