import path from "path";
import { PACKAGE_ROOT } from "./utils.js";
import { ORCHESTRATION_SKILL, type InstallScope, type SetupProfile } from "./constants.js";
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

function skillSteps(cwd: string, selectedSkills: readonly string[]): DirPlanStep[] {
  return selectedSkills.map((skill) => ({
    label: `.agents/skills/${skill}/`,
    src: path.join(PACKAGE_ROOT, "skills", skill),
    destDir: path.join(cwd, ".agents", "skills", skill),
  }));
}

const NEXT_STEPS = {
  skills: [
    "Commit .codex/agent-arche.json and .agents/skills/ to your repo",
    "Ask Codex to use the relevant skill file for the task",
  ],
  "skills-hooks": [
    "Commit .codex/ and .agents/skills/ to your repo",
    "Review and trust the installed hooks with /hooks",
    "Ask Codex to use the relevant skill file for the task",
  ],
  "skills-memory": [
    "Commit .codex/, .agents/skills/, and memory/ to your repo",
    "Review and trust the installed hooks with /hooks",
    "Use the context query before broad memory reads",
  ],
  orchestration: [
    "Commit .codex/, .agents/skills/, and memory/ to your repo",
    "Review and trust the installed hooks with /hooks",
    "Ask Codex to use the orchestrator agent for a complex, divisible task",
  ],
} satisfies Record<InstallScope, readonly string[]>;

function nextStepsFor(profile: SetupProfile, scope: InstallScope): readonly string[] {
  if (profile !== "commerce" || scope === "skills") return NEXT_STEPS[scope];
  return [
    ...NEXT_STEPS[scope],
    "Run codex mcp login klaviyo, review the requested account, then restart Codex",
    "Keep Klaviyo read-only until a reviewed change is explicitly approved",
  ];
}

function configSource(profile: SetupProfile, scope: InstallScope, defaultSource: string): string {
  if (profile !== "commerce") {
    return scope === "orchestration"
      ? path.join(PACKAGE_ROOT, "orchestration", "config.toml")
      : path.join(defaultSource, "config.toml");
  }
  return scope === "orchestration"
    ? path.join(PACKAGE_ROOT, "commerce", "orchestration", "config.toml")
    : path.join(PACKAGE_ROOT, "commerce", "config.toml");
}

export function getCodexPlan(
  cwd: string,
  profile: SetupProfile,
  scope: InstallScope,
  requestedSkills: readonly string[],
): InstallPlan {
  const dest = path.join(cwd, ".codex");
  const src = path.join(PACKAGE_ROOT, "codex");
  const selectedSkills = scope === "orchestration"
    ? [...new Set([...requestedSkills, ORCHESTRATION_SKILL])]
    : [...requestedSkills];
  const selectedSkillSteps = skillSteps(cwd, selectedSkills);

  let steps: InstallPlan["steps"] = selectedSkillSteps;

  if (scope !== "skills") {
    steps = [
      { label: ".codex/config.toml", src: configSource(profile, scope, src), destFile: path.join(dest, "config.toml") },
      { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".codex/context/", src: path.join(src, "context"), destDir: path.join(dest, "context") },
      ...selectedSkillSteps,
      { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
    ];
  }

  if (scope === "skills-memory" || scope === "orchestration") {
    steps.splice(3, 0, memoryStep(cwd));
  }

  if (scope === "orchestration") {
    steps.splice(4, 0, {
      label: ".codex/agents/",
      src: path.join(PACKAGE_ROOT, "orchestration", "agents"),
      destDir: path.join(dest, "agents"),
    });
    if (profile === "commerce") {
      steps.splice(5, 0, {
        label: ".codex/agents/ (commerce specialists)",
        src: path.join(PACKAGE_ROOT, "commerce", "orchestration", "agents"),
        destDir: path.join(dest, "agents"),
      });
    }
  }

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: nextStepsFor(profile, scope),
    selectedSkills,
  };
}
