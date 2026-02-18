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

export const useCertificateStock = () => {
  return useQuery({
    queryKey: ["certificates", "stock"],
    queryFn: certificateApi.getCertificateStock,
    select: (data) => {
      console.log("[useCertificateStock] Raw data:", data);

      let stock = [];
      if (data?.head_branch || data?.sub_branches) {
        const all = [];

        if (data.head_branch) {
          all.push({
            branch_id: data.head_branch.id,
            branch_code: data.head_branch.code,
            branch_name: data.head_branch.name,
            is_head_branch: true,
            total: parseInt(data.head_branch.stock?.total || 0, 10),
            in_stock: parseInt(data.head_branch.stock?.in_stock || 0, 10),
            reserved: parseInt(data.head_branch.stock?.reserved || 0, 10),
            printed: parseInt(data.head_branch.stock?.printed || 0, 10),
            migrated: parseInt(data.head_branch.stock?.migrated || 0, 10),
          });
        }

        if (Array.isArray(data.sub_branches)) {
          data.sub_branches.forEach((b) =>
            all.push({
              branch_id: b.branch_id,
              branch_code: b.branch_code,
              branch_name: b.branch_name,
              is_head_branch: false,
              total: parseInt(b.stock?.total || 0, 10),
              in_stock: parseInt(b.stock?.in_stock || 0, 10),
              reserved: parseInt(b.stock?.reserved || 0, 10),
              printed: parseInt(b.stock?.printed || 0, 10),
              migrated: parseInt(b.stock?.migrated || 0, 10),
            }),
          );
        }

        stock = all;
      } else if (Array.isArray(data)) {
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
