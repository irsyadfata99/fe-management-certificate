import { cn } from "@/utils/helpers/cn";

export const Tabs = ({ children, className }) => {
  return <div className={cn("w-full", className)}>{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  );
};

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
          ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, active = false, className }) => {
  if (!active) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>{children}</div>
  );
};
