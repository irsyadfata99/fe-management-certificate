import { cn } from "@/utils/helpers/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage,
  className,
}) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add last page
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const getInfoText = () => {
    if (!totalItems || !itemsPerPage) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return `Showing ${start} to ${end} of ${totalItems} results`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 flex-wrap",
        className,
      )}
    >
      {showInfo && totalItems && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {getInfoText()}
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            "p-2 rounded-lg transition-colors",
            canGoPrevious
              ? "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              : "text-neutral-300 cursor-not-allowed dark:text-neutral-600",
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-neutral-400 dark:text-neutral-500"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary-500 text-white dark:bg-primary-600"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            "p-2 rounded-lg transition-colors",
            canGoNext
              ? "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              : "text-neutral-300 cursor-not-allowed dark:text-neutral-600",
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
