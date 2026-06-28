import { useColorScheme as useRNColorScheme } from "react-native";

export type ThemeOverride = "light" | "dark" | "system";

export function useColorScheme() {
  return useRNColorScheme();
}

export function getThemeOverride(): ThemeOverride {
  return "system";
}

export function setThemeOverride(_: ThemeOverride) {
  // Intentionally no-op on native. Theme testing override is web-only for now.
}

export function subscribeThemeOverrideChange(_: () => void): () => void {
  return () => {};
}
