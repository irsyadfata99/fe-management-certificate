import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "@/api";

export const useModules = (params = {}) => {
  return useQuery({
    queryKey: ["modules", params],
    queryFn: () => moduleApi.getAllModules(params),
    select: (data) => ({
      modules: data.modules ?? [],
      pagination: data.pagination ?? null,
    }),
  });
};

export const useModule = (id, options = {}) => {
  return useQuery({
    queryKey: ["modules", id],
    queryFn: () => moduleApi.getModuleById(id),
    select: (data) => data.module,
    enabled: !!id,
    ...options,
  });
};
