/**
 * Divisions Query Hooks
 * React Query hooks untuk fetching division data
 */

import { useQuery } from "@tanstack/react-query";
import { divisionApi } from "@/api";

/**
 * Get all divisions
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: divisions, isLoading } = useDivisions();
 */
export const useDivisions = (params = {}) => {
  return useQuery({
    queryKey: ["divisions", params],
    queryFn: () => divisionApi.getAllDivisions(params),
    select: (data) => data.divisions,
  });
};

/**
 * Get division by ID
 * @param {number} id - Division ID
 * @param {Object} [options] - Query options
 * @returns {Object} Query object
 *
 * @example
 * const { data: division } = useDivision(1);
 */
export const useDivision = (id, options = {}) => {
  return useQuery({
    queryKey: ["divisions", id],
    queryFn: () => divisionApi.getDivisionById(id),
    select: (data) => data.division,
    enabled: !!id,
    ...options,
  });
};
