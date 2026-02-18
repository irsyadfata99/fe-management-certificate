import { useState, useCallback, useMemo } from "react";
import { usePagination } from "./usePagination";
import { useFilters } from "./useFilters";

export const useTable = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialFilters = {},
    initialSort = null,
    enableSelection = false,
  } = options;

  const pagination = usePagination({
    initialPage,
    initialLimit,
  });

  const filters = useFilters(initialFilters);

  const [sort, setSort] = useState(initialSort);

  const handleSort = useCallback((field) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) {
        return { field, order: "asc" };
      }
      if (prev.order === "asc") {
        return { field, order: "desc" };
      }
      return null;
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
        return new Set();
      }
      return new Set(ids);
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

  const resetOnFilterChange = useCallback(() => {
    pagination.setPage(1);
    clearSelection();
  }, [pagination, clearSelection]);

  const queryParams = useMemo(() => {
    return {
      ...pagination.params,
      ...filters.filters,
      ...sortParams,
    };
  }, [pagination.params, filters.filters, sortParams]);

  return {
    pagination,

    filters: {
      ...filters,
      resetAndReload: resetOnFilterChange,
    },

    sort: {
      current: sort,
      handleSort,
      clearSort,
      params: sortParams,
    },

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
    queryParams,
  };
};
