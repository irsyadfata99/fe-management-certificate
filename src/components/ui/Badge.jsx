/**
 * Badge Component
 * Status indicator with variants
 */

import { cn } from "@/utils/helpers/cn";

/**
 * Badge variants
 */
const badgeVariants = {
  default:
    "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
  primary:
    "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800",
  success:
    "bg-success-100 text-success-700 border-success-200 dark:bg-success-900 dark:text-success-300 dark:border-success-800",
  warning:
    "bg-warning-100 text-warning-700 border-warning-200 dark:bg-warning-900 dark:text-warning-300 dark:border-warning-800",
  danger:
    "bg-danger-100 text-danger-700 border-danger-200 dark:bg-danger-900 dark:text-danger-300 dark:border-danger-800",
  info: "bg-info-100 text-info-700 border-info-200 dark:bg-info-900 dark:text-info-300 dark:border-info-800",
};

/**
 * Badge sizes
 */
const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

/**
 * Badge component
 */
export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-md border",
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
