import React from "react";
import { Box, Text } from "ink";
import path from "path";
import { COPY, STEP_LABELS, type Platform, type Step } from "../lib/constants.js";
import { getStepIndex, formatMode } from "../lib/utils.js";

const h = React.createElement;

interface StepIndicatorProps {
  visibleSteps: Step[];
  currentIndex: number;
}

interface HeaderProps {
  version: string;
  force: boolean;
  cwd: string;
  step: string;
  platform: Platform;
  compact: boolean;
  showSteps: boolean;
}

function StepIndicator({ visibleSteps, currentIndex }: StepIndicatorProps): React.ReactElement {
  return h(
    Box,
    { marginTop: 1 },
    visibleSteps.map((step: Step, index: number) =>
      h(
        Box,
        { key: step, marginRight: index === visibleSteps.length - 1 ? 0 : 1 },
        h(Text, { color: index <= currentIndex ? "cyan" : "gray" },
          index < currentIndex ? "●" : index === currentIndex ? "◆" : "○"
        ),
        h(Text, { color: index <= currentIndex ? "white" : "gray" }, ` ${STEP_LABELS[step]}`),
        index === visibleSteps.length - 1 ? null : h(Text, { color: "gray" }, "  ")
      )
    )
  );
}

export function Header({ version, force, cwd, step, platform, compact, showSteps }: HeaderProps): React.ReactElement {
  const stepInfo = getStepIndex(step, platform);

  return h(
    Box,
    { flexDirection: "column" },
    h(
      Box,
      { justifyContent: "space-between" },
      h(
        Box,
        null,
        h(Text, { color: "cyan" }, "◆ "),
        h(Text, { bold: true }, COPY.app.name),
        h(Text, { color: "gray" }, ` v${version}`)
      ),
      h(Text, { color: force ? "yellow" : "green" }, formatMode(force).toUpperCase())
    ),
    compact ? null : h(Text, { color: "gray" }, COPY.app.tagline),
    h(
      Box,
      { marginTop: compact ? 0 : 1, justifyContent: "space-between" },
      h(Text, { color: "gray" }, `Project  ${path.basename(cwd) || cwd}`),
      showSteps
        ? h(Text, { color: "gray" }, `Step ${stepInfo.currentIndex + 1}/${stepInfo.visibleSteps.length}`)
        : null
    ),
    showSteps
      ? h(StepIndicator, { visibleSteps: stepInfo.visibleSteps, currentIndex: stepInfo.currentIndex })
      : null
  );
}
