import React from "react";
import { Box, Text } from "ink";
import path from "path";
import { PLATFORM_META, SUBSCRIPTION_META, META_FILE, COPY, type Platform, type Subscription } from "../lib/constants.js";
import { Section } from "./Layout.js";
import type { ConfirmHandler, InstallMeta, InstallPlan, PlanSummary } from "../lib/types.js";

const h = React.createElement;

// ─── InfoLine ─────────────────────────────────────────────────────────────────
interface InfoLineProps {
  label: string;
  value: string;
  valueColor?: string;
}

interface ConfirmBarProps {
  force: boolean;
}

interface InstallPreviewProps {
  platform: Platform;
  subscription: Subscription;
  plan: InstallPlan;
  preview: PlanSummary;
  force: boolean;
  onConfirm: ConfirmHandler;
  compact: boolean;
}

interface ExistingInstallViewProps {
  platform: Platform;
  existing: InstallMeta | null;
  compact: boolean;
}

interface UpToDateViewProps {
  platform: Platform;
  existing: InstallMeta | null;
  latestVersion: string;
  compact: boolean;
}

interface UpdateMissingViewProps {
  compact: boolean;
}

export function InfoLine({ label, value, valueColor = "white" }: InfoLineProps): React.ReactElement {
  return h(
    Box,
    { justifyContent: "space-between" },
    h(Text, { color: "gray" }, label),
    h(Text, { color: valueColor }, value)
  );
}

// ─── ConfirmBar ───────────────────────────────────────────────────────────────
function ConfirmBar({ force }: ConfirmBarProps): React.ReactElement {
  return h(
    Box,
    { marginTop: 1, borderStyle: "round", borderColor: "gray", paddingX: 1, paddingY: 0, justifyContent: "space-between" },
    h(Text, null, `${force ? "Update" : "Install"} now?`),
    h(Text, { color: "gray" }, COPY.preview.confirmHints)
  );
}

// ─── InstallPreview ───────────────────────────────────────────────────────────
export function InstallPreview({ platform, subscription, plan, preview, force, onConfirm, compact }: InstallPreviewProps): React.ReactElement {
  const meta = PLATFORM_META[platform];
  const subMeta = platform === "copilot" ? SUBSCRIPTION_META[subscription] : null;

  return h(
    Box,
    { flexDirection: "column" },
    h(
      Section,
      { eyebrow: COPY.preview.eyebrow, title: `${force ? "Update" : "Install"} package set before writing files.` },
      h(
        Box,
        { borderStyle: "round", borderColor: meta.accent, paddingX: 1, paddingY: 0, flexDirection: "column" },
        h(InfoLine, { label: COPY.labels.platform, value: meta.name, valueColor: meta.accent }),
        subMeta
          ? h(InfoLine, { label: COPY.labels.copilotPlan, value: subMeta.label, valueColor: subMeta.accent })
          : null,
        h(InfoLine, { label: COPY.labels.destination, value: meta.destination }),
        h(InfoLine, { label: COPY.labels.installUnits, value: `${preview.total} files across ${preview.steps.length} targets` }),
        h(InfoLine, { label: COPY.labels.metadata, value: path.join(plan.metaDir, META_FILE) })
      ),
      h(
        Box,
        { marginTop: 1, flexDirection: "column" },
        h(Text, { bold: true }, COPY.preview.includes),
        ...preview.notes.slice(0, compact ? 2 : preview.notes.length).map((note: string, i: number) =>
          h(Box, { key: `note-${i}`, marginLeft: 1 },
            h(Text, { color: meta.accent }, "• "),
            h(Text, null, note)
          )
        )
      ),
      h(
        Box,
        { marginTop: 1, flexDirection: "column" },
        h(Text, { bold: true }, COPY.preview.targets),
        ...preview.steps.slice(0, compact ? 4 : preview.steps.length).map((step, i: number) =>
          h(Box, { key: `${step.label}-${i}`, justifyContent: "space-between" },
            h(Text, { color: "gray" }, step.label),
            h(Text, null, step.kind === "file" ? "1 file" : `${step.count} files`)
          )
        ),
        compact && preview.steps.length > 4
          ? h(Text, { color: "gray" }, `+ ${preview.steps.length - 4} more targets`)
          : null
      ),
      preview.missing.length > 0
        ? h(
            Box,
            { marginTop: 1, flexDirection: "column" },
            h(Text, { color: "yellow" }, COPY.preview.missingWarning),
            h(Text, { color: "gray" }, preview.missing.join(", "))
          )
        : null,
      h(ConfirmBar, { force })
    )
  );
}

// ─── ExistingInstallView ──────────────────────────────────────────────────────
export function ExistingInstallView({ platform, existing, compact }: ExistingInstallViewProps): React.ReactElement {
  const meta = PLATFORM_META[platform];
  return h(
    Section,
    { eyebrow: COPY.existing.eyebrow, title: `${meta.name} is already installed in this project.` },
    h(
      Box,
      { borderStyle: "round", borderColor: "yellow", paddingX: 1, paddingY: 0, flexDirection: "column" },
      h(InfoLine, { label: COPY.labels.installedVersion, value: existing?.version ?? "Unknown", valueColor: "yellow" }),
      h(InfoLine, { label: COPY.labels.platform, value: meta.name }),
      h(InfoLine, { label: COPY.labels.installedAt, value: existing?.installedAt ?? "Unknown" }),
      h(InfoLine, { label: COPY.labels.nextAction, value: COPY.existing.nextAction, valueColor: "cyan" })
    ),
    compact ? null : h(Box, { marginTop: 1 }, h(Text, { color: "gray" }, COPY.existing.noFilesChanged))
  );
}

export function UpToDateView({ platform, existing, latestVersion, compact }: UpToDateViewProps): React.ReactElement {
  const meta = PLATFORM_META[platform];
  return h(
    Section,
    { eyebrow: COPY.existing.eyebrow, title: COPY.existing.latestTitle },
    h(
      Box,
      { borderStyle: "round", borderColor: "green", paddingX: 1, paddingY: 0, flexDirection: "column" },
      h(InfoLine, { label: COPY.labels.platform, value: meta.name }),
      h(InfoLine, { label: COPY.labels.installedVersion, value: existing?.version ?? "Unknown", valueColor: "green" }),
      h(InfoLine, { label: COPY.labels.npmLatestVersion, value: latestVersion, valueColor: "green" }),
      h(InfoLine, { label: COPY.labels.installedAt, value: existing?.installedAt ?? "Unknown" })
    ),
    compact ? null : h(Box, { marginTop: 1 }, h(Text, { color: "gray" }, COPY.existing.latestMessage))
  );
}

export function UpdateMissingView({ compact }: UpdateMissingViewProps): React.ReactElement {
  return h(
    Section,
    { eyebrow: COPY.existing.eyebrow, title: COPY.existing.missingTitle },
    h(Box, { borderStyle: "round", borderColor: "yellow", paddingX: 1, paddingY: 0, flexDirection: "column" },
      h(Text, null, COPY.existing.missingMessage),
      compact ? null : h(Text, { color: "cyan" }, COPY.existing.nextAction.replace("update", "install"))
    )
  );
}
