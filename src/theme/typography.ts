import { type TextStyle } from "react-native";

import { fontFamily } from "./fonts";

export type TypeStyle = Pick<TextStyle, "fontFamily" | "fontSize" | "lineHeight">;

/** Line height in dp from the board's unitless ratio. RN treats lineHeight as pixels. */
function lineHeight(fontSize: number, ratio: number): number {
  return Math.round(fontSize * ratio * 10) / 10;
}

function style(family: string, fontSize: number, ratio: number): TypeStyle {
  return {
    fontFamily: family,
    fontSize,
    lineHeight: lineHeight(fontSize, ratio),
  };
}

/**
 * Named text styles from the brand board.
 * Color is intentionally omitted: apply `text-foreground`, `text-heading`,
 * `text-muted`, or `text-accent` so light and dark stay in the semantic tokens.
 * The matching NativeWind utilities are `h1`, `h2`, `body`, `caption`, and the other short names in `global.css`.
 */
export const type = {
  display: style(fontFamily.bold, 48, 1.2),
  h1: style(fontFamily.bold, 32, 1.2),
  h2: style(fontFamily.semibold, 24, 1.3),
  h3: style(fontFamily.semibold, 20, 1.3),
  h4: style(fontFamily.medium, 16, 1.4),
  bodyLarge: style(fontFamily.regular, 16, 1.6),
  body: style(fontFamily.regular, 14, 1.6),
  bodySmall: style(fontFamily.regular, 13, 1.6),
  caption: style(fontFamily.regular, 11, 1.4),
  label: style(fontFamily.medium, 12, 1.4),
  overline: style(fontFamily.medium, 11, 1.4),
} as const satisfies Record<string, TypeStyle>;

export const typeScale = [
  { id: "h1", name: "H1", role: "Main Heading", size: "32px", weight: "Bold", lineHeight: "1.2" },
  { id: "h2", name: "H2", role: "Section Heading", size: "24px", weight: "SemiBold", lineHeight: "1.3" },
  { id: "h3", name: "H3", role: "Card / Module Title", size: "20px", weight: "SemiBold", lineHeight: "1.3" },
  { id: "h4", name: "H4", role: "Subheading", size: "16px", weight: "Medium", lineHeight: "1.4" },
  { id: "bodyLarge", name: "Body Large", role: "Body text (large)", size: "16px", weight: "Regular", lineHeight: "1.6" },
  { id: "body", name: "Body Medium", role: "Body text (medium)", size: "14px", weight: "Regular", lineHeight: "1.6" },
  { id: "bodySmall", name: "Body Small", role: "Supporting text (small)", size: "13px", weight: "Regular", lineHeight: "1.6" },
  { id: "caption", name: "Caption", role: "Labels, meta text", size: "11px", weight: "Regular", lineHeight: "1.4" },
] as const;

export type TypeScaleId = (typeof typeScale)[number]["id"];
