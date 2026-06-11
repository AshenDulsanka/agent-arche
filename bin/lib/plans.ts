import path from "path";
import { PACKAGE_ROOT, makeAgentTransform } from "./utils.js";
import type { InstallScope, Platform, Subscription } from "./constants.js";
import { NEXT_STEPS } from "./constants.js";
import type { DirPlanStep, InstallPlan } from "./types.js";

const LEGACY_MEMORY_DIRS: Record<Platform, readonly string[]> = {
  copilot: [".github/memory", ".claude/memory", ".codex/memory"],
  claude: [".claude/memory", ".github/memory", ".codex/memory"],
  codex: [".codex/memory", ".github/memory", ".claude/memory"],
};

function memoryStep(cwd: string, platform: Platform): DirPlanStep {
  return {
    label: "memory/",
    src: path.join(PACKAGE_ROOT, "memory"),
    destDir: path.join(cwd, "memory"),
    skipIfExists: true,
    legacyMemoryDirs: LEGACY_MEMORY_DIRS[platform],
  };
}

const SKILLS_ONLY_NEXT_STEPS: Record<Platform, readonly string[]> = {
  copilot: [
    "Commit .github/skills/ to your repo",
    "Ask Copilot Chat to use the relevant skill file for the task",
  ],
  claude: [
    "Commit .claude/skills/ to your repo",
    "Ask Claude Code to use the relevant skill file for the task",
  ],
  codex: [
    "Commit .agents/skills/ to your repo",
    "Ask Codex to use the relevant skill file for the task",
  ],
};

const SKILLS_MEMORY_NEXT_STEPS: Record<Platform, readonly string[]> = {
  copilot: [
    "Commit .github/hooks/, .github/skills/, and memory/ to your repo",
    "Ask Copilot Chat to use the relevant skill file for the task",
    "Before finishing work, update the memory vault with what changed using the project-startup skill",
  ],
  claude: [
    "Commit .claude/hooks/, .claude/skills/, .claude/settings.json, and memory/ to your repo",
    "Ask Claude Code to use the relevant skill file for the task",
    "Before finishing work, update the memory vault with what changed using the project-startup skill",
  ],
  codex: [
    "Commit .codex/, .agents/skills/, and memory/ to your repo",
    "Ask Codex to use the relevant skill file for the task",
    "Before finishing work, update the memory vault with what changed using the project-startup skill",
  ],
};

function getNextSteps(platform: Platform, scope: InstallScope): readonly string[] {
  if (scope === "skills") {
    return SKILLS_ONLY_NEXT_STEPS[platform];
  }

  if (scope === "skills-memory") {
    return SKILLS_MEMORY_NEXT_STEPS[platform];
  }

  return NEXT_STEPS[platform];
}

