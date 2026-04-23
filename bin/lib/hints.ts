import type { AppStep, HintItem } from "./types.js";

const NAVIGATION_HINTS: readonly HintItem[] = [
  { label: "↑↓", value: "move" },
  { label: "enter", value: "select" },
  { label: "j/k", value: "navigate" },
];

const BACK_QUIT_HINTS: readonly HintItem[] = [
  { label: "esc", value: "back" },
  { label: "q", value: "quit" },
];

const INSTALL_HINTS: readonly HintItem[] = [
  { label: "esc", value: "cancel" },
  { label: "q", value: "quit" },
];

const CONFIRM_HINTS: readonly HintItem[] = [
  { label: "enter/y", value: "confirm" },
  { label: "n", value: "cancel" },
  { label: "esc", value: "back" },
  { label: "q", value: "quit" },
];

export function getFooterHints(step: AppStep): readonly HintItem[] {
  if (step === "install") {
    return INSTALL_HINTS;
  }

  if (step === "platform" || step === "subscription") {
    return [...NAVIGATION_HINTS, ...BACK_QUIT_HINTS];
  }

  if (step === "confirm") {
    return CONFIRM_HINTS;
  }

  return BACK_QUIT_HINTS;
}
