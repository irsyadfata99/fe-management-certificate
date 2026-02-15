/**
 * Filters Hook
 * Custom hook untuk mengelola filter state
 */

import { useState, useCallback } from "react";

/**
 * Manage filter state
 * @param {Object} [initialFilters={}] - Initial filter values
 * @returns {Object} Filter state and handlers
 *
 * @example
 * const { filters, setFilter, clearFilters, resetFilters } = useFilters({
 *   status: 'active',
 *   search: ''
 * });
 *
 * const { data } = useBranches(filters);
 *
 * <input
 *   value={filters.search}
 *   onChange={(e) => setFilter('search', e.target.value)}
 * />
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Set single filter value
   */
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Set multiple filters at once
   */
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  /**
   * Remove a filter
   */
  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Clear all filters (empty object)
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Reset filters to initial values
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /**
   * Check if filter has value
   */
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

  /**
   * Count active filters
   */
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
