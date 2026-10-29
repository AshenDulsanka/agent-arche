import path from "path";
import { PACKAGE_ROOT } from "./utils.js";
import {
  ORCHESTRATION_SKILL,
  PLATFORM_SCOPES,
  scopeHasMemory,
  skillDirName,
  type InstallScope,
  type Platform,
  type SetupProfile,
} from "./constants.js";
import type { ContentTransform, DirPlanStep, InstallPlan } from "./types.js";

// Package source layout. Shared assets live at the root; platform-specific
// assets (including each platform's skills) live under claude/ and codex/, and
// profile overlays under commerce/<platform>/.
const SOURCE = {
  claudeSkills: path.join(PACKAGE_ROOT, "claude", "skills"),
  codexSkills: path.join(PACKAGE_ROOT, "codex", "skills"),
  memory: path.join(PACKAGE_ROOT, "memory"),
  context: path.join(PACKAGE_ROOT, "context"),
  claude: path.join(PACKAGE_ROOT, "claude"),
  codex: path.join(PACKAGE_ROOT, "codex"),
  codexOrchestration: path.join(PACKAGE_ROOT, "codex", "orchestration"),
  commerceClaude: path.join(PACKAGE_ROOT, "commerce", "claude"),
  commerceCodex: path.join(PACKAGE_ROOT, "commerce", "codex"),
};

type ClaudeScope = typeof PLATFORM_SCOPES.claude[number];
type CodexScope = typeof PLATFORM_SCOPES.codex[number];

function memoryStep(cwd: string, transform?: ContentTransform): DirPlanStep {
  return {
    label: "memory/",
    src: SOURCE.memory,
    destDir: path.join(cwd, "memory"),
    skipIfExists: true,
    legacyMemoryDirs: [".codex/memory"],
    transform,
  };
}

export function getPlan(
  platform: Platform,
  cwd: string,
  profile: SetupProfile,
  scope: InstallScope,
  requestedSkills: readonly string[],
): InstallPlan {
  return platform === "claude"
    ? getClaudePlan(cwd, profile, scope as ClaudeScope, requestedSkills)
    : getCodexPlan(cwd, profile, scope as CodexScope, requestedSkills);
}

// ─── Claude Code ──────────────────────────────────────────────────────────────
// Skills ship as Claude-native copies under claude/skills/. The shared memory and
// context files are written for Codex and get their few platform paths rewritten.
const CLAUDE_REWRITES: ReadonlyArray<[RegExp, string]> = [
  [/\.codex\/context\//g, ".claude/context/"],
  [/\.codex\/agent-arche\.json/g, ".claude/agent-arche.json"],
  [/`\.codex\/`/g, "`.claude/`"],
  [/`AGENTS\.md`/g, "`CLAUDE.md`"],
  [/`orchestration`/g, "`subagents`"],
];

const toClaudeMarkdown: ContentTransform = (content) => (
  CLAUDE_REWRITES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), content)
);

const CLAUDE_NEXT_STEPS = {
  skills: [
    "Commit .claude/agent-arche.json and .claude/skills/ to your repo",
    "Type / in Claude Code to see the installed skills; most load automatically when relevant",
  ],
  "skills-hooks": [
    "Commit .claude/ to your repo",
    "Review the installed hooks with /hooks",
    "Type / in Claude Code to see the installed skills; most load automatically when relevant",
  ],
  "skills-memory": [
    "Commit .claude/ and memory/ to your repo",
    "Review the installed hooks with /hooks",
    "Use the context query before broad memory reads",
  ],
  subagents: [
    "Commit .claude/ and memory/ to your repo",
    "Review the installed hooks with /hooks",
    "Check the installed subagents with /agents; Claude delegates to them when it saves context",
  ],
} satisfies Record<ClaudeScope, readonly string[]>;

function claudeNextStepsFor(profile: SetupProfile, scope: ClaudeScope): readonly string[] {
  if (profile !== "commerce" || scope === "skills") return CLAUDE_NEXT_STEPS[scope];
  return [
    ...CLAUDE_NEXT_STEPS[scope],
    "Run /mcp in Claude Code to approve the project servers and authenticate klaviyo",
    "Keep Klaviyo read-only until a reviewed change is explicitly approved",
  ];
}

