import path from "path";
import { PACKAGE_ROOT } from "./utils.js";
import type { InstallScope } from "./constants.js";
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
  return SKILLS_MEMORY_NEXT_STEPS;
}

export function getCodexPlan(cwd: string, scope: InstallScope): InstallPlan {
  const dest = path.join(cwd, ".codex");
  const metaDir = scope === "skills" ? path.join(cwd, ".agents") : dest;
  const src = path.join(PACKAGE_ROOT, "codex");

  const steps = scope === "skills"
    ? [
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
      ]
    : [
        { label: ".codex/config.toml", src: path.join(src, "config.toml"), destFile: path.join(dest, "config.toml") },
        { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
        memoryStep(cwd),
        { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
        { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
      ];

  return { dest, metaDir, steps, nextSteps: getNextSteps(scope) };
}
