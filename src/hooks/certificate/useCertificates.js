import { useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/api";

export const useCertificateBranches = () => {
  return useQuery({
    queryKey: ["certificates", "branches"],
    queryFn: certificateApi.getCertificateBranches,
    select: (data) => {
      console.log("[useCertificateBranches] Raw data:", data);

      let branches = [];

      if (data?.branches && Array.isArray(data.branches)) {
        branches = data.branches;
      } else if (Array.isArray(data)) {
        branches = data;
      }

      console.log("[useCertificateBranches] Processed:", {
        count: branches.length,
        sample: branches[0],
      });

      return branches;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () => certificateApi.getCertificates(params),
    placeholderData: (previousData) => previousData,
    select: (data) => {
      console.log("[useCertificates] Raw data from API:", data);
      console.log("[useCertificates] Query params:", params);

      let certificates = [];
      let pagination = { total: 0, page: 1, limit: 20, pages: 1 };

      if (data?.certificates && Array.isArray(data.certificates)) {
        certificates = data.certificates;

        if (data.pagination) {
          pagination = {
            total: data.pagination.total || 0,
            page: data.pagination.page || 1,
            limit: data.pagination.limit || 20,
            pages: data.pagination.pages || 1,
          };
        }
      } else if (Array.isArray(data)) {
        certificates = data;
      } else if (data?.data && Array.isArray(data.data)) {
        certificates = data.data;
        if (data.pagination) {
          pagination = data.pagination;
        }
      }

      console.log("[useCertificates] Processed:", {
        certificatesCount: certificates.length,
        pagination: pagination,
      });

      return { certificates, pagination };
    },
  });
};

// ─── useCertificateStock ──────────────────────────────────────────────────────
// Response backend sekarang include medal_stock dan imbalance per branch.
// Shape yang dinormalkan:
// [
//   {
//     branch_id, branch_code, branch_name, is_head_branch,
//     total, in_stock, reserved, printed, migrated,  ← certificate stock
//     medal_stock,                                    ← medal quantity
//     imbalance,                                      ← cert_in_stock - medal_stock
//   }
// ]

export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    select: (data) => {
      console.log("[useCertificateStock] Raw data:", data);

      const all = [];

      if (data?.head_branch) {
        const hb = data.head_branch;
        all.push({
          branch_id: hb.id,
          branch_code: hb.code,
          branch_name: hb.name,
          is_head_branch: true,
          // certificate stock — bisa datang dari hb.certificate_stock atau hb.stock
          total: parseInt(hb.certificate_stock?.total ?? hb.stock?.total ?? 0, 10),
          in_stock: parseInt(hb.certificate_stock?.in_stock ?? hb.stock?.in_stock ?? 0, 10),
          reserved: parseInt(hb.certificate_stock?.reserved ?? hb.stock?.reserved ?? 0, 10),
          printed: parseInt(hb.certificate_stock?.printed ?? hb.stock?.printed ?? 0, 10),
          migrated: parseInt(hb.certificate_stock?.migrated ?? hb.stock?.migrated ?? 0, 10),
          // medal
          medal_stock: hb.medal_stock ?? 0,
          imbalance: hb.imbalance ?? 0,
        });
      }

      if (Array.isArray(data?.sub_branches)) {
        data.sub_branches.forEach((b) => {
          all.push({
            branch_id: b.branch_id,
            branch_code: b.branch_code,
            branch_name: b.branch_name,
            is_head_branch: false,
            total: parseInt(b.certificate_stock?.total ?? b.stock?.total ?? 0, 10),
            in_stock: parseInt(b.certificate_stock?.in_stock ?? b.stock?.in_stock ?? 0, 10),
            reserved: parseInt(b.certificate_stock?.reserved ?? b.stock?.reserved ?? 0, 10),
            printed: parseInt(b.certificate_stock?.printed ?? b.stock?.printed ?? 0, 10),
            migrated: parseInt(b.certificate_stock?.migrated ?? b.stock?.migrated ?? 0, 10),
            medal_stock: b.medal_stock ?? 0,
            imbalance: b.imbalance ?? 0,
          });
        });
      }

      // Fallback: format lama (array langsung)
      if (all.length === 0 && Array.isArray(data)) {
        return data;
      }

      console.log("[useCertificateStock] Processed stock:", {
        count: all.length,
        sample: all[0],
      });

      return all;
    },
    staleTime: 30 * 1000,
  });
};

// ─── useStockAlerts ───────────────────────────────────────────────────────────
// Response backend sekarang include:
// { certificate_alerts, medal_alerts, summary, head_branch }
// Select mengembalikan seluruh object agar bisa digunakan secara terpisah
// oleh component yang membutuhkan.

export const useStockAlerts = (threshold = 10) => {
  return useQuery({
    queryKey: ["certificates", "alerts", { threshold }],
    queryFn: () => certificateApi.getStockAlerts(threshold),
    select: (data) => {
      console.log("[useStockAlerts] Raw data:", data);

      // Response baru: { certificate_alerts, medal_alerts, summary, head_branch }
      if (data?.certificate_alerts || data?.medal_alerts) {
        return {
          certificate_alerts: data.certificate_alerts || [],
          medal_alerts: data.medal_alerts || [],
          summary: data.summary || {},
          head_branch: data.head_branch || null,
          // backward compat: beberapa component mungkin pakai data.alerts
          alerts: [...(data.certificate_alerts || []), ...(data.medal_alerts || [])],
        };
      }

      // Fallback response lama: { alerts: [...] } atau array langsung
      const alerts = data?.alerts || (Array.isArray(data) ? data : []);
      return {
        certificate_alerts: alerts,
        medal_alerts: [],
        summary: {},
        head_branch: null,
        alerts,
      };
    },
    staleTime: 60 * 1000,
  });
};

export const useCertificateStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "statistics", params],
    queryFn: () => certificateApi.getCertificateStatistics(params),
    select: (data) => {
      console.log("[useCertificateStatistics] Raw data:", data);

      let statistics = {};

      if (data && typeof data === "object" && !Array.isArray(data)) {
        if (data.statistics) {
          statistics = data.statistics;
        } else if (data.stats) {
          statistics = data.stats;
        } else {
          statistics = data;
        }
      }

      console.log("[useCertificateStatistics] Processed:", statistics);
      return statistics;
    },
  });
};
