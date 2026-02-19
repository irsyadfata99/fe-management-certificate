import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medalApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useMedalStock = () => {
  return useQuery({
    queryKey: ["medals", "stock"],
    queryFn: medalApi.getMedalStock,
    select: (data) => {
      // Normalise response shape dari backend
      // Response: { head_branch: {...}, sub_branches: [...] }
      return {
        head_branch: data?.head_branch || null,
        sub_branches: data?.sub_branches || [],
      };
    },
    staleTime: 30 * 1000,
  });
};

export const useMedalLogs = (params = {}) => {
  return useQuery({
    queryKey: ["medals", "logs", params],
    queryFn: () => medalApi.getMedalLogs(params),
    select: (data) => ({
      logs: data?.logs || [],
      pagination: data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
    placeholderData: (previousData) => previousData,
  });
};

export const useMedalAlerts = (threshold = 10) => {
  return useQuery({
    queryKey: ["medals", "alerts", { threshold }],
    queryFn: () => medalApi.getMedalAlerts({ threshold }),
    select: (data) => ({
      certificate_alerts: data?.certificate_alerts || [],
      medal_alerts: data?.medal_alerts || [],
      summary: data?.summary || {},
      head_branch: data?.head_branch || null,
    }),
    staleTime: 60 * 1000,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useAddMedalStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medalApi.addMedalStock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["medals"] });
      queryClient.invalidateQueries({ queryKey: ["certificates", "stock"] });
      queryClient.invalidateQueries({ queryKey: ["certificates", "alerts"] });
      toast.success(`${data?.quantity_added ?? ""} medals added successfully`.trim());
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useMigrateMedalStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medalApi.migrateMedalStock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["medals"] });
      queryClient.invalidateQueries({ queryKey: ["certificates", "stock"] });
      queryClient.invalidateQueries({ queryKey: ["certificates", "alerts"] });

      const qty = data?.quantity_migrated ?? "";
      const to = data?.to_branch?.code ?? "";
      toast.success(`${qty} medals migrated to ${to}`.trim());
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
