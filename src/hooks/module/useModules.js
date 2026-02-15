/**
 * Modules Query Hooks
 * React Query hooks untuk fetching module data (Admin)
 */

import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "@/api";

/**
 * Get all modules
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: modules, isLoading } = useModules();
 * const { data: activeModules } = useModules({ includeInactive: false });
 */
export const useModules = (params = {}) => {
  return useQuery({
    queryKey: ["modules", params],
    queryFn: () => moduleApi.getAllModules(params),
    select: (data) => data.modules,
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
