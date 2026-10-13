import { type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { VariableContextProvider } from "nativewind";

import { semantic, semanticToVariables } from "./colors";

/**
 * Applies the light or dark semantic tokens as CSS variables.
 * Utilities such as `bg-surface` and `text-foreground` read these variables.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? semantic.dark : semantic.light;

  return (
    <VariableContextProvider value={semanticToVariables(colors)}>
      {children}
    </VariableContextProvider>
  );
}
