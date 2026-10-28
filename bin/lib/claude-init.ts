import fs from "fs";
import path from "path";
import { spawn, spawnSync } from "child_process";

// Same job as Claude Code's /init, briefed for a lean result: CLAUDE.md is
// loaded into every session, so each line costs tokens on every turn.
const INIT_PROMPT = `Create CLAUDE.md at the repository root for Claude Code. It is loaded into every session, so keep it under 60 lines and include only what an agent cannot quickly infer from the code:

- one line on what the project is
- stack and runtime versions
- exact build, test, lint, typecheck, and dev commands (only ones you verified in package manifests, scripts, or docs)
- a short map of the key directories
- non-obvious conventions, constraints, and gotchas

If AGENTS.md, README, CONTRIBUTING, or docs exist, use them as sources and carry over durable instructions from AGENTS.md. Do not list every file, add generic advice, or invent commands. If the project has little code yet, write only what is known. Do not create or edit any other file.`;

const INIT_TIMEOUT_MS = 10 * 60 * 1000;
const isWindows = process.platform === "win32";

// Windows installs may expose claude as a .cmd shim, which needs a shell. Node
// deprecates passing args alongside a shell, so build one quoted command line.
function claudeCommand(args: readonly string[]): [string, string[]] {
  if (!isWindows) return ["claude", [...args]];
  const quoted = args.map((arg) => (/[\s()"]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg));
  return [["claude", ...quoted].join(" "), []];
}

export function claudeCliAvailable(): boolean {
  const [command, args] = claudeCommand(["--version"]);
  const result = spawnSync(command, args, { shell: isWindows, stdio: "ignore", timeout: 15000 });
  return result.status === 0;
}

export function claudeMdExists(cwd: string): boolean {
  return fs.existsSync(path.join(cwd, "CLAUDE.md"));
}

export function runClaudeInit(cwd: string): Promise<{ ok: boolean; detail?: string }> {
  const [command, args] = claudeCommand([
    "-p",
    "--model", "sonnet",
    // Edit rules cover every file-writing tool; anything else needing approval is denied in -p mode.
    "--allowedTools", "Read", "Glob", "Grep", "Edit(./CLAUDE.md)",
  ]);

  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, shell: isWindows, stdio: ["pipe", "ignore", "pipe"] });
    let stderr = "";
    const timer = setTimeout(() => child.kill(), INIT_TIMEOUT_MS);

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr = `${stderr}${chunk.toString("utf8")}`.slice(-2000);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ ok: false, detail: error.message });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (claudeMdExists(cwd)) resolve({ ok: true });
      else resolve({ ok: false, detail: stderr.trim().split(/\r?\n/).at(-1) || `claude exited with code ${code}` });
    });

    child.stdin?.end(INIT_PROMPT);
  });
}
