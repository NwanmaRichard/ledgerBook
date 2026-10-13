const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Semantic colors are swapped at runtime by ThemeProvider.
// Keep this list aligned with semanticVariableNames in src/theme/colors.ts.
module.exports = withNativewind(config, {
  inlineVariables: {
    exclude: [
      "--color-background",
      "--color-surface",
      "--color-foreground",
      "--color-muted",
      "--color-border",
      "--color-heading",
      "--color-accent",
      "--color-accent-soft",
      "--color-positive",
      "--color-caution",
      "--color-critical",
      "--color-inform",
    ],
  },
});
