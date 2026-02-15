/**
 * Table Hook
 * Comprehensive hook untuk table management (pagination, filters, sorting, selection)
 */

import { useState, useCallback, useMemo } from "react";
import { usePagination } from "./usePagination";
import { useFilters } from "./useFilters";

/**
 * Manage table state (pagination, filters, sorting, selection)
 * @param {Object} [options] - Configuration options
 * @returns {Object} Table state and handlers
 *
 * @example
 * const table = useTable({
 *   initialFilters: { status: 'active' },
 *   initialSort: { field: 'created_at', order: 'desc' }
 * });
 *
 * const { data } = useStudents({
 *   ...table.pagination.params,
 *   ...table.filters.filters,
 *   ...table.sort.params
 * });
 *
 * <TableFilters {...table.filters} />
 * <Table
 *   data={data}
 *   sort={table.sort}
 *   selection={table.selection}
 * />
 * <Pagination {...table.pagination} />
 */
export const useTable = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialFilters = {},
    initialSort = null,
    enableSelection = false,
  } = options;

  // Pagination
  const pagination = usePagination({
    initialPage,
    initialLimit,
  });

  // Filters
  const filters = useFilters(initialFilters);

  // Sorting
  const [sort, setSort] = useState(initialSort);

  const handleSort = useCallback((field) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) {
        return { field, order: "asc" };
      }
      if (prev.order === "asc") {
        return { field, order: "desc" };
      }
      return null; // Clear sort
    });
  }, []);

  const clearSort = useCallback(() => {
    setSort(null);
  }, []);

  const sortParams = useMemo(() => {
    if (!sort) return {};
    return {
      sortBy: sort.field,
      order: sort.order,
    };
  }, [sort]);

  // Selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback((ids) => {
    setSelectedIds((prev) => {
      if (prev.size === ids.length) {
        return new Set(); // Deselect all
      }
      return new Set(ids); // Select all
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id) => {
      return selectedIds.has(id);
    },
    [selectedIds],
  );

  const isAllSelected = useCallback(
    (ids) => {
      return ids.length > 0 && ids.every((id) => selectedIds.has(id));
    },
    [selectedIds],
  );

  const selectedCount = selectedIds.size;
  const selectedArray = Array.from(selectedIds);

  // Reset when filters change
  const resetOnFilterChange = useCallback(() => {
    pagination.setPage(1);
    clearSelection();
  }, [pagination, clearSelection]);

  // Combined params for API calls
  const queryParams = useMemo(() => {
    return {
      ...pagination.params,
      ...filters.filters,
      ...sortParams,
    };
  }, [pagination.params, filters.filters, sortParams]);

  return {
    // Pagination
    pagination,

    // Filters
    filters: {
      ...filters,
      resetAndReload: resetOnFilterChange,
    },

    // Sorting
    sort: {
      current: sort,
      handleSort,
      clearSort,
      params: sortParams,
    },

    // Selection (if enabled)
    ...(enableSelection && {
      selection: {
        selectedIds,
        selectedCount,
        selectedArray,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        isSelected,
        isAllSelected,
      },
    }),

    // Combined
    queryParams,
  };
};