export function getCopilotPlan(cwd: string, subscription: Subscription, scope: InstallScope): InstallPlan {
  const dest = path.join(cwd, ".github");
  const src = path.join(PACKAGE_ROOT, "copilot");
  const agentTransform = makeAgentTransform(subscription);

  const steps = scope === "skills"
    ? [
        { label: ".github/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
      ]
    : scope === "skills-memory"
    ? [
        { label: ".github/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".github/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "copilot"),
      ]
    : scope === "lean"
    ? [
        { label: ".github/agents/orchestrator.agent.md", src: path.join(src, "lean-agents", "orchestrator.agent.md"), destFile: path.join(dest, "agents", "orchestrator.agent.md") },
        { label: ".github/agents/coder.agent.md", src: path.join(src, "lean-agents", "coder.agent.md"), destFile: path.join(dest, "agents", "coder.agent.md") },
        { label: ".github/agents/docs-updater.agent.md", src: path.join(src, "lean-agents", "docs-updater.agent.md"), destFile: path.join(dest, "agents", "docs-updater.agent.md") },
        { label: ".github/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".github/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
        { label: ".github/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "copilot"),
      ]
    : [
        { label: ".github/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents"), transform: agentTransform },
        { label: ".github/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".github/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
        { label: ".github/prompts/", src: path.join(src, "prompts"), destDir: path.join(dest, "prompts") },
        { label: ".github/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "copilot"),
      ];

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: getNextSteps("copilot", scope),
  };
}

export function getClaudePlan(cwd: string, scope: InstallScope): InstallPlan {
  const dest = path.join(cwd, ".claude");
  const src = path.join(PACKAGE_ROOT, "claude");

  const steps = scope === "skills"
    ? [
        { label: ".claude/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
      ]
    : scope === "skills-memory"
    ? [
        { label: ".claude/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".claude/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "claude"),
        { label: ".claude/settings.json", src: path.join(src, "settings.json"), destFile: path.join(dest, "settings.json") },
      ]
    : scope === "lean"
    ? [
        { label: ".claude/agents/orchestrator.md", src: path.join(src, "lean-agents", "orchestrator.md"), destFile: path.join(dest, "agents", "orchestrator.md") },
        { label: ".claude/agents/coder.md", src: path.join(src, "lean-agents", "coder.md"), destFile: path.join(dest, "agents", "coder.md") },
        { label: ".claude/agents/docs-updater.md", src: path.join(src, "lean-agents", "docs-updater.md"), destFile: path.join(dest, "agents", "docs-updater.md") },
        { label: ".claude/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
        { label: ".claude/commands/", src: path.join(src, "commands"), destDir: path.join(dest, "commands") },
        { label: ".claude/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".claude/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "claude"),
        { label: ".claude/settings.json", src: path.join(src, "settings.json"), destFile: path.join(dest, "settings.json") },
        { label: "CLAUDE.md", src: path.join(src, "CLAUDE.lean.md"), destFile: path.join(cwd, "CLAUDE.md"), skipIfExists: true },
      ]
    : [
        { label: ".claude/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents") },
        { label: ".claude/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
        { label: ".claude/commands/", src: path.join(src, "commands"), destDir: path.join(dest, "commands") },
        { label: ".claude/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".claude/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
        memoryStep(cwd, "claude"),
        { label: ".claude/settings.json", src: path.join(src, "settings.json"), destFile: path.join(dest, "settings.json") },
        { label: "CLAUDE.md", src: path.join(src, "CLAUDE.md"), destFile: path.join(cwd, "CLAUDE.md"), skipIfExists: true },
      ];

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: getNextSteps("claude", scope),
  };
}

export function getCodexPlan(cwd: string, scope: InstallScope): InstallPlan {
  const dest = path.join(cwd, ".codex");
  const src = path.join(PACKAGE_ROOT, "codex");

  const steps = scope === "skills"
    ? [
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
      ]
    : scope === "skills-memory"
    ? [
        { label: ".codex/config.toml", src: path.join(src, "config.toml"), destFile: path.join(dest, "config.toml") },
        { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        memoryStep(cwd, "codex"),
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
        { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
      ]
    : scope === "lean"
    ? [
        { label: ".codex/agents/orchestrator.toml", src: path.join(src, "lean-agents", "orchestrator.toml"), destFile: path.join(dest, "agents", "orchestrator.toml") },
        { label: ".codex/agents/coder.toml", src: path.join(src, "lean-agents", "coder.toml"), destFile: path.join(dest, "agents", "coder.toml") },
        { label: ".codex/agents/docs-updater.toml", src: path.join(src, "lean-agents", "docs-updater.toml"), destFile: path.join(dest, "agents", "docs-updater.toml") },
        { label: ".codex/config.toml", src: path.join(src, "config.toml"), destFile: path.join(dest, "config.toml") },
        { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".codex/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
        { label: ".codex/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
        memoryStep(cwd, "codex"),
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
        { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
        { label: "AGENTS.md", src: path.join(src, "AGENTS.lean.md"), destFile: path.join(cwd, "AGENTS.md"), skipIfExists: true },
      ]
    : [
        { label: ".codex/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents") },
        { label: ".codex/config.toml", src: path.join(src, "config.toml"), destFile: path.join(dest, "config.toml") },
        { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        { label: ".codex/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
        { label: ".codex/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
        memoryStep(cwd, "codex"),
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
        { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
        { label: "AGENTS.md", src: path.join(src, "AGENTS.md"), destFile: path.join(cwd, "AGENTS.md"), skipIfExists: true },
      ];

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: getNextSteps("codex", scope),
  };
}
