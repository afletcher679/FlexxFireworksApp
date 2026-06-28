import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "../constants/theme";
import {
  getThemeOverride,
  setThemeOverride,
  subscribeThemeOverrideChange,
  ThemeOverride,
} from "../hooks/use-color-scheme";
import { useTheme } from "../hooks/use-theme";
import { ThemedText } from "./themed-text";

const THEME_OPTIONS: ThemeOverride[] = ["light", "dark", "system"];

export function DevThemeToggle() {
  const theme = useTheme();
  const [themeOverride, setThemeOverrideState] = useState<ThemeOverride>(() =>
    getThemeOverride(),
  );

  const shouldShow = __DEV__ && Platform.OS === "web";

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    const syncOverride = () => setThemeOverrideState(getThemeOverride());
    syncOverride();

    return subscribeThemeOverrideChange(syncOverride);
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlayContainer, { borderColor: theme.border }]}
    >
      <View
        style={[
          styles.toggleContainer,
          {
            borderColor: theme.border,
            backgroundColor: theme.backgroundElement,
          },
        ]}
      >
        <ThemedText style={styles.label} themeColor="textSecondary">
          Theme
        </ThemedText>
        <View style={styles.optionsRow}>
          {THEME_OPTIONS.map((option) => {
            const isActive = themeOverride === option;

            return (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  styles.optionButton,
                  {
                    backgroundColor: isActive ? theme.tint : theme.background,
                    borderColor: theme.border,
                  },
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setThemeOverride(option);
                  setThemeOverrideState(option);
                }}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    {
                      color: isActive ? theme.background : theme.text,
                    },
                  ]}
                >
                  {option}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: Spacing.three,
    right: Spacing.three,
    zIndex: 999,
  },
  toggleContainer: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  pressed: {
    opacity: 0.7,
  },
});
