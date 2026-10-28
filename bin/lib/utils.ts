import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import {
  INSTALL_SCOPE_META,
  META_FILE,
  SETUP_PROFILE_META,
  selectableSkillsForProfile,
  type InstallScope,
  type Platform,
  type SetupProfile,
} from "./constants.js";
import type {
  ContentTransform,
  DetectedInstall,
  InstallMeta,
  PackageJsonLike,
  PathFilter,
  PlanSummary,
} from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// bin/lib/ -> bin/ -> package root
export const PACKAGE_ROOT = path.join(__dirname, "../..");

const NPM_REGISTRY_HOST = "registry.npmjs.org";
const NPM_PACKAGE_NAME = "agent-arche";
const SEMVER_LIKE = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const ALLOWED_DEST_DIRS = new Set([".codex", ".agents", ".claude", ".mcp.json", "memory"]);

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

  return false;
}

// ─── File system helpers ──────────────────────────────────────────────────────
export function countDir(src: string, exclude?: PathFilter, prefix = ""): number {
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const rel = `${prefix}${entry.name}`;
    if (exclude?.(rel)) continue;
    if (entry.isDirectory()) {
      n += countDir(path.join(src, entry.name), exclude, `${rel}/`);
    } else {
      n++;
    }
  }
  return n;
}

export function copyDir(
  src: string,
  dest: string,
  transformFn?: ContentTransform | null,
  exclude?: PathFilter,
  prefix = "",
): number {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      continue;
    }
    const rel = `${prefix}${entry.name}`;
    if (exclude?.(rel)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, transformFn, exclude, `${rel}/`);
    } else if (transformFn && entry.name.endsWith(".md")) {
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

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function isJsonObject(value: JsonValue | undefined): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Hook groups are identified by their commands so an update replaces the
// previous definition instead of registering the same hook twice.
function arrayItemKey(value: JsonValue): string {
  if (isJsonObject(value) && Array.isArray(value.hooks)) {
    return `hooks:${value.hooks.map((hook) => (isJsonObject(hook) ? String(hook.command) : "")).join("|")}`;
  }
  return JSON.stringify(value);
}

function mergeJson(base: JsonValue | undefined, incoming: JsonValue): JsonValue {
  if (Array.isArray(base) && Array.isArray(incoming)) {
    const replacements = new Map(incoming.map((item) => [arrayItemKey(item), item]));
    const merged = base.map((item) => {
      const key = arrayItemKey(item);
      const replacement = replacements.get(key);
      replacements.delete(key);
      return replacement ?? item;
    });
    return [...merged, ...replacements.values()];
  }
  if (isJsonObject(base) && isJsonObject(incoming)) {
    const merged = { ...base };
    for (const [key, value] of Object.entries(incoming)) merged[key] = mergeJson(base[key], value);
    return merged;
  }
  return incoming;
}

// Returns false when the destination exists but is not valid JSON; it is left untouched.
export function mergeJsonFile(src: string, dest: string): boolean {
  const incoming = JSON.parse(fs.readFileSync(src, "utf8")) as JsonValue;
  let existing: JsonValue | undefined;
  if (fs.existsSync(dest)) {
    try {
      existing = JSON.parse(fs.readFileSync(dest, "utf8")) as JsonValue;
    } catch {
      return false;
    }
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, `${JSON.stringify(mergeJson(existing, incoming), null, 2)}\n`);
  return true;
}
export interface LegacyMemoryMigrationResult {
  from: string;
  count: number;
}

export function migrateLegacyMemoryVault(
  cwd: string,
  destDir: string,
  legacyMemoryDirs: readonly string[]
): LegacyMemoryMigrationResult | null {
  if (fs.existsSync(destDir)) {
    return null;
  }

  for (const legacyDir of legacyMemoryDirs) {
    const sourceDir = path.join(cwd, legacyDir);
    if (!fs.existsSync(sourceDir)) {
      continue;
    }

    fs.mkdirSync(path.dirname(destDir), { recursive: true });
    fs.renameSync(sourceDir, destDir);
    return {
      from: legacyDir.replace(/\\/g, "/"),
      count: countDir(destDir),
    };
  }

  return null;
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
    const rawScope = data.scope as string | undefined;
    const scope: InstallScope = rawScope && rawScope in INSTALL_SCOPE_META
      ? rawScope as InstallScope
      : "skills-memory";
    const rawProfile = data.profile as string | undefined;
    const profile: SetupProfile = rawProfile && rawProfile in SETUP_PROFILE_META
      ? rawProfile as SetupProfile
      : "general";
    const selectedSkills = Array.isArray(data.selectedSkills)
      ? data.selectedSkills.filter((skill): skill is string => typeof skill === "string")
      : selectableSkillsForProfile(profile);
    return {
      version: data.version,
      installedAt: typeof data.installedAt === "string" ? data.installedAt : "Unknown",
      source: typeof data.source === "string" ? data.source : "Unknown",
      sourceType: typeof data.sourceType === "string" ? data.sourceType : "Unknown",
      scope,
      profile,
      platform: data.platform === "claude" ? "claude" : "codex",
      hash: typeof data.hash === "string" ? data.hash : null,
      selectedSkills,
    };
  } catch {
    return null;
  }
}

export function writeMeta(dir: string, fields: InstallMeta): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, META_FILE), JSON.stringify(fields, null, 2) + "\n");
}

// Returns at most one install per platform; a project may have both.
export function detectInstalls(cwd: string): DetectedInstall[] {
  const candidates: Array<{ platform: Platform; metaDir: string }> = [
    { platform: "claude", metaDir: path.join(cwd, ".claude") },
    { platform: "codex", metaDir: path.join(cwd, ".codex") },
    { platform: "codex", metaDir: path.join(cwd, ".agents") },
  ];

  const found = new Map<Platform, DetectedInstall>();
  for (const candidate of candidates) {
    if (found.has(candidate.platform)) continue;
    const meta = readMeta(candidate.metaDir);
    if (!meta) continue;
    found.set(candidate.platform, {
      meta: { ...meta, platform: candidate.platform },
      metaDir: candidate.metaDir,
    });
  }

  return [...found.values()];
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
// ─── Plan helpers ─────────────────────────────────────────────────────────────
export function summarizePlan(
  plan: { steps: Array<{ label: string; src: string; destDir?: string; destFile?: string; exclude?: PathFilter }> } | null,
): PlanSummary | null {
  if (!plan) return null;
  let total = 0;
  const steps: PlanSummary["steps"] = [];
  const missing: string[] = [];
  for (const step of plan.steps) {
    if (!step.src || !fs.existsSync(step.src)) {
      missing.push(step.label);
      continue;
    }
    if (step.destDir) {
      const count = countDir(step.src, step.exclude);
      total += count;
      steps.push({ label: step.label, count, kind: "dir" });
    } else if (step.destFile) {
      total += 1;
      steps.push({ label: step.label, count: 1, kind: "file" });
    }
  }
  return { total, steps, missing };
}
