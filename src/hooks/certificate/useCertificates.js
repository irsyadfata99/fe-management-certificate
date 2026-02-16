/**
 * Certificate Query Hooks (Admin)
 * FIXED: Better response handling with logging
 */

import { useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/api";

/**
 * Get all certificates with filters
 * FIXED: Handle various response structures
 */
export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () => certificateApi.getAllCertificates(params),
    placeholderData: (previousData) => previousData,
    // ✅ FIX: Better response handling
    select: (data) => {
      console.log("[useCertificates] Raw data:", data);

      // Backend might return different structures
      let certificates = [];
      let pagination = { total: 0, pages: 1 };

      // Structure 1: { certificates: [...], pagination: {...} }
      if (data.certificates) {
        certificates = data.certificates;
        pagination = data.pagination || pagination;
      }
      // Structure 2: Direct array
      else if (Array.isArray(data)) {
        certificates = data;
      }
      // Structure 3: { data: [...] }
      else if (data.data && Array.isArray(data.data)) {
        certificates = data.data;
        pagination = data.pagination || pagination;
      }

      console.log("[useCertificates] Processed:", {
        count: certificates.length,
        total: pagination.total,
        pages: pagination.pages,
      });

      return {
        certificates,
        pagination,
      };
    },
  });
};

/**
 * Get certificate stock summary
 * FIXED: Handle stock response structure
 */
export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    // ✅ FIX: Better response handling
    select: (data) => {
      console.log("[useCertificateStock] Raw data:", data);

      let stock = [];

      // Structure 1: { stock: [...] }
      if (data.stock) {
        stock = Array.isArray(data.stock) ? data.stock : [];
      }
      // Structure 2: Direct array
      else if (Array.isArray(data)) {
        stock = data;
      }
      // Structure 3: { data: [...] }
      else if (data.data && Array.isArray(data.data)) {
        stock = data.data;
      }

      console.log("[useCertificateStock] Processed stock:", {
        count: stock.length,
        sample: stock[0],
      });

      return stock;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get stock alerts (low stock branches)
 * FIXED: Handle alerts response structure
 */
export const useStockAlerts = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "alerts", params],
    queryFn: () => certificateApi.getStockAlerts(params),
    // ✅ FIX: Better response handling
    select: (data) => {
      console.log("[useStockAlerts] Raw data:", data);

      let alerts = [];

      if (data.alerts) {
        alerts = Array.isArray(data.alerts) ? data.alerts : [];
      } else if (Array.isArray(data)) {
        alerts = data;
      }

      console.log("[useStockAlerts] Processed alerts:", alerts.length);

      return alerts;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Get certificate statistics
 * FIXED: Handle statistics response structure
 */
export const useCertificateStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "statistics", params],
    queryFn: () => certificateApi.getCertificateStatistics(params),
    // ✅ FIX: Better response handling
    select: (data) => {
      console.log("[useCertificateStatistics] Raw data:", data);

      let statistics = {};

      if (data.statistics) {
        statistics = data.statistics;
      } else if (data.stats) {
        statistics = data.stats;
      } else if (typeof data === "object" && !Array.isArray(data)) {
        statistics = data;
      }

      console.log("[useCertificateStatistics] Processed statistics:", statistics);

      return statistics;
    },
  });
};
