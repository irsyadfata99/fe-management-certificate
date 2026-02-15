/**
 * Theme Initializer
 * Initialize theme on app startup (before React renders)
 */

/**
 * Initialize theme from localStorage or system preference
 * This should be called BEFORE React renders to prevent flash
 */
export const initializeTheme = () => {
  try {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("ui-storage");

    if (savedTheme) {
      const { state } = JSON.parse(savedTheme);
      const theme = state?.theme || "system";

      // Determine effective theme
      let effectiveTheme = theme;
      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }

      // Apply theme immediately
      if (effectiveTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // No saved theme, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch (error) {
    console.error("Failed to initialize theme:", error);

    // Fallback to system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }
};
