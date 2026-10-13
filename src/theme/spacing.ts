/**
 * 4-point spacing scale, in density-independent pixels.
 * `global.css` sets `--spacing: 4px`, so Tailwind steps match these values:
 * `p-1` is xs, `p-2` is sm, `p-4` is md, `p-6` is lg, `p-8` is xl, `p-12` is xxl.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  /** Minimum width and height for tappable controls. */
  touch: 48,
} as const;
