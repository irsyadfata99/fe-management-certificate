import { cn } from "@/utils/helpers/cn";
import { ChevronUp, ChevronDown } from "lucide-react";

export const Table = ({ children, className }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table
        className={cn(
          "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700",
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className }) => {
  return (
    <thead className={cn("bg-neutral-50 dark:bg-neutral-800/50", className)}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className }) => {
  return (
    <tbody
      className={cn(
        "bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700",
        className,
      )}
    >
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, onClick, className }) => {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer",
        "hover:bg-neutral-50 dark:hover:bg-neutral-700/50",
        className,
      )}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({
  children,
  sortable = false,
  sortDirection,
  onSort,
  align = "left",
  className,
}) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        "px-6 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider",
        alignClasses[align],
        sortable &&
          "cursor-pointer select-none hover:text-neutral-700 dark:hover:text-neutral-300",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp
              className={cn(
                "w-3 h-3 -mb-1",
                sortDirection === "asc"
                  ? "text-primary-500"
                  : "text-neutral-300 dark:text-neutral-600",
              )}
            />
            <ChevronDown
              className={cn(
                "w-3 h-3",
                sortDirection === "desc"
                  ? "text-primary-500"
                  : "text-neutral-300 dark:text-neutral-600",
              )}
            />
          </div>
        )}
      </div>
    </th>
  );
};

export const TableCell = ({ children, align = "left", className }) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      className={cn(
        "px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100",
        alignClasses[align],
        className,
      )}
    >
      {children}
    </td>
  );
};

export const TableEmpty = ({ message = "No data available", colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <div className="py-12">
          <p className="text-neutral-500 dark:text-neutral-400">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const TableLoading = ({ colSpan, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={colSpan}>
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
