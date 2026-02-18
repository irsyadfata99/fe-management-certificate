import { cn } from "@/utils/helpers/cn";

const spinnerSizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4",
};

export const Spinner = ({ size = "md", className }) => {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-primary-500 border-r-transparent",
        spinnerSizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay = ({ message, show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700",
        className,
      )}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 3, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 && "w-3/4")}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className }) => {
  return (
    <div
      className={cn(
        "p-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg",
        className,
      )}
    >
      <Skeleton className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-6" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
};
