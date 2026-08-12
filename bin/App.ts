import fs from "fs";
import path from "path";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  groupMultiselect,
  note,
  outro,
  select,
  spinner,
} from "@clack/prompts";
import pc from "picocolors";
import {
  DEFAULT_SKILLS_BY_SCOPE,
  INSTALL_SCOPE_META,
  ORCHESTRATION_SKILL,
  SELECTABLE_SKILLS,
  SKILL_GROUPS,
  type InstallScope,
  type Platform,
} from "./lib/constants.js";
import { getCodexPlan } from "./lib/plans.js";
import type { InstallMeta, InstallPlan, InstallStepResult } from "./lib/types.js";
import {
  copyDir,
  copyFile,
  detectInstalledPlatform,
  fetchNpmHash,
  fetchNpmLatestVersion,
  isAllowedInstallPath,
  migrateLegacyMemoryVault,
  readMeta,
  readPackageJson,
  summarizePlan,
  writeMeta,
} from "./lib/utils.js";

const platform: Platform = "codex";

export interface AppOptions {
  force?: boolean;
  yes?: boolean;
  scope?: InstallScope;
  selectedSkills?: readonly string[];
}

function stopOnCancel(value: unknown): value is symbol {
  if (!isCancel(value)) return false;
  cancel("No files were changed.");
  return true;
}

function relativeTarget(cwd: string, target: string): string {
  const relative = path.relative(cwd, target).replace(/\\/g, "/");
  return relative || ".";
}

function formatPlan(plan: InstallPlan): string {
  const preview = summarizePlan(plan);
  if (!preview) return "Nothing to install.";

  const targets = preview.steps.map((step) => {
    const unit = step.count === 1 ? "file" : "files";
    return `${pc.cyan("◆")} ${step.label} ${pc.dim(`(${step.count} ${unit})`)}`;
  });

  if (preview.missing.length > 0) {
    targets.push(pc.yellow(`Missing: ${preview.missing.join(", ")}`));
  }

  return targets.join("\n");
}

function formatResults(results: InstallStepResult[]): string {
  return results
    .map((result) => `${pc.green("◆")} ${result.label} ${pc.dim(result.msg)}`)
    .join("\n");
}

function showExisting(existing: InstallMeta): void {
  log.warn(`Agent Arche v${existing.version} is already installed with this scope.`);
  note("Run npx agent-arche update to replace the installed files.", "Existing installation");
  outro("No files were changed.");
}

async function chooseScope(initialScope?: InstallScope): Promise<InstallScope | null> {
  if (initialScope) return initialScope;

  const answer = await select<InstallScope>({
    message: "What do you want to install?",
    initialValue: "skills-memory",
    options: Object.entries(INSTALL_SCOPE_META).map(([value, meta]) => ({
      value: value as InstallScope,
      label: meta.label,
      hint: meta.summary,
    })),
  });

  return stopOnCancel(answer) ? null : answer;
}

function normalizeSkills(skills: readonly string[]): string[] {
  if (skills.includes("*")) return [...SELECTABLE_SKILLS];
  const allowed = new Set<string>(SELECTABLE_SKILLS);
  return [...new Set(skills.filter((skill) => allowed.has(skill)))];
}

async function chooseSkills(
  scope: InstallScope,
  initialSkills?: readonly string[],
  yes = false,
): Promise<string[] | null> {
  const defaults = DEFAULT_SKILLS_BY_SCOPE[scope];
  if (initialSkills) {
    const normalized = normalizeSkills(initialSkills);
    const unknown = initialSkills.filter((skill) => (
      skill !== "*"
      && !(scope === "orchestration" && skill === ORCHESTRATION_SKILL)
      && !normalized.includes(skill)
    ));
    if (unknown.length > 0) throw new Error(`Unknown skill selection: ${unknown.join(", ")}`);
    return normalized;
  }
  if (yes) return [...defaults];

  const options = Object.fromEntries(
    Object.entries(SKILL_GROUPS).map(([group, skills]) => [
      group,
      skills.map((skill) => ({ ...skill })),
    ]),
  );
  const answer = await groupMultiselect<string>({
    message: `Which skills should this project install? Recommended for ${INSTALL_SCOPE_META[scope].label} are checked.`,
    options,
    initialValues: [...defaults],
    required: true,
    selectableGroups: true,
    groupSpacing: 1,
  });

  return stopOnCancel(answer) ? null : normalizeSkills(answer);
}

function sameSkills(left: readonly string[], right: readonly string[]): boolean {
  return [...left].sort().join("\n") === [...right].sort().join("\n");
}

async function resolveUpdate(cwd: string): Promise<{ scope: InstallScope; existing: InstallMeta } | null> {
  const status = spinner();
  status.start("Checking the installed version");
  const detected = detectInstalledPlatform(cwd);

  if (!detected) {
    status.stop("No installation found");
    log.info("Run npx agent-arche install first.");
    outro("No files were changed.");
    return null;
  }

  const latestVersion = await fetchNpmLatestVersion();
  if (latestVersion && detected.meta.version === latestVersion) {
    status.stop(`Already up to date (v${latestVersion})`);
    outro("Nothing to update.");
    return null;
  }

  status.stop(
    latestVersion
      ? `Updating v${detected.meta.version} → v${latestVersion}`
      : `Updating v${detected.meta.version}`,
  );
  return { scope: detected.meta.scope, existing: detected.meta };
}

