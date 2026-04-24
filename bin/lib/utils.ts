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
export function fetchNpmHash(version: string): Promise<string | null> {
  return new Promise((resolve: (value: string | null) => void) => {
    const req = https.get("https://registry.npmjs.org/agent-arche", { timeout: 5000 }, (res) => {
      let data = "";
      res.on("data", (chunk: Buffer) => { data += chunk.toString("utf8"); });
      res.on("end", () => {
        try {
          const json = JSON.parse(data) as {
            versions?: Record<string, { dist?: { integrity?: string } }>;
          };
          resolve(json.versions?.[version]?.dist?.integrity ?? null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
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
