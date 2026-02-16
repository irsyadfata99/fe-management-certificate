/**
 * Certificate Query Hooks (Admin)
 *
 * FIXES:
 *  1. Tambah useCertificateBranches — hook ini sebelumnya hilang total
 *  2. Semua select() disesuaikan dengan response shape setelah client.js unwrapping:
 *     - Endpoint dengan envelope { success, data: X }  → select menerima X langsung
 *     - Endpoint dengan envelope { success, branches }
 *       / { success, stock } / dll → select menerima { success, branches/stock/... }
 *  3. Konsistensi: setiap hook punya fallback yang jelas jika data tidak sesuai
 */

import { useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/api";

// =============================================================================
// useCertificateBranches
// FIX: Hook ini sebelumnya tidak ada — menyebabkan getCertificateBranches
//      tidak pernah dipanggil via React Query, hanya dipanggil ad-hoc dari
//      komponen tanpa caching / error handling yang proper.
//
// Backend response: { success: true, branches: [...] }
// Setelah client.js: response.data tetap { success: true, branches: [...] }
//   (karena tidak ada field "data" → tidak di-unwrap ke .data)
// =============================================================================

export const useCertificateBranches = () => {
  return useQuery({
    queryKey: ["certificates", "branches"],
    queryFn: certificateApi.getCertificateBranches,
    select: (data) => {
      console.log("[useCertificateBranches] Raw data:", data);

      let branches = [];

      // Response shape: { success: true, branches: [...] }
      if (data?.branches && Array.isArray(data.branches)) {
        branches = data.branches;
      }
      // Fallback: direct array (jika backend berubah)
      else if (Array.isArray(data)) {
        branches = data;
      }

      console.log("[useCertificateBranches] Processed:", {
        count: branches.length,
        sample: branches[0],
      });

      return branches;
    },
    staleTime: 5 * 60 * 1000, // 5 menit — branch jarang berubah
  });
};

// =============================================================================
// useCertificates
//
// Backend response: { success: true, data: { certificates: [...], pagination: {} } }
// Setelah client.js unwrap (.data ada): select menerima { certificates: [...], pagination: {} }
// =============================================================================

export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () => certificateApi.getCertificates(params),
    placeholderData: (previousData) => previousData,
    select: (data) => {
      console.log("[useCertificates] Raw data:", data);

      let certificates = [];
      let pagination = { total: 0, page: 1, limit: 20, pages: 1 };

      // Shape setelah unwrap: { certificates: [...], pagination: {...} }
      if (data?.certificates && Array.isArray(data.certificates)) {
        certificates = data.certificates;
        pagination = data.pagination ?? pagination;
      }
      // Fallback: direct array
      else if (Array.isArray(data)) {
        certificates = data;
      }
      // Fallback: { data: [...] } (double-wrapped, defensive)
      else if (data?.data && Array.isArray(data.data)) {
        certificates = data.data;
        pagination = data.pagination ?? pagination;
      }

      console.log("[useCertificates] Processed:", {
        count: certificates.length,
        total: pagination.total,
        pages: pagination.pages,
      });

      return { certificates, pagination };
    },
  });
};

// =============================================================================
// useCertificateStock
//
// Backend: getStockSummary → ResponseHelper.success wraps ke { success, data: result }
// Setelah client.js unwrap via .data:
//   { head_branch: { id, code, name, stock: {...} }, sub_branches: [...] }
// select() normalize ke flat array: [{ branch_id, branch_code, branch_name, is_head_branch, stock }]
// =============================================================================

export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    select: (data) => {
      console.log("[useCertificateStock] Raw data:", data);

      let stock = [];

      // ✅ Shape aktual dari getStockSummary (setelah ResponseHelper.success + client.js unwrap):
      // {
      //   head_branch: { id, code, name, stock: { in_stock, reserved, printed, migrated, total } },
      //   sub_branches: [{ branch_id, branch_code, branch_name, stock: {...} }]
      // }
      if (data?.head_branch || data?.sub_branches) {
        const all = [];

        if (data.head_branch) {
          all.push({
            branch_id: data.head_branch.id,
            branch_code: data.head_branch.code,
            branch_name: data.head_branch.name,
            is_head_branch: true,
            stock: data.head_branch.stock ?? {},
          });
        }

        if (Array.isArray(data.sub_branches)) {
          data.sub_branches.forEach((b) =>
            all.push({
              branch_id: b.branch_id,
              branch_code: b.branch_code,
              branch_name: b.branch_name,
              is_head_branch: false,
              stock: b.stock ?? {},
            }),
          );
        }

        stock = all;
      }
      // Fallback: flat array (jika backend berubah di masa depan)
      else if (Array.isArray(data)) {
        stock = data;
      }

      console.log("[useCertificateStock] Processed stock:", {
        count: stock.length,
        sample: stock[0],
      });

      return stock;
    },
    staleTime: 30 * 1000,
  });
};

// =============================================================================
// useStockAlerts
//
// Backend response: { success: true, alerts: [...] }
// Setelah client.js: tidak di-unwrap (tidak ada .data) → { success, alerts }
// =============================================================================

export const useStockAlerts = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "alerts", params],
    queryFn: () => certificateApi.getStockAlerts(params),
    select: (data) => {
      console.log("[useStockAlerts] Raw data:", data);

      let alerts = [];

      if (data?.alerts && Array.isArray(data.alerts)) {
        alerts = data.alerts;
      } else if (Array.isArray(data)) {
        alerts = data;
      }

      console.log("[useStockAlerts] Processed alerts:", alerts.length);
      return alerts;
    },
    staleTime: 60 * 1000,
  });
};

// =============================================================================
// useCertificateStatistics
//
// Backend response: { success: true, data: { ... } }  (diasumsikan pakai .data)
// Setelah client.js unwrap: select menerima { ... } langsung
// =============================================================================

export const useCertificateStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "statistics", params],
    queryFn: () => certificateApi.getCertificateStatistics(params),
    select: (data) => {
      console.log("[useCertificateStatistics] Raw data:", data);

      let statistics = {};

      // Jika sudah di-unwrap via .data → data adalah object statistik langsung
      if (data && typeof data === "object" && !Array.isArray(data)) {
        // Cek apakah ada field "statistics" atau "stats" (belum di-unwrap penuh)
        if (data.statistics) {
          statistics = data.statistics;
        } else if (data.stats) {
          statistics = data.stats;
        } else {
          // Sudah unwrapped langsung
          statistics = data;
        }
      }

      console.log("[useCertificateStatistics] Processed:", statistics);
      return statistics;
    },
  });
};
