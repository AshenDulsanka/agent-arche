import * as readline from "node:readline";
import { Writable } from "node:stream";
import { stripVTControlCharacters } from "node:util";
import pc from "picocolors";

// Fixed-frame selector adapted from vercel-labs/skills' MIT-licensed
// src/prompts/search-multiselect.ts. See NOTICE.md for attribution.

export interface SkillSelectorItem {
  value: string;
  label: string;
  hint: string;
  group: string;
}

interface SkillSelectorOptions {
  message: string;
  items: SkillSelectorItem[];
  initialSelected: readonly string[];
  maxVisible?: number;
  required?: boolean;
}

type SkillEntry =
  | { type: "group"; group: string; items: SkillSelectorItem[]; collapsed: boolean }
  | { type: "item"; item: SkillSelectorItem };

export const skillSelectorCancel = Symbol("skill-selector-cancel");

const silentOutput = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

function displayWidth(value: string): number {
  let width = 0;
  for (const character of stripVTControlCharacters(value)) {
    const code = character.codePointAt(0) ?? 0;
    const wide =
      (code >= 0x1100 && code <= 0x115f)
      || (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f)
      || (code >= 0xac00 && code <= 0xd7a3)
      || (code >= 0xf900 && code <= 0xfaff)
      || (code >= 0xfe10 && code <= 0xfe6f)
      || (code >= 0xff00 && code <= 0xff60)
      || (code >= 0xffe0 && code <= 0xffe6)
      || (code >= 0x1f000 && code <= 0x1f9ff);
    width += wide ? 2 : 1;
  }
  return width;
}

function countVisualRows(lines: readonly string[]): number {
  const columns = Math.max(1, process.stdout.columns || 80);
  return lines.reduce((total, line) => total + Math.max(1, Math.ceil(displayWidth(line) / columns)), 0);
}

function truncate(value: string, width: number): string {
  if (width <= 0) return "";
  if (displayWidth(value) <= width) return value;
  let result = "";
  for (const character of value) {
    if (displayWidth(`${result}${character}…`) > width) break;
    result += character;
  }
  return `${result}…`;
}

function wrap(value: string, width: number, lineCount: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (displayWidth(candidate) <= width) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = truncate(word, width);
    if (lines.length === lineCount) break;
  }
  if (current && lines.length < lineCount) lines.push(current);
  while (lines.length < lineCount) lines.push("");
  return lines.slice(0, lineCount);
}

export function buildSkillEntries(
  items: readonly SkillSelectorItem[],
  collapsedGroups: ReadonlySet<string> = new Set(),
): SkillEntry[] {
  const groups = new Map<string, SkillSelectorItem[]>();
  for (const item of items) {
    const groupItems = groups.get(item.group) ?? [];
    groupItems.push(item);
    groups.set(item.group, groupItems);
  }

  const entries: SkillEntry[] = [];
  for (const [group, groupItems] of groups) {
    const collapsed = collapsedGroups.has(group);
    entries.push({ type: "group", group, items: groupItems, collapsed });
    if (!collapsed) entries.push(...groupItems.map((item) => ({ type: "item" as const, item })));
  }
  return entries;
}

function toggleEntry(selected: Set<string>, entry: SkillEntry | undefined): void {
  if (!entry) return;
  const items = entry.type === "group" ? entry.items : [entry.item];
  const allSelected = items.every((item) => selected.has(item.value));
  for (const item of items) {
    if (allSelected) selected.delete(item.value);
    else selected.add(item.value);
  }
}

