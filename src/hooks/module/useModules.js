/**
 * Modules Query Hooks
 * React Query hooks untuk fetching module data (Admin)
 */

import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "@/api";

/**
 * Get all modules (paginated)
 * @param {Object} [params]              - Query parameters
 * @param {boolean} [params.includeInactive=false] - Include inactive modules
 * @param {number}  [params.page=1]      - Page number (1-indexed)
 * @param {number}  [params.limit=8]     - Items per page
 * @returns {Object} Query object with { data: { modules, pagination }, isLoading, ... }
 *
 * @example
 * const { data } = useModules({ page: 1, limit: 8 });
 * const modules    = data?.modules    ?? [];
 * const pagination = data?.pagination ?? {};
 */
export const useModules = (params = {}) => {
  return useQuery({
    queryKey: ["modules", params],
    queryFn: () => moduleApi.getAllModules(params),
    // Return both modules array AND pagination metadata so callers can render
    // page controls. Previously this only returned data.modules, which silently
    // discarded the pagination object returned by the backend.
    select: (data) => ({
      modules: data.modules ?? [],
      pagination: data.pagination ?? null,
    }),
  });
};

/**
 * Get module by ID
 * @param {number} id - Module ID
 * @param {Object} [options] - Query options
 * @returns {Object} Query object
 *
 * @example
 * const { data: module } = useModule(1);
 */
export const useModule = (id, options = {}) => {
  return useQuery({
    queryKey: ["modules", id],
    queryFn: () => moduleApi.getModuleById(id),
    select: (data) => data.module,
    enabled: !!id,
    ...options,
  });
};
