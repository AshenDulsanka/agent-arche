import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import {
  PLATFORM_META,
  SUBSCRIPTION_META,
  META_FILE,
  MODELS,
  STEP_ORDER,
  type Platform,
  type Step,
  type Subscription,
} from "./constants.js";
import type {
  ContentTransform,
  DetectedInstall,
  HeaderStepInfo,
  InstallMeta,
  OptionItem,
  PackageJsonLike,
  PlanSummary,
} from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// bin/lib/ -> bin/ -> package root
export const PACKAGE_ROOT = path.join(__dirname, "../..");

const NPM_REGISTRY_HOST = "registry.npmjs.org";
const NPM_PACKAGE_NAME = "agent-arche";
const SEMVER_LIKE = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const ALLOWED_DEST_DIRS = new Set([".github", ".claude", ".codex", ".agents"]);
const ALLOWED_DEST_FILES = new Set(["AGENTS.md", "CLAUDE.md"]);

function isSubPath(parent: string, target: string): boolean {
  const rel = path.relative(parent, target);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function isAllowedInstallPath(cwd: string, targetPath: string): boolean {
  const root = path.resolve(cwd);
  const target = path.resolve(targetPath);

  if (!isSubPath(root, target)) {
    return false;
  }

  const rel = path.relative(root, target);
  if (!rel || rel === ".") {
    return false;
  }

  const first = rel.split(path.sep)[0];
  if (!first) {
    return false;
  }

  if (ALLOWED_DEST_DIRS.has(first)) {
    return true;
  }

  return ALLOWED_DEST_FILES.has(first) && rel === first;
}

// ─── File system helpers ──────────────────────────────────────────────────────
export function countDir(src: string): number {
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      n += countDir(path.join(src, entry.name));
    } else {
      n++;
    }
  }
  return n;
}

export function copyDir(src: string, dest: string, transformFn?: ContentTransform | null): number {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      continue;
    }
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

export function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// ─── JSON helpers ─────────────────────────────────────────────────────────────
export function readPackageJson(): PackageJsonLike {
  const parsed = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8")) as Partial<PackageJsonLike>;
  return {
    version: parsed.version ?? "0.0.0",
  };
}

export function readMeta(dir: string): InstallMeta | null {
  const file = path.join(dir, META_FILE);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<InstallMeta>;
    if (typeof data.version !== "string") {
      return null;
    }
    return {
      version: data.version,
      installedAt: typeof data.installedAt === "string" ? data.installedAt : "Unknown",
      source: typeof data.source === "string" ? data.source : "Unknown",
      sourceType: typeof data.sourceType === "string" ? data.sourceType : "Unknown",
      platform: (data.platform as Platform) ?? "copilot",
      subscription:
        data.subscription === "auto" ||
        data.subscription === "student" ||
        data.subscription === "pro" ||
        data.subscription === "pro+"
          ? data.subscription
          : undefined,
      hash: typeof data.hash === "string" ? data.hash : null,
    };
  } catch {
    return null;
  }
}

export function writeMeta(dir: string, fields: InstallMeta): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, META_FILE), JSON.stringify(fields, null, 2) + "\n");
}

export function detectInstalledPlatform(cwd: string): DetectedInstall | null {
  const candidates: Array<{ platform: Platform; metaDir: string }> = [
    { platform: "copilot", metaDir: path.join(cwd, ".github") },
    { platform: "claude", metaDir: path.join(cwd, ".claude") },
    { platform: "codex", metaDir: path.join(cwd, ".codex") },
  ];

  for (const candidate of candidates) {
    const meta = readMeta(candidate.metaDir);
    if (!meta) {
      continue;
    }

    const platform = meta.platform ?? candidate.platform;
    const subscription = platform === "copilot" ? (meta.subscription ?? "auto") : "auto";

    return {
      platform,
      subscription,
      meta,
      metaDir: candidate.metaDir,
    };
  }

  return null;
}

// ─── Network ──────────────────────────────────────────────────────────────────
function fetchNpmJson(pathname: string, timeoutMs = 4000): Promise<unknown | null> {
  return new Promise((resolve: (value: unknown | null) => void) => {
    const MAX_RESPONSE_BYTES = 256 * 1024;
    const allowedPath = pathname === "latest" || SEMVER_LIKE.test(pathname);
    if (!allowedPath) {
      resolve(null);
      return;
    }

    const endpoint = new URL(`https://${NPM_REGISTRY_HOST}/${NPM_PACKAGE_NAME}/${encodeURIComponent(pathname)}`);
    let settled = false;
    const finish = (value: unknown | null) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };

    const timer = setTimeout(() => {
      req.destroy();
      finish(null);
    }, timeoutMs);

    const req = https.get(endpoint, { headers: { Accept: "application/json" } }, (res) => {
      let data = "";
      let bytes = 0;
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => {
        bytes += Buffer.byteLength(chunk, "utf8");
        if (bytes > MAX_RESPONSE_BYTES) {
          req.destroy();
          finish(null);
          return;
        }
        data += chunk;
      });
      res.on("end", () => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          finish(null);
          return;
        }

        const contentType = Array.isArray(res.headers["content-type"])
          ? res.headers["content-type"].join(";")
          : (res.headers["content-type"] ?? "");
        if (!contentType.includes("application/json")) {
          finish(null);
          return;
        }

        try {
          finish(JSON.parse(data) as unknown);
        } catch {
          finish(null);
        }
      });
      res.on("error", () => finish(null));
    });

    req.on("error", () => finish(null));
    req.on("timeout", () => {
      req.destroy();
      finish(null);
    });
    req.setTimeout(timeoutMs);
  });
}

