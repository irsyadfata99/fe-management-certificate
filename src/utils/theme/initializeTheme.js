export const initializeTheme = () => {
  try {
    const savedTheme = localStorage.getItem("ui-storage");

    if (savedTheme) {
      const { state } = JSON.parse(savedTheme);
      const theme = state?.theme || "system";

      let effectiveTheme = theme;
      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }

      if (effectiveTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch (error) {
    console.error("Failed to initialize theme:", error);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }
};
