import React from "react";
import { Box, Text, Static } from "ink";
import { Spinner } from "@inkjs/ui";
import { COPY } from "../lib/constants.js";
import { Section } from "./Layout.js";
import { InfoLine } from "./Preview.js";
import type { InstallPlan, InstallStepResult } from "../lib/types.js";

const h = React.createElement;

interface ProgressViewProps {
  plan: InstallPlan;
  installSteps: InstallStepResult[];
  currentStepIdx: number;
  fetchingHash: boolean;
  totalFiles: number;
  compact: boolean;
}

export function ProgressView({ plan, installSteps, currentStepIdx, fetchingHash, totalFiles, compact }: ProgressViewProps): React.ReactElement {
  const completed = installSteps.length;
  const totalTargets = plan.steps.length;

  return h(
    Section,
    { eyebrow: COPY.install.eyebrow, title: COPY.install.title },
    h(
      Box,
      { borderStyle: "round", borderColor: "cyan", paddingX: 1, paddingY: 0, flexDirection: "column" },
      h(InfoLine, { label: COPY.labels.completedTargets, value: `${completed}/${totalTargets}`, valueColor: "cyan" }),
      h(InfoLine, { label: COPY.labels.filesCopied,      value: `${totalFiles}` }),
      currentStepIdx >= 0
        ? h(Box, { marginTop: 1 },
            h(Spinner, { type: "dots" }),
            h(Text, { color: "cyan" }, ` ${plan.steps[currentStepIdx]?.label}`)
          )
        : null,
      fetchingHash
        ? h(Box, { marginTop: 1 },
            h(Spinner, { type: "dots" }),
            h(Text, null, ` ${COPY.install.hashFetching}`)
          )
        : null
    ),
    installSteps.length > 0
      ? h(
          Box,
          { marginTop: 1, flexDirection: "column" },
          h(Text, { bold: true }, COPY.install.completed),
          h(Static<InstallStepResult>, {
            items: installSteps.slice(-(compact ? 4 : 8)),
            children: (item: InstallStepResult, index: number) =>
              h(Box, { key: `${item.label}-${index}` },
                h(Text, { color: "green" }, "✓ "),
                h(Text, { color: "white" }, item.label),
                item.msg ? h(Text, { color: "gray" }, `  ${item.msg}`) : null
              ),
          })
        )
      : null
  );
}
