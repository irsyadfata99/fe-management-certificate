/**
 * Certificate Query Hooks (Admin)
 * React Query hooks untuk fetching certificate data
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
 *   page: 1
 * });
 */
export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () => certificateApi.getAllCertificates(params),
    keepPreviousData: true,
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
  });
};

/**
 * Get stock alerts
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: alerts } = useStockAlerts({ threshold: 10 });
 */
export const useStockAlerts = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "alerts", params],
    queryFn: () => certificateApi.getStockAlerts(params),
    select: (data) => data.alerts,
  });
};

/**
 * Get certificate statistics
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: stats } = useCertificateStatistics({
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
