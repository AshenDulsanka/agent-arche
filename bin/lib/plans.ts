import path from "path";
import { PACKAGE_ROOT } from "./utils.js";
import type { InstallScope } from "./constants.js";
import { NEXT_STEPS } from "./constants.js";
import type { DirPlanStep, InstallPlan } from "./types.js";

function memoryStep(cwd: string): DirPlanStep {
  return {
    label: "memory/",
    src: path.join(PACKAGE_ROOT, "memory"),
    destDir: path.join(cwd, "memory"),
    skipIfExists: true,
    legacyMemoryDirs: [".codex/memory"],
  };
}

const SKILLS_ONLY_NEXT_STEPS = [
  "Commit .agents/skills/ to your repo",
  "Ask Codex to use the relevant skill file for the task",
] as const;

const SKILLS_MEMORY_NEXT_STEPS = [
  "Commit .codex/, .agents/skills/, and memory/ to your repo",
  "Ask Codex to use the relevant skill file for the task",
  "Before finishing work, update the memory vault with what changed using the project-startup skill",
] as const;

function getNextSteps(scope: InstallScope): readonly string[] {
  if (scope === "skills") return SKILLS_ONLY_NEXT_STEPS;
  if (scope === "skills-memory") return SKILLS_MEMORY_NEXT_STEPS;
  return NEXT_STEPS.codex;
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
        memoryStep(cwd),
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
        memoryStep(cwd),
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
        memoryStep(cwd),
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
        { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
        { label: "AGENTS.md", src: path.join(src, "AGENTS.md"), destFile: path.join(cwd, "AGENTS.md"), skipIfExists: true },
      ];

  return { dest, metaDir: dest, steps, nextSteps: getNextSteps(scope) };
}
