/**
 * Card Component
 * Glassmorphism card with variants
 */

import { cn } from "@/utils/helpers/cn";

/**
 * Card variants
 */
const cardVariants = {
  default:
    "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm",
  glass:
    "bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 shadow-glass dark:shadow-glass-dark",
  elevated:
    "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg transition-shadow",
};

/**
 * Card component
 */
export const Card = ({
  children,
  variant = "default",
  padding = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-lg",
        cardVariants[variant],
        padding && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader - Card header section
 */
export const CardHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * CardTitle - Card title
 */
export const CardTitle = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-neutral-900 dark:text-neutral-100",
        className,
      )}
    >
      {children}
    </h3>
  );
};

/**
 * CardDescription - Card description
 */
export const CardDescription = ({ children, className }) => {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400 mt-1",
        className,
      )}
    >
      {children}
    </p>
  );
};

/**
 * CardContent - Card content section
 */
export const CardContent = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

/**
 * CardFooter - Card footer section
 */
export const CardFooter = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
