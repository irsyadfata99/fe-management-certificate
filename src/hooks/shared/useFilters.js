import { useState, useCallback } from "react";

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasFilter = useCallback(
    (key) => {
      return (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      );
    },
    [filters],
  );

  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key];
    return value !== undefined && value !== null && value !== "";
  }).length;

  return {
    filters,
    setFilter,
    setMultipleFilters,
    removeFilter,
    clearFilters,
    resetFilters,
    hasFilter,
    activeFilterCount,
  };
};
