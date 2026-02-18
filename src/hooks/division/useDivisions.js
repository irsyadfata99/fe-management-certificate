import { useQuery } from "@tanstack/react-query";
import { divisionApi } from "@/api";

export const useDivisions = (params = {}) => {
  return useQuery({
    queryKey: ["divisions", params],
    queryFn: () => divisionApi.getAllDivisions(params),
    select: (data) => data.divisions,
  });
};

export const useDivision = (id, options = {}) => {
  return useQuery({
    queryKey: ["divisions", id],
    queryFn: () => divisionApi.getDivisionById(id),
    select: (data) => data.division,
    enabled: !!id,
    ...options,
  });
};