async function installPlan(
  cwd: string,
  plan: InstallPlan,
  scope: InstallScope,
  version: string,
): Promise<{ results: InstallStepResult[]; totalFiles: number; hash: string | null; missing: string[] }> {
  const results: InstallStepResult[] = [];
  const missing: string[] = [];
  let totalFiles = 0;
  const progress = spinner();

  progress.start("Installing Agent Arche");

  for (const step of plan.steps) {
    progress.message(`Installing ${step.label}`);

    if (!step.src || !fs.existsSync(step.src)) {
      missing.push(step.label);
      continue;
    }

    if ("destDir" in step && step.destDir) {
      if (!isAllowedInstallPath(cwd, step.destDir)) {
        results.push({ label: step.label, msg: "blocked (unsafe path)" });
        continue;
      }

      const migrated = step.legacyMemoryDirs
        ? migrateLegacyMemoryVault(cwd, step.destDir, step.legacyMemoryDirs)
        : null;

      if (migrated) {
        totalFiles += migrated.count;
        results.push({ label: step.label, msg: `migrated from ${migrated.from}` });
      } else if (step.skipIfExists && fs.existsSync(step.destDir)) {
        results.push({ label: step.label, msg: "kept existing files" });
      } else {
        const count = copyDir(step.src, step.destDir, step.transform);
        totalFiles += count;
        results.push({ label: step.label, msg: `${count} file${count === 1 ? "" : "s"}` });
      }
      continue;
    }

    if ("destFile" in step && step.destFile) {
      if (!isAllowedInstallPath(cwd, step.destFile)) {
        results.push({ label: step.label, msg: "blocked (unsafe path)" });
        continue;
      }

      if (step.skipIfExists && fs.existsSync(step.destFile)) {
        results.push({ label: step.label, msg: "kept existing file" });
      } else {
        copyFile(step.src, step.destFile);
        totalFiles += 1;
        results.push({ label: step.label, msg: "1 file" });
      }
    }
  }

  progress.message("Verifying package integrity");
  const hash = await fetchNpmHash(version);

  if (isAllowedInstallPath(cwd, plan.metaDir)) {
    writeMeta(plan.metaDir, {
      version,
      installedAt: new Date().toISOString(),
      source: "AshenDulsanka/agent-arche",
      sourceType: "npm",
      scope,
      platform,
      hash,
      selectedSkills: [...plan.selectedSkills],
    });
  }

  progress.stop(`${totalFiles} file${totalFiles === 1 ? "" : "s"} installed`);
  return { results, totalFiles, hash, missing };
}

export async function runApp({
  force = false,
  yes = false,
  scope: requestedScope,
  selectedSkills: requestedSkills,
}: AppOptions = {}): Promise<number> {
  const cwd = process.cwd();
  const pkg = readPackageJson();

  intro(`${pc.bgCyan(pc.black(" agent-arche "))} ${pc.dim(`v${pkg.version}`)}`);

  let scope = requestedScope;
  let selectedSkills = requestedSkills ? [...requestedSkills] : undefined;
  if (force) {
    const update = await resolveUpdate(cwd);
    if (!update) return 0;
    scope = update.scope;
    selectedSkills = update.existing.selectedSkills;
  } else {
    scope = await chooseScope(scope) ?? undefined;
    if (!scope) return 0;
  }

  selectedSkills = await chooseSkills(scope, selectedSkills, yes) ?? undefined;
  if (!selectedSkills || selectedSkills.length === 0) return 0;

  if (scope === "orchestration") {
    log.warn("Full orchestration uses substantially more tokens because every subagent performs separate model and tool work.");
  }

  const plan = getCodexPlan(cwd, scope, selectedSkills);
  const existing = readMeta(plan.metaDir);
  if (
    existing
    && existing.platform === platform
    && existing.scope === scope
    && sameSkills(existing.selectedSkills, plan.selectedSkills)
    && !force
  ) {
    showExisting(existing);
    return 0;
  }

  note(formatPlan(plan), `Install in ${relativeTarget(path.dirname(cwd), cwd)}`);
  note(plan.selectedSkills.join(", "), "Selected skills");

  if (!yes) {
    const approved = await confirm({
      message: force ? "Update these files?" : "Install these files?",
      initialValue: true,
    });
    if (stopOnCancel(approved) || !approved) {
      if (!isCancel(approved)) cancel("No files were changed.");
      return 0;
    }
  }

  const result = await installPlan(cwd, plan, scope, pkg.version);
  if (result.results.length > 0) note(formatResults(result.results), "Installed");
  if (result.missing.length > 0) log.warn(`Skipped missing sources: ${result.missing.join(", ")}`);
  if (!result.hash) log.warn("Package integrity could not be fetched (offline or unpublished).");

  const nextSteps = plan.nextSteps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  note(nextSteps, "Next steps");
  outro(force ? "Agent Arche updated." : "Agent Arche is ready.");
  return 0;
}
