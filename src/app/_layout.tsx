import { Stack } from "expo-router/stack";

import { DevThemeToggle } from "../components/dev-theme-toggle";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-product" options={{ headerShown: false }} />
      </Stack>
      <DevThemeToggle />
    </>
  );
}
