import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-product" options={{ headerBackButtonDisplayMode: "default", // or 'full'
    headerBackTitle: "Back", // Optional: Custom text for the back button
    presentation: 'modal' 
     }} />
    </Stack>
  );
}