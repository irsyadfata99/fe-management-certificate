/**
 * Pagination Hook
 * Custom hook untuk mengelola pagination state
 */

import { useState, useCallback } from "react";

/**
 * Manage pagination state
 * @param {Object} [options] - Configuration options
 * @param {number} [options.initialPage=1] - Initial page number
 * @param {number} [options.initialLimit=20] - Initial items per page
 * @returns {Object} Pagination state and handlers
 *
 * @example
 * const { page, limit, setPage, setLimit, reset, params } = usePagination({
 *   initialPage: 1,
 *   initialLimit: 20
 * });
 *
 * const { data } = useStudents(params);
 *
 * <Pagination
 *   page={page}
 *   onPageChange={setPage}
 * />
 */
export const usePagination = (options = {}) => {
  const { initialPage = 1, initialLimit = 20 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  /**
   * Reset pagination to initial values
   */
  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((pageNumber) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  /**
   * Change items per page and reset to page 1
   */
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  /**
   * Params object ready to be used in queries
   */
  const params = { page, limit };

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    params,
  };
};
