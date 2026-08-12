import type { InstallScope, Platform } from "./constants.js";

export type ContentTransform = (content: string, srcPath: string) => string;

interface BasePlanStep {
  label: string;
  src: string;
  skipIfExists?: boolean;
}

export interface DirPlanStep extends BasePlanStep {
  destDir: string;
  destFile?: never;
  transform?: ContentTransform | null;
  legacyMemoryDirs?: readonly string[];
}

export interface FilePlanStep extends BasePlanStep {
  destFile: string;
  destDir?: never;
  transform?: never;
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
  platform: Platform;
  hash: string | null;
  selectedSkills: string[];
}

export interface DetectedInstall {
  platform: Platform;
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