export function getClaudePlan(
  cwd: string,
  profile: SetupProfile,
  scope: ClaudeScope,
  requestedSkills: readonly string[],
): InstallPlan {
  const dest = path.join(cwd, ".claude");
  const selectedSkills = [...requestedSkills];

  const steps: InstallPlan["steps"] = selectedSkills.map((skill) => {
    const dir = skillDirName("claude", skill);
    return {
      label: `.claude/skills/${dir}/`,
      src: path.join(SOURCE.claudeSkills, dir),
      destDir: path.join(dest, "skills", dir),
    };
  });

  if (scope !== "skills") {
    steps.unshift(
      { label: ".claude/settings.json", src: path.join(SOURCE.claude, "settings.json"), destFile: path.join(dest, "settings.json"), mergeJson: true },
      { label: ".claude/hooks/", src: path.join(SOURCE.claude, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".claude/context/", src: SOURCE.context, destDir: path.join(dest, "context"), transform: toClaudeMarkdown },
    );
    if (profile === "commerce") {
      steps.push({
        label: ".mcp.json",
        src: path.join(SOURCE.commerceClaude, "mcp.json"),
        destFile: path.join(cwd, ".mcp.json"),
        mergeJson: true,
      });
    }
  }

  if (scopeHasMemory(scope)) {
    steps.push(memoryStep(cwd, toClaudeMarkdown));
  }

  if (scope === "subagents") {
    steps.push({ label: ".claude/agents/", src: path.join(SOURCE.claude, "agents"), destDir: path.join(dest, "agents") });
    if (profile === "commerce") {
      steps.push({
        label: ".claude/agents/ (commerce specialists)",
        src: path.join(SOURCE.commerceClaude, "agents"),
        destDir: path.join(dest, "agents"),
      });
    }
  }

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: claudeNextStepsFor(profile, scope),
    selectedSkills,
  };
}

// ─── Codex ────────────────────────────────────────────────────────────────────
const CODEX_NEXT_STEPS = {
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
} satisfies Record<CodexScope, readonly string[]>;

function codexNextStepsFor(profile: SetupProfile, scope: CodexScope): readonly string[] {
  if (profile !== "commerce" || scope === "skills") return CODEX_NEXT_STEPS[scope];
  return [
    ...CODEX_NEXT_STEPS[scope],
    "Run codex mcp login klaviyo, review the requested account, then restart Codex",
    "Keep Klaviyo read-only until a reviewed change is explicitly approved",
  ];
}

function codexConfigSource(profile: SetupProfile, scope: CodexScope): string {
  const base = profile === "commerce" ? SOURCE.commerceCodex : SOURCE.codex;
  return scope === "orchestration"
    ? path.join(base, "orchestration", "config.toml")
    : path.join(base, "config.toml");
}

function codexSkillSource(skill: string): string {
  return skill === ORCHESTRATION_SKILL
    ? path.join(SOURCE.codexOrchestration, "skills", skill)
    : path.join(SOURCE.codexSkills, skill);
}

export function getCodexPlan(
  cwd: string,
  profile: SetupProfile,
  scope: CodexScope,
  requestedSkills: readonly string[],
): InstallPlan {
  const dest = path.join(cwd, ".codex");
  const selectedSkills = scope === "orchestration"
    ? [...new Set([...requestedSkills, ORCHESTRATION_SKILL])]
    : [...requestedSkills];
  const selectedSkillSteps: DirPlanStep[] = selectedSkills.map((skill) => ({
    label: `.agents/skills/${skill}/`,
    src: codexSkillSource(skill),
    destDir: path.join(cwd, ".agents", "skills", skill),
  }));

  let steps: InstallPlan["steps"] = selectedSkillSteps;

  if (scope !== "skills") {
    steps = [
      { label: ".codex/config.toml", src: codexConfigSource(profile, scope), destFile: path.join(dest, "config.toml") },
      { label: ".codex/hooks/", src: path.join(SOURCE.codex, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".codex/context/", src: SOURCE.context, destDir: path.join(dest, "context") },
      ...selectedSkillSteps,
      { label: ".codex/hooks.json", src: path.join(SOURCE.codex, "hooks.json"), destFile: path.join(dest, "hooks.json") },
    ];
  }

  if (scopeHasMemory(scope)) {
    steps.splice(3, 0, memoryStep(cwd));
  }

  if (scope === "orchestration") {
    steps.splice(4, 0, {
      label: ".codex/agents/",
      src: path.join(SOURCE.codexOrchestration, "agents"),
      destDir: path.join(dest, "agents"),
    });
    if (profile === "commerce") {
      steps.splice(5, 0, {
        label: ".codex/agents/ (commerce specialists)",
        src: path.join(SOURCE.commerceCodex, "orchestration", "agents"),
        destDir: path.join(dest, "agents"),
      });
    }
  }

  return {
    dest,
    metaDir: dest,
    steps,
    nextSteps: codexNextStepsFor(profile, scope),
    selectedSkills,
  };
}
