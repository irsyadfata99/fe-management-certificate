/**
 * useTheme Hook
 * Manages dark mode state and persistence
 */

import { useEffect, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";

/**
 * Theme values: 'light' | 'dark' | 'system'
 */
export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  // Get effective theme (resolves 'system' to 'light' or 'dark')
  const getEffectiveTheme = useCallback(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  // Apply theme to HTML element
  const applyTheme = useCallback((effectiveTheme) => {
    const root = document.documentElement;

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);
  }, [getEffectiveTheme, applyTheme]);

  // Watch for theme changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, getEffectiveTheme, applyTheme]);

  // Watch for system theme changes (when theme is 'system')
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      applyTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, applyTheme]);

  // Toggle between light and dark (skips 'system')
  const toggleTheme = useCallback(() => {
    const effectiveTheme = getEffectiveTheme();
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  }, [getEffectiveTheme, setTheme]);

  return {
    theme, // Current theme setting ('light' | 'dark' | 'system')
    effectiveTheme: getEffectiveTheme(), // Actual applied theme ('light' | 'dark')
    setTheme, // Set theme explicitly
    toggleTheme, // Toggle between light/dark
  };
};
