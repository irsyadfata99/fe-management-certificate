import { useEffect, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  const getEffectiveTheme = useCallback(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  const applyTheme = useCallback((effectiveTheme) => {
    const root = document.documentElement;

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);
  }, [getEffectiveTheme, applyTheme]);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);

    localStorage.setItem("theme", theme);
  }, [theme, getEffectiveTheme, applyTheme]);

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

  const toggleTheme = useCallback(() => {
    const effectiveTheme = getEffectiveTheme();
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  }, [getEffectiveTheme, setTheme]);

  return {
    theme,
    effectiveTheme: getEffectiveTheme(),
    setTheme,
    toggleTheme,
  };
};
