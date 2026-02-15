/**
 * Certificates Query Hooks (Admin)
 * React Query hooks untuk certificate data fetching
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
    keepPreviousData: true, // For pagination
  });
};

/**
 * Get certificate stock summary
 * @returns {Object} Query object
 *
 * @example
 * const { data: stock } = useCertificateStock();
 */
export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    select: (data) => data.stock,
    refetchInterval: 60000, // Refetch every minute
  });
};

/**
 * Get stock alerts
 * @param {Object} [params] - Query parameters
 * @param {number} [params.threshold] - Alert threshold
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
    refetchInterval: 60000, // Refetch every minute
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
    enabled: !!(params.startDate && params.endDate),
  });
};
