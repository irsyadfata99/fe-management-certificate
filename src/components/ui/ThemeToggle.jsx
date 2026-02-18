import { useTheme } from "@/hooks/shared/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

export const ThemeToggle = ({ className }) => {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
        "dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800",
        className,
      )}
      aria-label="Toggle theme"
    >
      {effectiveTheme === "dark" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export const ThemeToggleAdvanced = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const currentThemeIcon =
    themes.find((t) => t.value === theme)?.icon || Monitor;
  const Icon = currentThemeIcon;

  return (
    <div className="relative group">
      <button
        className={cn(
          "p-2 rounded-lg transition-colors",
          "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
          "dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800",
          className,
        )}
        aria-label="Select theme"
      >
        <Icon className="w-5 h-5" />
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          const isActive = theme === themeOption.value;

          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                isActive
                  ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
              )}
            >
              <ThemeIcon className="w-4 h-4" />
              <span>{themeOption.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
