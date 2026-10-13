/**
 * LedgerBook color tokens from the approved brand board.
 *
 * `palette` is fixed in both color schemes (swatches, brand fills).
 * `semantic` is the UI role map. Dark values stay in the same ink / navy /
 * emerald family, lightened so text stays readable on dark surfaces.
 * Light semantic values must match the defaults in `global.css`.
 */

export const palette = {
  navy: "#1A237E",
  emerald: "#1B5E20",
  emeraldLight: "#E8F5EE",
  mint: "#CDE8D8",
  success: "#1B5E20",
  warning: "#F9A825",
  error: "#D32F2F",
  info: "#3F83F8",
  textPrimary: "#17212B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  surface: "#F8FAFC",
  background: "#FFFFFF",
  white: "#FFFFFF",
} as const;

export type PaletteColor = keyof typeof palette;

/** Roles that screens should use. Names match the CSS variables in global.css. */
export const semantic = {
  light: {
    background: palette.background,
    surface: palette.surface,
    foreground: palette.textPrimary,
    muted: palette.textSecondary,
    border: palette.border,
    heading: palette.navy,
    accent: palette.emerald,
    accentSoft: palette.emeraldLight,
    positive: palette.success,
    caution: palette.warning,
    critical: palette.error,
    inform: palette.info,
  },
  dark: {
    background: "#1B2430",
    surface: "#0F1419",
    foreground: "#F8FAFC",
    muted: "#94A3B8",
    border: "#3A4C60",
    heading: "#C5CEFF",
    accent: "#8FD49A",
    accentSoft: "#163024",
    positive: "#8FD49A",
    caution: "#FFD54F",
    critical: "#FF8A80",
    inform: "#9EBEFF",
  },
} as const;

export type SemanticColors = {
  [Key in keyof (typeof semantic)["light"]]: string;
};

export type SemanticVariableName =
  | "--color-background"
  | "--color-surface"
  | "--color-foreground"
  | "--color-muted"
  | "--color-border"
  | "--color-heading"
  | "--color-accent"
  | "--color-accent-soft"
  | "--color-positive"
  | "--color-caution"
  | "--color-critical"
  | "--color-inform";

export type SemanticVariables = Record<SemanticVariableName, string>;

export function semanticToVariables(colors: SemanticColors): SemanticVariables {
  return {
    "--color-background": colors.background,
    "--color-surface": colors.surface,
    "--color-foreground": colors.foreground,
    "--color-muted": colors.muted,
    "--color-border": colors.border,
    "--color-heading": colors.heading,
    "--color-accent": colors.accent,
    "--color-accent-soft": colors.accentSoft,
    "--color-positive": colors.positive,
    "--color-caution": colors.caution,
    "--color-critical": colors.critical,
    "--color-inform": colors.inform,
  };
}

/** Keep this list in sync with `inlineVariables.exclude` in metro.config.js. */
export const semanticVariableNames = Object.keys(
  semanticToVariables(semantic.light),
) as SemanticVariableName[];
