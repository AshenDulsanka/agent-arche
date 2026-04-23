#!/usr/bin/env node

// src/cli.jsx
import React, { useState, useEffect } from "react";
import { render, Text, Box, useApp, Static, Newline } from "ink";
import { Select, Spinner } from "@inkjs/ui";
import fs from "fs";
import path from "path";
import https from "https";
import readline from "readline";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PACKAGE_ROOT = path.join(__dirname, "..");
var META_FILE = "agent-arche.json";
function countDir(src) {
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countDir(path.join(src, entry.name));
    else n++;
  }
  return n;
}
function copyDir(src, dest, transformFn) {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, transformFn);
    } else if (transformFn) {
      const content = fs.readFileSync(srcPath, "utf8");
      fs.writeFileSync(destPath, transformFn(content, srcPath));
      count++;
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
function readPackageJson() {
  return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8"));
}
function readMeta(dir) {
  const file = path.join(dir, META_FILE);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}
function writeMeta(dir, fields) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, META_FILE),
    JSON.stringify(fields, null, 2) + "\n"
  );
}
function fetchNpmHash(version) {
  return new Promise((resolve) => {
    const req = https.get("https://registry.npmjs.org/agent-arche", { timeout: 5e3 }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.versions?.[version]?.dist?.integrity ?? null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
var SONNET_MODEL = "Claude Sonnet 4.6 (copilot)";
var OPUS_MODEL = "Claude Opus 4.7 (copilot)";
var GPT5_MODEL = "GPT-5.4 (copilot)";
var CODEX_MODEL = "GPT-5.3-Codex (copilot)";
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function makeAgentTransform(subscription) {
  if (subscription === "student") {
    return (content) => content.replace(new RegExp(escapeRegex(OPUS_MODEL), "g"), GPT5_MODEL).replace(new RegExp(escapeRegex(SONNET_MODEL), "g"), CODEX_MODEL);
  }
  if (subscription === "pro") {
    return (content) => content.replace(new RegExp(escapeRegex(OPUS_MODEL), "g"), SONNET_MODEL);
  }
  return null;
}
function getCopilotPlan(cwd, subscription) {
  const dest = path.join(cwd, ".github");
  const src = path.join(PACKAGE_ROOT, "copilot");
  const agentTransform = makeAgentTransform(subscription);
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".github/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents"), transform: agentTransform },
      { label: ".github/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".github/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
      { label: ".github/prompts/", src: path.join(src, "prompts"), destDir: path.join(dest, "prompts") },
      { label: ".github/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
      { label: ".github/memory/", src: path.join(PACKAGE_ROOT, "memory"), destDir: path.join(dest, "memory") }
    ],
    nextSteps: [
      `Commit .github/ to your repo`,
      `Open Copilot Chat and use @Orchestrator to start`,
      `Seed memory: ask Orchestrator to use the analyze-codebase skill`
    ]
  };
}
function getClaudePlan(cwd) {
  const dest = path.join(cwd, ".claude");
  const src = path.join(PACKAGE_ROOT, "claude");
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".claude/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents") },
      { label: ".claude/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
      { label: ".claude/commands/", src: path.join(src, "commands"), destDir: path.join(dest, "commands") },
      { label: ".claude/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".claude/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(dest, "skills") },
      { label: ".claude/memory/", src: path.join(PACKAGE_ROOT, "memory"), destDir: path.join(dest, "memory") },
      { label: ".claude/settings.json", src: path.join(src, "settings.json"), destFile: path.join(dest, "settings.json") },
      { label: "CLAUDE.md", src: path.join(src, "CLAUDE.md"), destFile: path.join(cwd, "CLAUDE.md"), skipIfExists: true }
    ],
    nextSteps: [
      `Commit .claude/ and CLAUDE.md to your repo`,
      `Run claude to start Claude Code`,
      `Use @orchestrator agent to begin`,
      `Seed memory: ask Orchestrator to use the analyze-codebase skill`
    ]
  };
}
function getCodexPlan(cwd) {
  const dest = path.join(cwd, ".codex");
  const src = path.join(PACKAGE_ROOT, "codex");
  return {
    dest,
    metaDir: dest,
    steps: [
      { label: ".codex/agents/", src: path.join(src, "agents"), destDir: path.join(dest, "agents") },
      { label: ".codex/config.toml", src: path.join(src, "config.toml"), destFile: path.join(dest, "config.toml") },
      { label: ".codex/hooks/", src: path.join(src, "hooks"), destDir: path.join(dest, "hooks") },
      { label: ".codex/rules/", src: path.join(src, "rules"), destDir: path.join(dest, "rules") },
      { label: ".codex/instructions/", src: path.join(src, "instructions"), destDir: path.join(dest, "instructions") },
      { label: ".codex/memory/", src: path.join(PACKAGE_ROOT, "memory"), destDir: path.join(dest, "memory") },
      { label: ".agents/skills/", src: path.join(PACKAGE_ROOT, "skills"), destDir: path.join(cwd, ".agents", "skills") },
      { label: ".codex/hooks.json", src: path.join(src, "hooks.json"), destFile: path.join(dest, "hooks.json") },
      { label: "AGENTS.md", src: path.join(src, "AGENTS.md"), destFile: path.join(cwd, "AGENTS.md"), skipIfExists: true }
    ],
    nextSteps: [
      `Commit .codex/ and AGENTS.md to your repo`,
      `Run codex from the repo root and ask it to use the orchestrator agent`,
      `Seed memory: ask Orchestrator to use the analyze-codebase skill`
    ]
  };
}
function ConfirmPrompt({ message, onConfirm }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const onKeypress = (_, key) => {
      if (key.name === "y" || key.name === "return") {
        onConfirm(true);
      } else if (key.name === "n") {
        onConfirm(false);
      }
    };
    process.stdin.on("keypress", onKeypress);
    return () => process.stdin.off("keypress", onKeypress);
  }, [onConfirm]);
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { bold: true }, "? "), /* @__PURE__ */ React.createElement(Text, null, message, " "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "(Y/n) \u203A ", value));
}
function App({ force = false }) {
  const { exit } = useApp();
  const pkg = readPackageJson();
  const cwd = process.cwd();
  const [step, setStep] = useState("platform");
  const [platform, setPlatform] = useState(null);
  const [subscription, setSubscription] = useState("pro+");
  const [plan, setPlan] = useState(null);
  const [existing, setExisting] = useState(null);
  const [aborted, setAborted] = useState(false);
  const [installSteps, setInstallSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [hash, setHash] = useState(null);
  const [fetchingHash, setFetchingHash] = useState(false);
  const [missing, setMissing] = useState([]);
  const [previewFiles, setPreviewFiles] = useState(null);
  const onPlatformSelect = (value) => {
    setPlatform(value);
    if (value === "copilot") {
      setStep("subscription");
    } else {
      preparePlan(value, "pro+");
    }
  };
  const onSubscriptionSelect = (value) => {
    setSubscription(value);
    preparePlan(platform, value);
  };
  const preparePlan = async (plat, sub) => {
    let p;
    if (plat === "copilot") p = getCopilotPlan(cwd, sub);
    else if (plat === "claude") p = getClaudePlan(cwd);
    else p = getCodexPlan(cwd);
    setPlan(p);
    const ex = readMeta(p.metaDir);
    setExisting(ex);
    if (ex && ex.platform === plat && !force) {
      setStep("existing");
      setTimeout(() => exit(), 100);
      return;
    }
    setStep("preview");
  };
  useEffect(() => {
    if (step === "preview" && plan) {
      let total = 0;
      const calculatedSteps = [];
      for (const stepInfo of plan.steps) {
        if (!stepInfo.src || !fs.existsSync(stepInfo.src)) continue;
        if (stepInfo.destDir) {
          const n = countDir(stepInfo.src);
          total += n;
          calculatedSteps.push({ label: stepInfo.label, count: n });
        } else if (stepInfo.destFile) {
          total += 1;
          calculatedSteps.push({ label: stepInfo.label, count: null });
        }
      }
      setPreviewFiles({ steps: calculatedSteps, total });
      setStep("confirm");
    }
  }, [step, plan]);
  useEffect(() => {
    if (step === "install" && plan) {
      const runInstall = async () => {
        const results = [];
        let total = 0;
        const missingItems = [];
        for (let i = 0; i < plan.steps.length; i++) {
          setCurrentStepIdx(i);
          const stepInfo = plan.steps[i];
          if (!stepInfo.src || !fs.existsSync(stepInfo.src)) {
            missingItems.push(stepInfo.label);
            continue;
          }
          await sleep(500);
          let countMsg = "";
          if (stepInfo.destDir) {
            if (stepInfo.skipIfExists && fs.existsSync(stepInfo.destDir)) {
              countMsg = "skipped (already exists)";
            } else {
              const count = copyDir(stepInfo.src, stepInfo.destDir, stepInfo.transform);
              total += count;
              countMsg = `${count} file${count !== 1 ? "s" : ""}`;
            }
          } else if (stepInfo.destFile) {
            if (stepInfo.skipIfExists && fs.existsSync(stepInfo.destFile)) {
              countMsg = "skipped (already exists)";
            } else {
              copyFile(stepInfo.src, stepInfo.destFile);
              total++;
            }
          }
          results.push({ label: stepInfo.label, msg: countMsg });
          setInstallSteps([...results]);
          await sleep(60);
        }
        setTotalFiles(total);
        setMissing(missingItems);
        setCurrentStepIdx(-1);
        setFetchingHash(true);
        const h = await fetchNpmHash(pkg.version);
        setHash(h);
        setFetchingHash(false);
        writeMeta(plan.metaDir, {
          version: pkg.version,
          installedAt: (/* @__PURE__ */ new Date()).toISOString(),
          source: "AshenDulsanka/agent-arche",
          sourceType: "npm",
          platform,
          hash: h ?? null
        });
        setStep("done");
        setTimeout(() => exit(), 100);
      };
      runInstall();
    }
  }, [step, plan]);
  return /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", paddingY: 1, paddingX: 2 }, /* @__PURE__ */ React.createElement(Box, { marginBottom: 1 }, /* @__PURE__ */ React.createElement(Text, { color: "cyan" }, "\u25C6 "), /* @__PURE__ */ React.createElement(Text, { bold: true }, "agent-arche "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "v", pkg.version)), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "Multi-platform AI agent orchestration"), /* @__PURE__ */ React.createElement(Newline, null), step === "platform" && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column" }, /* @__PURE__ */ React.createElement(Text, { bold: true }, "? Which AI assistant are you installing for?"), /* @__PURE__ */ React.createElement(Box, { marginLeft: 2, marginTop: 1 }, /* @__PURE__ */ React.createElement(
    Select,
    {
      options: [
        { label: "GitHub Copilot", value: "copilot" },
        { label: "Claude Code (beta)", value: "claude" },
        { label: "Codex CLI", value: "codex" }
      ],
      onChange: onPlatformSelect
    }
  ))), step !== "platform" && platform && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, { bold: true }, "Which AI assistant are you installing for? "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, platform === "copilot" ? "GitHub Copilot" : platform === "claude" ? "Claude Code" : "Codex CLI")), step === "subscription" && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1 }, /* @__PURE__ */ React.createElement(Text, { bold: true }, "? Which GitHub Copilot subscription do you have?"), /* @__PURE__ */ React.createElement(Box, { marginLeft: 2, marginTop: 1 }, /* @__PURE__ */ React.createElement(
    Select,
    {
      options: [
        { label: "Student", value: "student" },
        { label: "Pro", value: "pro" },
        { label: "Pro+", value: "pro+" }
      ],
      onChange: onSubscriptionSelect
    }
  ))), step !== "platform" && step !== "subscription" && platform === "copilot" && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, { bold: true }, "Which GitHub Copilot subscription do you have? "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, subscription === "pro+" ? "Pro+" : subscription === "pro" ? "Pro" : "Student")), step === "existing" && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1 }, /* @__PURE__ */ React.createElement(Text, { color: "yellow" }, "\u25C6 "), /* @__PURE__ */ React.createElement(Text, { bold: true }, "agent-arche "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "v", existing?.version, " is already installed for "), /* @__PURE__ */ React.createElement(Text, { bold: true }, platform), /* @__PURE__ */ React.createElement(Text, null, "."), /* @__PURE__ */ React.createElement(Newline, null), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "Run "), /* @__PURE__ */ React.createElement(Text, { bold: true }, "npx agent-arche update "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "to upgrade to the latest version.")), (step === "confirm" || step === "install" || step === "done" || aborted) && previewFiles && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1, marginBottom: 1 }, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "The following will be ", force ? "update" : "install", "ed for "), /* @__PURE__ */ React.createElement(Text, { bold: true }, platform), /* @__PURE__ */ React.createElement(Newline, null), previewFiles.steps.map((s, i) => /* @__PURE__ */ React.createElement(Box, { key: i, marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "\u2192 "), /* @__PURE__ */ React.createElement(Text, { color: "cyan" }, s.label, "  "), s.count !== null && /* @__PURE__ */ React.createElement(Text, { dimColor: true }, s.count, " files"))), /* @__PURE__ */ React.createElement(Newline, null), /* @__PURE__ */ React.createElement(Box, { marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "~", previewFiles.total, " files total"))), step === "confirm" && /* @__PURE__ */ React.createElement(
    ConfirmPrompt,
    {
      message: `${force ? "Update" : "Install"} now?`,
      onConfirm: (val) => {
        if (val) setStep("install");
        else {
          setAborted(true);
          setTimeout(() => exit(), 100);
        }
      }
    }
  ), aborted && /* @__PURE__ */ React.createElement(Box, { marginTop: 1 }, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "Aborted.")), (step === "install" || step === "done") && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1 }, /* @__PURE__ */ React.createElement(Static, { items: installSteps }, (s, i) => /* @__PURE__ */ React.createElement(Box, { key: i, marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, { color: "cyan" }, s.label, "  "), s.msg && /* @__PURE__ */ React.createElement(Text, { dimColor: true }, s.msg))), step === "install" && currentStepIdx >= 0 && /* @__PURE__ */ React.createElement(Box, { marginLeft: 2 }, /* @__PURE__ */ React.createElement(Spinner, { type: "dots" }), /* @__PURE__ */ React.createElement(Text, { color: "cyan" }, " ", plan.steps[currentStepIdx]?.label)), fetchingHash && /* @__PURE__ */ React.createElement(Box, { marginLeft: 2 }, /* @__PURE__ */ React.createElement(Spinner, { type: "dots" }), /* @__PURE__ */ React.createElement(Text, null, " Fetching integrity hash from npm\u2026")), step === "done" && hash && /* @__PURE__ */ React.createElement(Box, { marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, null, "Hash verified  "), /* @__PURE__ */ React.createElement(Text, { dimColor: true }, hash.slice(0, 40), "\u2026")), step === "done" && hash === null && /* @__PURE__ */ React.createElement(Box, { marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, null, "Hash unavailable (offline or not yet published)"))), step === "done" && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1 }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { color: "green" }, "\u2713 "), /* @__PURE__ */ React.createElement(Text, { bold: true }, totalFiles, " files "), /* @__PURE__ */ React.createElement(Text, null, "installed for "), /* @__PURE__ */ React.createElement(Text, { bold: true }, platform)), /* @__PURE__ */ React.createElement(Newline, null), plan.nextSteps.map((s, i) => /* @__PURE__ */ React.createElement(Box, { key: i, marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, i + 1, ". "), /* @__PURE__ */ React.createElement(Text, null, s))), hash && /* @__PURE__ */ React.createElement(Box, { flexDirection: "column", marginTop: 1, marginLeft: 2 }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "Verify integrity: "), /* @__PURE__ */ React.createElement(Text, { color: "cyan" }, "npm view agent-arche dist.integrity")), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, { dimColor: true }, "Compare with hash in "), /* @__PURE__ */ React.createElement(Text, { bold: true }, path.relative(cwd, path.join(plan.metaDir, META_FILE))))), missing.length > 0 && /* @__PURE__ */ React.createElement(Box, { marginTop: 1, marginLeft: 2 }, /* @__PURE__ */ React.createElement(Text, { color: "yellow" }, "! "), /* @__PURE__ */ React.createElement(Text, null, "Skipped (not found): ", missing.join(", ")))));
}
function showVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8"));
  console.log(pkg.version);
}
function showHelp() {
  console.log(`
  \u25C6 agent-arche \u2014 Multi-platform AI agent orchestration

  Usage
    npx agent-arche             Install files for your AI assistant
    npx agent-arche install     Same as above
    npx agent-arche update      Update to latest (overwrites existing files)
    npx agent-arche --version   Print version
    npx agent-arche --help      Show this message

  Supported platforms
    GitHub Copilot  \u2192  .github/
    Claude Code     \u2192  .claude/ + CLAUDE.md
    Codex CLI       \u2192  .codex/ + .agents/skills/ + AGENTS.md

  What gets installed
    agents/         Specialist AI agent definitions
    config.toml     Codex runtime and MCP server configuration
    skills/         Domain knowledge reference files
    hooks/          Safety hooks (session-start, pre-tool, changelog)
    instructions/   File-type guidance that Codex agents load by matching globs
    rules/          Extra Codex CLI safety rules

  Verify integrity
    npm view agent-arche dist.integrity
    Compare with hash in agent-arche.json inside your install directory.

  Source
    https://github.com/AshenDulsanka/agent-arche
`);
}
var [, , command] = process.argv;
if (command === "--version" || command === "-v") {
  showVersion();
  process.exit(0);
} else if (command === "--help" || command === "-h" || command === "help") {
  showHelp();
  process.exit(0);
} else if (command === void 0 || command === "install" || command === "update") {
  const force = command === "update";
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  render(/* @__PURE__ */ React.createElement(App, { force }));
} else {
  console.error(`
  \u2717 Unknown command: ${command}`);
  console.error(`  Run npx agent-arche --help for usage.
`);
  process.exit(1);
}
