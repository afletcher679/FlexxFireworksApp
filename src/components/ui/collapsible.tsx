import { SymbolView } from "expo-symbols";
import { PropsWithChildren, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    Extrapolation,
    FadeIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue, withTiming,
} from "react-native-reanimated";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../hooks/use-theme";

interface CollapsibleProps extends PropsWithChildren {
  title: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Collapsible({
  children,
  title,
  isOpen,
  onOpenChange,
}: CollapsibleProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const theme = useTheme();
  const rotation = useSharedValue(0);

  const resolvedIsOpen = isOpen ?? internalIsOpen;

  const setOpen = (nextIsOpen: boolean) => {
    if (isOpen === undefined) {
      setInternalIsOpen(nextIsOpen);
    }

    onOpenChange?.(nextIsOpen);
  };

  // Sync rotation animation with isOpen state
  useEffect(() => {
    rotation.value = withTiming(resolvedIsOpen ? 1 : 0, { duration: 300 });
  }, [resolvedIsOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate:
            interpolate(rotation.value, [0, 1], [0, 90], Extrapolation.CLAMP) +
            "deg",
        },
      ],
    };
  });

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [
          styles.heading,
          pressed && styles.pressedHeading,
        ]}
        onPress={() => setOpen(!resolvedIsOpen)}
      >
        <ThemedView type="backgroundElement" style={styles.button}>
          <Animated.View style={animatedStyle}>
            <SymbolView
              name={{
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right",
              }}
              size={14}
              weight="bold"
              tintColor={theme.text}
            />
          </Animated.View>
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {resolvedIsOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingLeft: Spacing.two,
    paddingVertical: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
  },
});