export async function skillMultiselect({
  message,
  items,
  initialSelected,
  maxVisible = 12,
  required = false,
}: SkillSelectorOptions): Promise<string[] | symbol> {
  return new Promise((resolve) => {
    const terminalRows = process.stdout.rows || 24;
    const viewportSize = Math.max(3, Math.min(maxVisible, terminalRows - 9));
    const selected = new Set(initialSelected);
    const collapsedGroups = new Set<string>();
    const rl = readline.createInterface({ input: process.stdin, output: silentOutput, terminal: false });
    let cursor = 0;
    let lastRenderHeight = 0;

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    readline.emitKeypressEvents(process.stdin, rl);

    const render = (state: "active" | "submit" | "cancel" = "active"): void => {
      const lines: string[] = [];
      const entries = buildSkillEntries(items, collapsedGroups);
      const icon = state === "active" ? pc.green("◆") : state === "submit" ? pc.green("◇") : pc.red("■");
      lines.push(`${icon}  ${pc.bold(truncate(message, Math.max(20, (process.stdout.columns || 80) - 5)))}`);

      if (state === "active") {
        const visibleStart = Math.max(0, Math.min(
          cursor - Math.floor(viewportSize / 2),
          Math.max(0, entries.length - viewportSize),
        ));
        const visibleEntries = entries.slice(visibleStart, visibleStart + viewportSize);
        const columns = process.stdout.columns || 80;

        lines.push(pc.dim("│"));
        for (let index = 0; index < viewportSize; index += 1) {
          const entry = visibleEntries[index];
          if (!entry) {
            lines.push(pc.dim("│"));
            continue;
          }

          const actualIndex = visibleStart + index;
          const active = actualIndex === cursor;
          const pointer = active ? pc.cyan("❯") : " ";

          if (entry.type === "group") {
            const selectedCount = entry.items.filter((item) => selected.has(item.value)).length;
            const mark = selectedCount === entry.items.length
              ? pc.green("●")
              : selectedCount > 0
                ? pc.yellow("◐")
                : pc.dim("○");
            const disclosure = pc.dim(entry.collapsed ? "▸" : "▾");
            const label = active ? pc.underline(pc.bold(entry.group)) : pc.bold(entry.group);
            lines.push(`${pc.dim("│")} ${pointer} ${disclosure} ${mark} ${label}`);
            continue;
          }

          const groupItems = items.filter((item) => item.group === entry.item.group);
          const tree = groupItems.at(-1) === entry.item ? "└─" : "├─";
          const mark = selected.has(entry.item.value) ? pc.green("●") : pc.dim("○");
          const label = active ? pc.underline(entry.item.label) : entry.item.label;
          const hintWidth = Math.max(0, columns - displayWidth(entry.item.label) - 16);
          const hint = hintWidth > 4 ? pc.dim(` (${truncate(entry.item.hint, hintWidth)})`) : "";
          lines.push(`${pc.dim("│")} ${pointer} ${pc.dim(tree)} ${mark} ${label}${hint}`);
        }

        const hiddenBefore = visibleStart;
        const hiddenAfter = Math.max(0, entries.length - visibleStart - visibleEntries.length);
        const position = [
          hiddenBefore > 0 ? `↑ ${hiddenBefore} more` : "",
          hiddenAfter > 0 ? `↓ ${hiddenAfter} more` : "",
        ].filter(Boolean).join("  ");
        lines.push(`${pc.dim("│")}   ${pc.dim(position)}`);

        const activeEntry = entries[cursor];
        const detail = activeEntry?.type === "group"
          ? `Toggle all ${activeEntry.items.length} skills in ${activeEntry.group}.`
          : activeEntry
            ? `${activeEntry.item.label}: ${activeEntry.item.hint}.`
            : "";
        lines.push(pc.dim("│"));
        lines.push(`${pc.dim("│")}   ${pc.dim("Description")}`);
        for (const detailLine of wrap(detail, Math.max(20, columns - 7), 2)) {
          lines.push(`${pc.dim("│")}   ${pc.dim(detailLine)}`);
        }
        lines.push(pc.dim("│"));
        lines.push(`${pc.dim("│")}   ${pc.dim("↑↓ move, ←→ collapse/expand, space select, enter confirm, esc cancel")}`);
        lines.push(pc.dim("└"));
      } else if (state === "submit") {
        const labels = items.filter((item) => selected.has(item.value)).map((item) => item.label);
        const summary = labels.length <= 3
          ? labels.join(", ")
          : `${labels.slice(0, 3).join(", ")} +${labels.length - 3} more`;
        lines.push(`${pc.dim("│")}  ${pc.dim(summary)}`);
      } else {
        lines.push(`${pc.dim("│")}  ${pc.strikethrough(pc.dim("Cancelled"))}`);
      }

      const clear = lastRenderHeight > 0 ? `\x1b[${lastRenderHeight}A\x1b[J` : "";
      process.stdout.write(`${clear}${lines.join("\n")}\n`);
      lastRenderHeight = countVisualRows(lines);
    };

    const cleanup = (): void => {
      process.stdin.removeListener("keypress", onKeypress);
      process.stdout.removeListener("resize", onResize);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    const finish = (state: "submit" | "cancel"): void => {
      render(state);
      cleanup();
      resolve(state === "submit" ? [...selected] : skillSelectorCancel);
    };

    const onResize = (): void => render();
    const onKeypress = (_value: string, key: readline.Key): void => {
      const entries = buildSkillEntries(items, collapsedGroups);
      if (key.name === "return") {
        if (!required || selected.size > 0) finish("submit");
        return;
      }
      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        finish("cancel");
        return;
      }
      if (key.name === "up") cursor = Math.max(0, cursor - 1);
      else if (key.name === "down") cursor = Math.min(entries.length - 1, cursor + 1);
      else if (key.name === "space") toggleEntry(selected, entries[cursor]);
      else if (key.name === "right") {
        const entry = entries[cursor];
        if (entry?.type === "group" && entry.collapsed) collapsedGroups.delete(entry.group);
      } else if (key.name === "left") {
        const entry = entries[cursor];
        const group = entry?.type === "group" ? entry.group : entry?.item.group;
        if (group) {
          collapsedGroups.add(group);
          cursor = buildSkillEntries(items, collapsedGroups).findIndex(
            (candidate) => candidate.type === "group" && candidate.group === group,
          );
        }
      } else return;
      render();
    };

    process.stdin.on("keypress", onKeypress);
    process.stdout.on("resize", onResize);
    render();
  });
}
