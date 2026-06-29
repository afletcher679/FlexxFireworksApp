import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "../constants/theme";
import { useTheme } from "../hooks/use-theme";
import { supabase } from "../lib/supabase";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const ADMIN_EMAIL = "flexxpyropro@gmail.com";

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + 80,
  };

  const handleLogin = async () => {
    if (!passwordInput) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: passwordInput,
      });

      if (error) throw error;

      // Check if the signed-in user has the admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        Alert.alert("Access Denied", "You do not have admin permissions");
        return;
      }

      setPasswordInput("");
      onLoginSuccess?.();
    } catch (error: any) {
      setLoginError(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loginContainer}>
          <ThemedText type="subtitle" style={styles.title}>
            Admin Login
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Sign in to access inventory
          </ThemedText>

          {loginError ? (
            <ThemedText style={styles.errorText}>{loginError}</ThemedText>
          ) : null}
          <ThemedView style={styles.passwordInputContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                styles.passwordInputWithToggle,
                {
                  backgroundColor: theme.backgroundElement,
                  color: theme.text,
                  borderColor: loginError ? "#ef4444" : theme.textSecondary,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={passwordInput}
              onChangeText={(text) => {
                setLoginError("");
                setPasswordInput(text);
              }}
            />

            <Pressable
              style={styles.passwordToggleButton}
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <SymbolView
                name={{
                  ios: showPassword ? "eye.slash" : "eye",
                  android: showPassword ? "visibility_off" : "visibility",
                  web: showPassword ? "visibility_off" : "visibility",
                }}
                size={20}
                tintColor={theme.textSecondary}
              />
            </Pressable>
          </ThemedView>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              { backgroundColor: theme.tint },
              pressed && styles.pressed,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText
              style={[styles.buttonText, { color: theme.background }]}
            >
              {isLoading ? "Signing in..." : "Login"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    width: "100%",
  },
  loginContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    gap: Spacing.four,
    justifyContent: "center",
    minHeight: 400,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordInputWithToggle: {
    paddingRight: 44,
  },
  passwordToggleButton: {
    position: "absolute",
    right: Spacing.two,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
  },
  loginButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
});
