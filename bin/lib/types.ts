import type { InstallScope, Platform, SetupProfile } from "./constants.js";

// Applied to Markdown files only; other files are copied byte-for-byte.
export type ContentTransform = (content: string, srcPath: string) => string;
// Receives the path relative to the step source, with forward slashes.
export type PathFilter = (relPath: string) => boolean;

interface BasePlanStep {
  label: string;
  src: string;
  skipIfExists?: boolean;
}

export interface DirPlanStep extends BasePlanStep {
  destDir: string;
  destFile?: never;
  transform?: ContentTransform | null;
  exclude?: PathFilter;
  legacyMemoryDirs?: readonly string[];
}

export interface FilePlanStep extends BasePlanStep {
  destFile: string;
  destDir?: never;
  transform?: never;
  exclude?: never;
  // Deep-merge JSON into an existing destination instead of replacing it.
  mergeJson?: boolean;
}

export type PlanStep = DirPlanStep | FilePlanStep;

export interface InstallPlan {
  dest: string;
  metaDir: string;
  steps: PlanStep[];
  nextSteps: readonly string[];
  selectedSkills: readonly string[];
}

export interface InstallMeta {
  version: string;
  installedAt: string;
  source: string;
  sourceType: string;
  scope: InstallScope;
  profile: SetupProfile;
  platform: Platform;
  hash: string | null;
  selectedSkills: string[];
}

export interface DetectedInstall {
  meta: InstallMeta;
  metaDir: string;
}

export interface PlanSummaryStep {
  label: string;
  count: number;
  kind: "dir" | "file";
}

export interface PlanSummary {
  total: number;
  steps: PlanSummaryStep[];
  missing: string[];
}

export interface InstallStepResult {
  label: string;
  msg: string;
}

export interface PackageJsonLike {
  version: string;
}
