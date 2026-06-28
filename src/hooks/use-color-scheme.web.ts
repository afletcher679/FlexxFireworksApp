import { useEffect, useState } from "react";

type WebColorScheme = "light" | "dark";
export type ThemeOverride = WebColorScheme | "system";
const THEME_STORAGE_KEY = "theme-override";
const THEME_OVERRIDE_EVENT = "theme-override-change";

function getQueryThemeOverride(): ThemeOverride | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const value = params.get("theme")?.toLowerCase();

  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
}

function getStoredThemeOverride(): ThemeOverride | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
}

function getActiveThemeOverride(): ThemeOverride {
  return getQueryThemeOverride() ?? getStoredThemeOverride() ?? "system";
}

function getSystemColorScheme(): WebColorScheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getResolvedColorScheme(): WebColorScheme {
  const override = getActiveThemeOverride();

  if (override === "light" || override === "dark") {
    return override;
  }

  return getSystemColorScheme();
}

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<WebColorScheme>(() =>
    getResolvedColorScheme(),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateScheme = () => setColorScheme(getResolvedColorScheme());

    updateScheme();
    media.addEventListener("change", updateScheme);
    window.addEventListener("popstate", updateScheme);
    window.addEventListener("hashchange", updateScheme);
    window.addEventListener(THEME_OVERRIDE_EVENT, updateScheme);

    return () => {
      media.removeEventListener("change", updateScheme);
      window.removeEventListener("popstate", updateScheme);
      window.removeEventListener("hashchange", updateScheme);
      window.removeEventListener(THEME_OVERRIDE_EVENT, updateScheme);
    };
  }, []);

  return colorScheme;
}

export function getThemeOverride(): ThemeOverride {
  return getActiveThemeOverride();
}

export function setThemeOverride(nextOverride: ThemeOverride) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, nextOverride);

  const url = new URL(window.location.href);
  url.searchParams.set("theme", nextOverride);
  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
  window.dispatchEvent(new Event(THEME_OVERRIDE_EVENT));
}

export function subscribeThemeOverrideChange(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("popstate", listener);
  window.addEventListener("hashchange", listener);
  window.addEventListener(THEME_OVERRIDE_EVENT, listener);

  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("hashchange", listener);
    window.removeEventListener(THEME_OVERRIDE_EVENT, listener);
  };
}
