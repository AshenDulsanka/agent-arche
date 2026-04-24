import React from "react";
import { Box, Text } from "ink";
import path from "path";
import { PLATFORM_META, COPY, PRIMARY_COMMANDS, META_FILE, type Platform } from "../lib/constants.js";
import { Section } from "./Layout.js";
import { InfoLine } from "./Preview.js";
import type { InstallPlan } from "../lib/types.js";

const h = React.createElement;

interface SuccessViewProps {
  platform: Platform;
  plan: InstallPlan;
  totalFiles: number;
  hash: string | null;
  missing: string[];
  force: boolean;
  compact: boolean;
}

export function SuccessView({ platform, plan, totalFiles, hash, missing, force, compact }: SuccessViewProps): React.ReactElement {
  const meta = PLATFORM_META[platform];
  const primaryCommand = PRIMARY_COMMANDS[platform];

  return h(
    Box,
    { flexDirection: "column" },
    h(
      Section,
      { eyebrow: COPY.success.eyebrow, title: `${meta.name} setup ${force ? "updated" : "installed"} successfully.` },
      h(
        Box,
        { borderStyle: "round", borderColor: meta.accent, paddingX: 1, paddingY: 0, flexDirection: "column" },
        h(InfoLine, { label: COPY.labels.filesWritten, value: `${totalFiles}`, valueColor: meta.accent }),
        h(InfoLine, { label: COPY.labels.platform, value: meta.name }),
        h(InfoLine, { label: COPY.labels.primaryCommand, value: primaryCommand, valueColor: "cyan" }),
        h(InfoLine, { label: COPY.labels.integrity, value: hash ? COPY.success.integrityOnline : COPY.success.integrityOffline, valueColor: hash ? "green" : "yellow" })
      ),
      hash
        ? h(
            Box,
            { marginTop: 1, flexDirection: "column" },
            h(Text, { bold: true }, COPY.success.integrity),
            h(Text, { color: "gray" }, COPY.success.integrityCommand),
            compact ? null : h(Text, { color: "gray" }, `Compare with ${path.join(plan.metaDir, META_FILE)}`),
            h(Text, { color: "gray" }, `${hash.slice(0, compact ? 36 : 56)}...`)
          )
        : null,
      h(
        Box,
        { marginTop: 1, flexDirection: "column" },
        h(Text, { bold: true }, COPY.success.nextSteps),
        ...plan.nextSteps.slice(0, compact ? 2 : plan.nextSteps.length).map((step: string, i: number) =>
          h(Box, { key: `next-${i}` },
            h(Text, { color: "gray" }, `${i + 1}. `),
            h(Text, null, step)
          )
        ),
        compact && plan.nextSteps.length > 2
          ? h(Text, { color: "gray" }, `+ ${plan.nextSteps.length - 2} more next steps`)
          : null
      ),
      missing.length > 0
        ? h(
            Box,
            { marginTop: 1, flexDirection: "column" },
            h(Text, { color: "yellow" }, COPY.success.skippedNote),
            h(Text, { color: "gray" }, missing.join(", "))
          )
        : null
    )
  );
}
