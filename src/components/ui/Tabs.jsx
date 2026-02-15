/**
 * Tabs Component
 * Tab navigation with dark mode support
 * FIXED: Better contrast for active/inactive states
 */

import { cn } from "@/utils/helpers/cn";

/**
 * Tabs Container
 */
export const Tabs = ({ children, className }) => {
  return <div className={cn("w-full", className)}>{children}</div>;
};

/**
 * TabsList - Tab buttons container
 */
export const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * TabsTrigger - Individual tab button
 */
export const TabsTrigger = ({
  children,
  active = false,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
        active
          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
};

/**
 * TabsContent - Tab panel content
 */
export const TabsContent = ({ children, active = false, className }) => {
  if (!active) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>{children}</div>
  );
};
