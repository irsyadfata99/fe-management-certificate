/**
 * Form Field Components
 * Wrapper components for consistent form layouts
 */

import { cn } from "@/utils/helpers/cn";

/**
 * FormField - Wrapper for form inputs
 */
export const FormField = ({ children, className }) => {
  return <div className={cn("space-y-1", className)}>{children}</div>;
};

/**
 * FormLabel - Label for form inputs
 */
export const FormLabel = ({ children, required, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-neutral-700 dark:text-neutral-300",
        className,
      )}
    >
      {children}
      {required && <span className="text-danger-500 ml-1">*</span>}
    </label>
  );
};

/**
 * FormError - Error message for form inputs
 */
export const FormError = ({ children, className }) => {
  if (!children) return null;

  return (
    <p
      className={cn("text-xs text-danger-600 dark:text-danger-400", className)}
    >
      {children}
    </p>
  );
};

/**
 * FormHelperText - Helper text for form inputs
 */
export const FormHelperText = ({ children, className }) => {
  if (!children) return null;

  return (
    <p
      className={cn(
        "text-xs text-neutral-500 dark:text-neutral-400",
        className,
      )}
    >
      {children}
    </p>
  );
};
