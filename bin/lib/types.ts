import type { Platform, Subscription, Step } from "./constants.js";

export type AppStep = Step | "existing" | "confirm";

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
}

export interface InstallMeta {
  version: string;
  installedAt: string;
  source: string;
  sourceType: string;
  platform: Platform;
  subscription?: Subscription;
  hash: string | null;
}

export interface DetectedInstall {
  platform: Platform;
  subscription: Subscription;
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
  notes: string[];
}

export interface OptionItem {
  value: string;
  label: string;
  accent: string;
  description: string;
  details?: readonly string[];
  note?: string;
}

export interface HintItem {
  label: string;
  value: string;
}

export interface InstallStepResult {
  label: string;
  msg: string;
}

export interface HeaderStepInfo {
  visibleSteps: Step[];
  currentIndex: number;
}

export interface PackageJsonLike {
  version: string;
}

export type ConfirmHandler = (confirmed: boolean) => void;

export interface PreparePlanInput {
  platform: Platform;
  subscription: Subscription;
}
