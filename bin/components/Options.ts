import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, useInput } from "ink";
import { COPY } from "../lib/constants.js";
import { getPlatformOptions, getSubscriptionOptions } from "../lib/utils.js";
import { Section } from "./Layout.js";
import type { HintItem, OptionItem } from "../lib/types.js";
import type { Platform, Subscription } from "../lib/constants.js";

const h = React.createElement;

// ─── KeyHints ─────────────────────────────────────────────────────────────────
interface KeyHintsProps {
  hints: readonly HintItem[];
}

interface CompactOptionListProps {
  options: OptionItem[];
  activeIndex: number;
}

interface OptionListProps {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  compact?: boolean;
}

interface PlatformCardsProps {
  value: Platform;
  onSubmit: (value: string) => void;
  onChange?: (value: Platform) => void;
  compact: boolean;
}

interface SubscriptionStepProps {
  value: Subscription;
  onSubmit: (value: string) => void;
  compact: boolean;
}

function asPlatform(value: string): Platform | null {
  if (value === "copilot" || value === "claude" || value === "codex") {
    return value;
  }
  return null;
}

function asSubscription(value: string): Subscription | null {
  if (value === "auto" || value === "student" || value === "pro" || value === "pro+") {
    return value;
  }
  return null;
}

export function KeyHints({ hints }: KeyHintsProps): React.ReactElement {
  return h(
    Box,
    { marginTop: 1 },
    hints.map((hint: HintItem, index: number) =>
      h(
        Box,
        { key: `${hint.label}-${index}`, marginRight: index === hints.length - 1 ? 0 : 3 },
        h(Text, { color: "gray" }, hint.label),
        h(Text, { color: "white" }, ` ${hint.value}`)
      )
    )
  );
}

// ─── CompactOptionList ────────────────────────────────────────────────────────
function CompactOptionList({ options, activeIndex }: CompactOptionListProps): React.ReactElement {
  return h(
    Box,
    { flexDirection: "column" },
    ...options.map((option: OptionItem, index: number) => {
      const selected = index === activeIndex;
      return h(
        Box,
        { key: option.value, justifyContent: "space-between" },
        h(
          Box,
          null,
          h(Text, { color: selected ? option.accent : "gray" }, selected ? "◆ " : "○ "),
          h(Text, { bold: selected }, option.label)
        ),
        h(Text, { color: "gray" }, option.description)
      );
    })
  );
}

// ─── OptionList ───────────────────────────────────────────────────────────────
export function OptionList({ options, value, onChange, onSubmit, compact = false }: OptionListProps): React.ReactElement {
  const initialIndex = Math.max(0, options.findIndex((o: OptionItem) => o.value === value));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const next = options.findIndex((o: OptionItem) => o.value === value);
    if (next >= 0) setActiveIndex(next);
  }, [options, value]);

  const active = options[activeIndex] ?? options[0];

  useEffect(() => {
    if (active && active.value !== value) onChange(active.value);
  }, [active, onChange, value]);

  useInput((input, key) => {
    if (key.upArrow)   { setActiveIndex((p) => (p - 1 + options.length) % options.length); return; }
    if (key.downArrow) { setActiveIndex((p) => (p + 1) % options.length); return; }
    if (key.return && active) { onSubmit(active.value); }
    if (input === "j") { setActiveIndex((p) => (p + 1) % options.length); }
    if (input === "k") { setActiveIndex((p) => (p - 1 + options.length) % options.length); }
  });

  if (compact) {
    const current = options[activeIndex] ?? options[0];
    return h(
      Box,
      { flexDirection: "column" },
      h(CompactOptionList, { options, activeIndex }),
      current
        ? h(
            Box,
            { marginTop: 1, flexDirection: "column", borderStyle: "round", borderColor: current.accent, paddingX: 1, paddingY: 0 },
            h(Text, { color: "gray" }, current.description),
            ...(current.details || []).map((detail: string, i: number) =>
              h(Box, { key: `${current.value}-d-${i}` },
                h(Text, { color: current.accent }, "• "),
                h(Text, null, detail)
              )
            ),
            current.note ? h(Text, { color: "gray" }, current.note) : null
          )
        : null
    );
  }

  return h(
    Box,
    { flexDirection: "column" },
    options.map((option: OptionItem, index: number) => {
      const selected = index === activeIndex;
      return h(
        Box,
        {
          key: option.value,
          flexDirection: "column",
          borderStyle: "round",
          borderColor: selected ? option.accent : "gray",
          paddingX: 1,
          paddingY: 0,
          marginBottom: 1,
        },
        h(
          Box,
          { justifyContent: "space-between" },
          h(Box, null,
            h(Text, { color: selected ? option.accent : "gray" }, selected ? "◆ " : "○ "),
            h(Text, { bold: selected }, option.label)
          ),
          h(Text, { color: "gray" }, option.description)
        ),
        ...(option.details || []).map((detail: string, di: number) =>
          h(Box, { key: `${option.value}-${di}`, marginLeft: 2 },
            h(Text, { color: "gray" }, "• "),
            h(Text, { color: selected ? "white" : "gray" }, detail)
          )
        ),
        option.note
          ? h(Box, { marginLeft: 2, marginTop: 1 }, h(Text, { color: "gray" }, option.note))
          : null
      );
    })
  );
}

// ─── PlatformCards ────────────────────────────────────────────────────────────
export function PlatformCards({ value, onSubmit, onChange, compact }: PlatformCardsProps): React.ReactElement {
  const [current, setCurrent] = useState(value || "copilot");
  const platformOptions = useMemo(() => getPlatformOptions(), []);
  const handleChange = (next: string): void => {
    const parsed = asPlatform(next);
    if (parsed) {
      setCurrent(parsed);
      onChange?.(parsed);
    }
  };
  return h(
    Section,
    { eyebrow: COPY.platform.eyebrow, title: COPY.platform.title },
    h(OptionList, { options: platformOptions, value: current, onChange: handleChange, onSubmit, compact })
  );
}

// ─── SubscriptionStep ─────────────────────────────────────────────────────────
export function SubscriptionStep({ value, onSubmit, compact }: SubscriptionStepProps): React.ReactElement {
  const [current, setCurrent] = useState(value || "auto");
  const subscriptionOptions = useMemo(() => getSubscriptionOptions(), []);
  const handleChange = (next: string): void => {
    const parsed = asSubscription(next);
    if (parsed) {
      setCurrent(parsed);
    }
  };
  return h(
    Section,
    { eyebrow: COPY.subscription.eyebrow, title: COPY.subscription.title },
    h(OptionList, { options: subscriptionOptions, value: current, onChange: handleChange, onSubmit, compact })
  );
}
