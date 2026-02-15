/**
 * Certificate Query Hooks (Admin)
 * React Query hooks untuk certificate management operations
 */

import { useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/api";

/**
 * Get all certificates with filters
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data, isLoading } = useCertificates({
 *   status: 'in_stock',
 *   currentBranchId: 1,
 *   page: 1,
 *   limit: 20
 * });
 */
export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () => certificateApi.getAllCertificates(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Get certificate stock summary
 * @returns {Object} Query object
 *
 * @example
 * const { data: stock, isLoading } = useCertificateStock();
 * // Returns stock summary for all branches
 */
export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    select: (data) => data.stock,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get stock alerts (low stock branches)
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: alerts } = useStockAlerts({ threshold: 5 });
 */
export const useStockAlerts = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "alerts", params],
    queryFn: () => certificateApi.getStockAlerts(params),
    select: (data) => data.alerts,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Get certificate statistics
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: statistics } = useCertificateStatistics({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 */
export const useCertificateStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "statistics", params],
    queryFn: () => certificateApi.getCertificateStatistics(params),
    select: (data) => data.statistics,
  });
};
