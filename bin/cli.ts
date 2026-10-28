#!/usr/bin/env node

import { runApp } from "./App.js";
import { readPackageJson } from "./lib/utils.js";
import type { InstallScope, Platform, ProjectStage, ProjectType, SetupProfile } from "./lib/constants.js";

function showHelp(): void {
  console.log(`
agent-arche - Selective Claude Code and Codex skills, context, memory, and orchestration

Usage
  npx agent-arche [install] [options]
  npx agent-arche update [options]

Options
  --platform=<agent>      claude or codex
  --profile=<profile>     general or commerce
  --skills-only          Selected skills only
  --skills-hooks         Selected skills plus hooks and context tools
  --skills-memory        Selected skills, hooks, context tools, and memory
  --subagents            Claude Code: memory scope plus usage-optimized subagents
  --orchestration        Codex: full multi-agent orchestration (high usage)
  --project-type=<type>  full-stack, backend, frontend, or general
  --project-stage=<type> established or greenfield
  --select-skills=a,b    Install an explicit comma-separated skill set
  --all-skills           Install every skill available to the selected profile
  --no-init              Claude Code: skip generating CLAUDE.md on first install
  -y, --yes              Accept the selected scope's recommended skills
  -v, --version          Print the installed CLI version
  -h, --help             Show this help

Examples
  npx agent-arche
  npx agent-arche --platform=claude --profile=general --skills-memory --yes
  npx agent-arche --platform=codex --profile=commerce --skills-only
  npx agent-arche --platform=claude --profile=general --skills-hooks --project-type=backend --project-stage=established
  npx agent-arche --platform=codex --profile=general --skills-hooks --select-skills=implement,design,git
  npx agent-arche --platform=claude --profile=commerce --subagents --all-skills --yes
  npx agent-arche --platform=codex --profile=commerce --orchestration
  npx agent-arche update
  npx agent-arche update --platform=claude

Source
  https://github.com/AshenDulsanka/agent-arche
`);
}

const args = process.argv.slice(2);
const command = args.find((arg) => !arg.startsWith("-")) ?? "install";
const knownFlags = new Set([
  "-h",
  "--help",
  "-v",
  "--version",
  "-y",
  "--yes",
  "--skills-only",
  "--skills-hooks",
  "--skills-memory",
  "--orchestration",
  "--subagents",
  "--all-skills",
  "--no-init",
]);
const unknownFlag = args.find((arg) => (
  arg.startsWith("-")
  && !knownFlags.has(arg)
  && !arg.startsWith("--select-skills=")
  && !arg.startsWith("--platform=")
  && !arg.startsWith("--profile=")
  && !arg.startsWith("--project-type=")
  && !arg.startsWith("--project-stage=")
));
const scopeFlags = ["--skills-only", "--skills-hooks", "--skills-memory", "--orchestration", "--subagents"]
  .filter((flag) => args.includes(flag));

function requestedScope(): InstallScope | undefined {
  if (args.includes("--skills-only")) return "skills";
  if (args.includes("--skills-hooks")) return "skills-hooks";
  if (args.includes("--skills-memory")) return "skills-memory";
  if (args.includes("--orchestration")) return "orchestration";
  if (args.includes("--subagents")) return "subagents";
  return undefined;
}

function requestedPlatform(): Platform | undefined {
  const value = args.find((arg) => arg.startsWith("--platform="))?.slice("--platform=".length);
  if (!value) return undefined;
  if (["claude", "codex"].includes(value)) return value as Platform;
  throw new Error(`Unknown platform: ${value}`);
}

function requestedProfile(): SetupProfile | undefined {
  const value = args.find((arg) => arg.startsWith("--profile="))?.slice("--profile=".length);
  if (!value) return undefined;
  if (["general", "commerce"].includes(value)) return value as SetupProfile;
  throw new Error(`Unknown setup profile: ${value}`);
}

function requestedSkills(): string[] | undefined {
  const explicit = args.find((arg) => arg.startsWith("--select-skills="));
  if (!explicit) return args.includes("--all-skills") ? ["*"] : undefined;
  return explicit.slice("--select-skills=".length).split(",").map((skill) => skill.trim()).filter(Boolean);
}

function requestedProjectType(): ProjectType | undefined {
  const value = args.find((arg) => arg.startsWith("--project-type="))?.slice("--project-type=".length);
  if (!value) return undefined;
  if (["full-stack", "backend", "frontend", "general"].includes(value)) return value as ProjectType;
  throw new Error(`Unknown project type: ${value}`);
}

function requestedProjectStage(): ProjectStage | undefined {
  const value = args.find((arg) => arg.startsWith("--project-stage="))?.slice("--project-stage=".length);
  if (!value) return undefined;
  if (["established", "greenfield"].includes(value)) return value as ProjectStage;
  throw new Error(`Unknown project stage: ${value}`);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log(readPackageJson().version);
} else if (args.includes("--help") || args.includes("-h") || command === "help") {
  showHelp();
} else if (unknownFlag) {
  console.error(`Unknown option: ${unknownFlag}`);
  console.error("Run npx agent-arche --help for usage.");
  process.exitCode = 1;
} else if (scopeFlags.length > 1) {
  console.error(`Choose one install scope, not: ${scopeFlags.join(", ")}`);
  console.error("Run npx agent-arche --help for usage.");
  process.exitCode = 1;
} else if (command !== "install" && command !== "update") {
  console.error(`Unknown command: ${command}`);
  console.error("Run npx agent-arche --help for usage.");
  process.exitCode = 1;
} else {
  Promise.resolve().then(() => runApp({
    force: command === "update",
    yes: args.includes("--yes") || args.includes("-y"),
    platform: requestedPlatform(),
    scope: requestedScope(),
    profile: requestedProfile(),
    projectType: requestedProjectType(),
    projectStage: requestedProjectStage(),
    selectedSkills: requestedSkills(),
    init: !args.includes("--no-init"),
  })).then(
    (code) => {
      process.exitCode = code;
    },
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Installation failed: ${message}`);
      process.exitCode = 1;
    },
  );
}
