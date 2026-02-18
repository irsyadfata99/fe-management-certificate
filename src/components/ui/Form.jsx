import { cn } from "@/utils/helpers/cn";

export const FormField = ({ children, className }) => {
  return <div className={cn("space-y-1", className)}>{children}</div>;
};

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
