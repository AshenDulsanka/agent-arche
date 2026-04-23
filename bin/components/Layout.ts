import React from "react";
import { Box, Text } from "ink";

const h = React.createElement;

interface FrameProps {
  children?: React.ReactNode;
}

interface SectionProps {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function Frame({ children }: FrameProps): React.ReactElement {
  return h(
    Box,
    { flexDirection: "column", borderStyle: "round", borderColor: "gray", paddingX: 2, paddingY: 1 },
    children
  );
}

export function Section({ title, eyebrow, children }: SectionProps): React.ReactElement {
  return h(
    Box,
    { flexDirection: "column", marginTop: 1 },
    eyebrow ? h(Text, { color: "gray" }, eyebrow.toUpperCase()) : null,
    h(Text, { bold: true }, title),
    h(Box, { marginTop: 1, flexDirection: "column" }, children)
  );
}