export function fetchNpmHash(version: string): Promise<string | null> {
  if (!SEMVER_LIKE.test(version)) {
    return Promise.resolve(null);
  }

  return fetchNpmJson(version).then((json) => {
    const record = json as { dist?: { integrity?: string } } | null;
    const integrity = record?.dist?.integrity;
    if (typeof integrity !== "string") {
      return null;
    }
    return integrity.length <= 256 ? integrity : null;
  });
}

export function fetchNpmLatestVersion(): Promise<string | null> {
  return fetchNpmJson("latest").then((json) => {
    const record = json as { version?: string } | null;
    if (typeof record?.version !== "string") {
      return null;
    }
    return SEMVER_LIKE.test(record.version) ? record.version : null;
  });
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatMode(force: boolean): "update" | "install" {
  return force ? "update" : "install";
}

// ─── Agent transform ──────────────────────────────────────────────────────────
export function makeAgentTransform(subscription: Subscription): ContentTransform | null {
  if (subscription === "auto") {
    return (content: string) => {
      const modelList = [MODELS.OPUS, MODELS.SONNET, MODELS.GPT5, MODELS.CODEX, MODELS.GEMINI];
      let transformed = content;
      for (const model of modelList) {
        transformed = transformed.replace(new RegExp(escapeRegex(model), "g"), MODELS.AUTO);
      }
      return transformed;
    };
  }

  if (subscription === "student") {
    return (content: string) =>
      content
        .replace(new RegExp(escapeRegex(MODELS.OPUS), "g"), MODELS.GPT5)
        .replace(new RegExp(escapeRegex(MODELS.SONNET), "g"), MODELS.CODEX);
  }
  if (subscription === "pro") {
    return (content: string) => content.replace(new RegExp(escapeRegex(MODELS.OPUS), "g"), MODELS.SONNET);
  }
  return null;
}

// ─── Plan helpers ─────────────────────────────────────────────────────────────
export function summarizePlan(
  plan: { steps: Array<{ label: string; src: string; destDir?: string; destFile?: string }> } | null,
  platform: Platform,
  subscription: Subscription
): PlanSummary | null {
  if (!plan || !platform) return null;
  let total = 0;
  const steps: PlanSummary["steps"] = [];
  const missing: string[] = [];
  for (const step of plan.steps) {
    if (!step.src || !fs.existsSync(step.src)) {
      missing.push(step.label);
      continue;
    }
    if (step.destDir) {
      const count = countDir(step.src);
      total += count;
      steps.push({ label: step.label, count, kind: "dir" });
    } else if (step.destFile) {
      total += 1;
      steps.push({ label: step.label, count: 1, kind: "file" });
    }
  }
  const meta = PLATFORM_META[platform];
  const notes = [...meta.capabilities] as string[];
  if (platform === "copilot") {
    notes.push(...SUBSCRIPTION_META[subscription].details);
  }
  return { total, steps, missing, notes };
}

export function getStepIndex(step: string, platform: Platform): HeaderStepInfo {
  const normalized = step === "existing" || step === "confirm" ? "preview" : step;
  const normalizedStep: Step = STEP_ORDER.includes(normalized as Step) ? (normalized as Step) : "platform";
  const visibleSteps = (platform === "copilot"
    ? STEP_ORDER
    : STEP_ORDER.filter((s) => s !== "subscription")) as Step[];
  const currentIndex = Math.max(visibleSteps.indexOf(normalizedStep), 0);
  return { visibleSteps, currentIndex };
}

export function getPlatformOptions(): OptionItem[] {
  return Object.entries(PLATFORM_META).map(([value, meta]) => ({
    value,
    label: meta.name,
    accent: meta.accent,
    description: meta.destination,
    details: meta.capabilities,
    note: meta.note,
  }));
}

export function getSubscriptionOptions(): OptionItem[] {
  return Object.entries(SUBSCRIPTION_META).map(([value, meta]) => ({
    value,
    label: meta.label,
    accent: meta.accent,
    description: meta.summary,
    details: meta.details,
  }));
}
