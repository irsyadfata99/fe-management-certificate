/**
 * Input Component
 * Text input with dark mode support
 */

import { forwardRef } from "react";
import { cn } from "@/utils/helpers/cn";

/**
 * Input sizes
 */
const inputSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

/**
 * Input component
 */
export const Input = forwardRef(
  (
    {
      size = "md",
      error = false,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:disabled:bg-neutral-800";

    const normalStyles =
      "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-500";

    const errorStyles =
      "border-danger-500 bg-danger-50 text-danger-900 placeholder:text-danger-400 dark:border-danger-600 dark:bg-danger-950 dark:text-danger-100";

    return (
      <div className={cn(fullWidth && "w-full")}>
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              error ? errorStyles : normalStyles,
              inputSizes[size],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs",
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

Input.displayName = "Input";
