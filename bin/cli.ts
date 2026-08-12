#!/usr/bin/env node

import { runApp } from "./App.js";
import { readPackageJson } from "./lib/utils.js";
import type { InstallScope } from "./lib/constants.js";

function showHelp(): void {
  console.log(`
agent-arche - Selective Codex skills, context, memory, and orchestration

Usage
  npx agent-arche [install] [options]
  npx agent-arche update [options]

Options
  --skills-only          Selected skills only
  --skills-hooks         Selected skills plus hooks and context tools
  --skills-memory        Selected skills, hooks, context tools, and memory
  --orchestration        Full multi-agent orchestration (high usage)
  --select-skills=a,b    Install an explicit comma-separated skill set
  --all-skills           Install every selectable skill
  -y, --yes              Accept the selected scope's recommended skills
  -v, --version          Print the installed CLI version
  -h, --help             Show this help

Examples
  npx agent-arche
  npx agent-arche --skills-only
  npx agent-arche --skills-hooks --select-skills=implement,design,git
  npx agent-arche --orchestration
  npx agent-arche update

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
  "--all-skills",
]);
const unknownFlag = args.find((arg) => (
  arg.startsWith("-")
  && !knownFlags.has(arg)
  && !arg.startsWith("--select-skills=")
));
const scopeFlags = ["--skills-only", "--skills-hooks", "--skills-memory", "--orchestration"]
  .filter((flag) => args.includes(flag));

function requestedScope(): InstallScope | undefined {
  if (args.includes("--skills-only")) return "skills";
  if (args.includes("--skills-hooks")) return "skills-hooks";
  if (args.includes("--skills-memory")) return "skills-memory";
  if (args.includes("--orchestration")) return "orchestration";
  return undefined;
}

function requestedSkills(): string[] | undefined {
  const explicit = args.find((arg) => arg.startsWith("--select-skills="));
  if (!explicit) return args.includes("--all-skills") ? ["*"] : undefined;
  return explicit.slice("--select-skills=".length).split(",").map((skill) => skill.trim()).filter(Boolean);
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
  runApp({
    force: command === "update",
    yes: args.includes("--yes") || args.includes("-y"),
    scope: requestedScope(),
    selectedSkills: requestedSkills(),
  }).then(
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
