#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import readline from "readline";
import { App } from "./App.js";
import { readPackageJson } from "./lib/utils.js";

const h = React.createElement;

// ─── Entry point ─────────────────────────────────────────────────────────────
// All logic lives in App.js and bin/lib / bin/components.
// Edit bin/lib/constants.js to change any visible UI text.

function showVersion() {
  const pkg = readPackageJson();
  console.log(pkg.version);
}

function showHelp() {
  console.log(`
  ◆ agent-arche - Codex skills and project context

  Usage
    npx agent-arche             Install files for your AI assistant
    npx agent-arche install     Same as above
    npx agent-arche update      Update to latest (overwrites existing files)
    npx agent-arche --version   Print version
    npx agent-arche --help      Show this message

  Install destination
    Codex  ->  .agents/skills/ with optional .codex/ hooks and memory/

  What gets installed
    config.toml     Codex runtime and MCP server configuration
    skills/         Reusable task workflows and references
    hooks/          Safety hooks (session-start, pre-tool, changelog)

  Install scopes
    Skills + hooks + memory
                         Shared skills plus hooks, config, and root memory
    Skills only          Shared skills only, without hooks or memory

  Verify integrity
    npm view agent-arche dist.integrity
    Compare with hash in agent-arche.json inside your install directory.

  Source
    https://github.com/AshenDulsanka/agent-arche
`);
}

const [, , command] = process.argv;

if (command === "--version" || command === "-v") {
  showVersion();
  process.exit(0);
} else if (command === "--help" || command === "-h" || command === "help") {
  showHelp();
  process.exit(0);
} else if (command === undefined || command === "install" || command === "update") {
  const force = command === "update";
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  // waitUntilExit() ensures process.exit is called once ink unmounts,
  // so the CLI exits automatically after install, cancel, or 'n'.
  const { waitUntilExit } = render(h(App, { force }));
  waitUntilExit().then(() => process.exit(0));
} else {
  console.error(`\n  ✗ Unknown command: ${command}`);
  console.error("  Run npx agent-arche --help for usage.\n");
  process.exit(1);
}
