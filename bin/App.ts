import fs from "fs";
import path from "path";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  note,
  outro,
  select,
  spinner,
} from "@clack/prompts";
import pc from "picocolors";
import {
  INSTALL_SCOPE_META,
  ORCHESTRATION_SKILL,
  PROJECT_STAGE_META,
  PROJECT_TYPE_META,
  SETUP_PROFILE_META,
  recommendedSkills,
  selectableSkillsForProfile,
  skillGroupsForProfile,
  type InstallScope,
  type Platform,
  type ProjectStage,
  type ProjectType,
  type SetupProfile,
} from "./lib/constants.js";
import { getCodexPlan } from "./lib/plans.js";
import { skillMultiselect, skillSelectorCancel } from "./lib/skill-selector.js";
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
  profile?: SetupProfile;
  projectType?: ProjectType;
  projectStage?: ProjectStage;
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
  log.warn(`Agent Arche v${existing.version} is already installed with this profile and scope.`);
  note("Run npx agent-arche update to replace the installed files.", "Existing installation");
  outro("No files were changed.");
}

async function chooseProfile(initialProfile?: SetupProfile): Promise<SetupProfile | null> {
  if (initialProfile) return initialProfile;

  const answer = await select<SetupProfile>({
    message: "Which setup profile do you want?",
    initialValue: "general",
    options: Object.entries(SETUP_PROFILE_META).map(([value, meta]) => ({
      value: value as SetupProfile,
      label: meta.label,
      hint: meta.summary,
    })),
  });

  return stopOnCancel(answer) ? null : answer;
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

async function chooseProjectType(initialType?: ProjectType): Promise<ProjectType | null> {
  if (initialType) return initialType;
  const answer = await select<ProjectType>({
    message: "What kind of project is this?",
    initialValue: "full-stack",
    options: Object.entries(PROJECT_TYPE_META).map(([value, meta]) => ({
      value: value as ProjectType,
      label: meta.label,
      hint: meta.summary,
    })),
  });
  return stopOnCancel(answer) ? null : answer;
}

async function chooseProjectStage(initialStage?: ProjectStage): Promise<ProjectStage | null> {
  if (initialStage) return initialStage;
  const answer = await select<ProjectStage>({
    message: "What stage is the project in?",
    initialValue: "established",
    options: Object.entries(PROJECT_STAGE_META).map(([value, meta]) => ({
      value: value as ProjectStage,
      label: meta.label,
      hint: meta.summary,
    })),
  });
  return stopOnCancel(answer) ? null : answer;
}

function normalizeSkills(profile: SetupProfile, skills: readonly string[]): string[] {
  const selectableSkills = selectableSkillsForProfile(profile);
  if (skills.includes("*")) return selectableSkills;
  const allowed = new Set<string>(selectableSkills);
  return [...new Set(skills.filter((skill) => allowed.has(skill)))];
}

async function chooseSkills(
  profile: SetupProfile,
  scope: InstallScope,
  projectType: ProjectType,
  projectStage: ProjectStage,
  initialSkills?: readonly string[],
  yes = false,
): Promise<string[] | null> {
  const defaults = recommendedSkills(profile, scope, projectType, projectStage);
  if (initialSkills) {
    const normalized = normalizeSkills(profile, initialSkills);
    const unknown = initialSkills.filter((skill) => (
      skill !== "*"
      && !(scope === "orchestration" && skill === ORCHESTRATION_SKILL)
      && !normalized.includes(skill)
    ));
    if (unknown.length > 0) throw new Error(`Unknown skill selection: ${unknown.join(", ")}`);
    return normalized;
  }
  if (yes) return [...defaults];

  const answer = await skillMultiselect({
    message: `Select skills for ${INSTALL_SCOPE_META[scope].label}`,
    items: Object.entries(skillGroupsForProfile(profile)).flatMap(([group, skills]) => (
      skills.map((skill) => ({ ...skill, group }))
    )),
    initialSelected: defaults,
    required: true,
    maxVisible: 14,
  });

  if (answer === skillSelectorCancel) {
    cancel("No files were changed.");
    return null;
  }
  return normalizeSkills(profile, answer as string[]);
}

function sameSkills(left: readonly string[], right: readonly string[]): boolean {
  return [...left].sort().join("\n") === [...right].sort().join("\n");
}

async function resolveUpdate(cwd: string): Promise<{ profile: SetupProfile; scope: InstallScope; existing: InstallMeta } | null> {
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
  return { profile: detected.meta.profile, scope: detected.meta.scope, existing: detected.meta };
}

async function installPlan(
  cwd: string,
  plan: InstallPlan,
  profile: SetupProfile,
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
      profile,
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
  profile: requestedProfile,
  projectType: requestedProjectType,
  projectStage: requestedProjectStage,
  selectedSkills: requestedSkills,
}: AppOptions = {}): Promise<number> {
  const cwd = process.cwd();
  const pkg = readPackageJson();

  intro(`${pc.bgCyan(pc.black(" agent-arche "))} ${pc.dim(`v${pkg.version}`)}`);

  let scope = requestedScope;
  let profile = requestedProfile;
  let projectType = requestedProjectType;
  let projectStage = requestedProjectStage;
  let selectedSkills = requestedSkills ? [...requestedSkills] : undefined;
  if (force) {
    const update = await resolveUpdate(cwd);
    if (!update) return 0;
    scope = update.scope;
    profile = update.profile;
    selectedSkills = update.existing.selectedSkills;
  } else {
    profile = await chooseProfile(profile) ?? undefined;
    if (!profile) return 0;
    scope = await chooseScope(scope) ?? undefined;
    if (!scope) return 0;
    if (!selectedSkills) {
      projectType = await chooseProjectType(projectType) ?? undefined;
      if (!projectType) return 0;
      projectStage = await chooseProjectStage(projectStage) ?? undefined;
      if (!projectStage) return 0;
    }
  }

  projectType ??= "general";
  projectStage ??= "established";
  profile ??= "general";
  selectedSkills = await chooseSkills(profile, scope, projectType, projectStage, selectedSkills, yes) ?? undefined;
  if (!selectedSkills || selectedSkills.length === 0) return 0;

  if (scope === "orchestration") {
    log.warn("Full orchestration uses substantially more tokens because every subagent performs separate model and tool work.");
  }

  if (profile === "commerce" && selectedSkills.some((skill) => skill.startsWith("shopify-"))) {
    log.warn("Official Shopify skill scripts send usage telemetry to Shopify. Set OPT_OUT_INSTRUMENTATION=true to opt out.");
  }

  const plan = getCodexPlan(cwd, profile, scope, selectedSkills);
  const existing = readMeta(plan.metaDir);
  if (
    existing
    && existing.platform === platform
    && existing.scope === scope
    && existing.profile === profile
    && sameSkills(existing.selectedSkills, plan.selectedSkills)
    && !force
  ) {
    showExisting(existing);
    return 0;
  }

  note(formatPlan(plan), `Install in ${relativeTarget(path.dirname(cwd), cwd)}`);
  note(plan.selectedSkills.join(", "), "Selected skills");
  note(SETUP_PROFILE_META[profile].label, "Setup profile");

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

  const result = await installPlan(cwd, plan, profile, scope, pkg.version);
  if (result.results.length > 0) note(formatResults(result.results), "Installed");
  if (result.missing.length > 0) log.warn(`Skipped missing sources: ${result.missing.join(", ")}`);
  if (!result.hash) log.warn("Package integrity could not be fetched (offline or unpublished).");

  const nextSteps = plan.nextSteps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  note(nextSteps, "Next steps");
  outro(force ? "Agent Arche updated." : "Agent Arche is ready.");
  return 0;
}
