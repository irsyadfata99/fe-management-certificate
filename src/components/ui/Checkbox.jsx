/**
 * Checkbox Component
 * Checkbox input with label and dark mode support
 */

import { forwardRef } from "react";
import { cn } from "@/utils/helpers/cn";

/**
 * Checkbox component
 */
export const Checkbox = forwardRef(
  (
    { label, description, error = false, helperText, className, ...props },
    ref,
  ) => {
    const checkboxStyles =
      "w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-600 dark:bg-neutral-800 dark:checked:bg-primary-600";

    const errorCheckboxStyles =
      "border-danger-500 text-danger-500 focus:ring-danger-500 dark:border-danger-600";

    return (
      <div>
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              checkboxStyles,
              error && errorCheckboxStyles,
              className,
            )}
            {...props}
          />
          {(label || description) && (
            <div className="flex-1">
              {label && (
                <span className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-200">
                  {label}
                </span>
              )}
              {description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          )}
        </label>

        {/* Helper Text / Error Message */}
        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs ml-6",
              error
                ? "text-danger-600 dark:text-danger-400"
                : "text-neutral-500 dark:text-neutral-400",
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
