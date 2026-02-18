import { forwardRef } from "react";
import { cn } from "@/utils/helpers/cn";

export const Textarea = forwardRef(
  (
    {
      error = false,
      helperText,
      fullWidth = false,
      rows = 4,
      className,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:disabled:bg-neutral-800 resize-y";

    const normalStyles =
      "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-500";

    const errorStyles =
      "border-danger-500 bg-danger-50 text-danger-900 placeholder:text-danger-400 dark:border-danger-600 dark:bg-danger-950 dark:text-danger-100";

    return (
      <div className={cn(fullWidth && "w-full")}>
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            baseStyles,
            error ? errorStyles : normalStyles,
            className,
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
