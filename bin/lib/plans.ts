import path from "path";
import { PACKAGE_ROOT, makeAgentTransform } from "./utils.js";
import type { Subscription } from "./constants.js";
import { NEXT_STEPS } from "./constants.js";
import type { InstallPlan } from "./types.js";

export function getCopilotPlan(cwd: string, subscription: Subscription): InstallPlan {
  const dest = path.join(cwd, ".github");
  const src = path.join(PACKAGE_ROOT, "copilot");
  const agentTransform = makeAgentTransform(subscription);
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".github/agents/",       src: path.join(src, "agents"),                  destDir: path.join(dest, "agents"),             transform: agentTransform },
      { label: ".github/hooks/",        src: path.join(src, "hooks"),                   destDir: path.join(dest, "hooks") },
      { label: ".github/instructions/", src: path.join(src, "instructions"),             destDir: path.join(dest, "instructions") },
      { label: ".github/prompts/",      src: path.join(src, "prompts"),                  destDir: path.join(dest, "prompts") },
      { label: ".github/skills/",       src: path.join(PACKAGE_ROOT, "skills"),          destDir: path.join(dest, "skills") },
      { label: ".github/memory/",       src: path.join(PACKAGE_ROOT, "memory"),          destDir: path.join(dest, "memory") },
    ],
    nextSteps: NEXT_STEPS.copilot,
  };
}

export function getClaudePlan(cwd: string): InstallPlan {
  const dest = path.join(cwd, ".claude");
  const src = path.join(PACKAGE_ROOT, "claude");
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".claude/agents/",      src: path.join(src, "agents"),              destDir: path.join(dest, "agents") },
      { label: ".claude/rules/",       src: path.join(src, "rules"),               destDir: path.join(dest, "rules") },
      { label: ".claude/commands/",    src: path.join(src, "commands"),             destDir: path.join(dest, "commands") },
      { label: ".claude/hooks/",       src: path.join(src, "hooks"),               destDir: path.join(dest, "hooks") },
      { label: ".claude/skills/",      src: path.join(PACKAGE_ROOT, "skills"),      destDir: path.join(dest, "skills") },
      { label: ".claude/memory/",      src: path.join(PACKAGE_ROOT, "memory"),      destDir: path.join(dest, "memory") },
      { label: ".claude/settings.json",src: path.join(src, "settings.json"),       destFile: path.join(dest, "settings.json") },
      { label: "CLAUDE.md",            src: path.join(src, "CLAUDE.md"),            destFile: path.join(cwd, "CLAUDE.md"), skipIfExists: true },
    ],
    nextSteps: NEXT_STEPS.claude,
  };
}

export function getCodexPlan(cwd: string): InstallPlan {
  const dest = path.join(cwd, ".codex");
  const src = path.join(PACKAGE_ROOT, "codex");
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".codex/agents/",       src: path.join(src, "agents"),              destDir: path.join(dest, "agents") },
      { label: ".codex/config.toml",   src: path.join(src, "config.toml"),         destFile: path.join(dest, "config.toml") },
      { label: ".codex/hooks/",        src: path.join(src, "hooks"),               destDir: path.join(dest, "hooks") },
      { label: ".codex/rules/",        src: path.join(src, "rules"),               destDir: path.join(dest, "rules") },
      { label: ".codex/instructions/", src: path.join(src, "instructions"),         destDir: path.join(dest, "instructions") },
      { label: ".codex/memory/",       src: path.join(PACKAGE_ROOT, "memory"),      destDir: path.join(dest, "memory") },
      { label: ".agents/skills/",      src: path.join(PACKAGE_ROOT, "skills"),      destDir: path.join(cwd, ".agents", "skills") },
      { label: ".codex/hooks.json",    src: path.join(src, "hooks.json"),           destFile: path.join(dest, "hooks.json") },
      { label: "AGENTS.md",            src: path.join(src, "AGENTS.md"),            destFile: path.join(cwd, "AGENTS.md"), skipIfExists: true },
    ],
    nextSteps: NEXT_STEPS.codex,
  };
}
