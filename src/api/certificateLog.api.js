import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";
import { buildQueryString } from "@/utils/api/queryBuilder";

export const getCertificateLogs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_LOGS, {
    params,
  });
  return data;
};

export const exportCertificateLogs = async (params = {}) => {
  const queryString = buildQueryString(params);
  const response = await api.get(
    `${API_ENDPOINTS.CERTIFICATES.EXPORT_LOGS}${queryString}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const getCertificateMigrations = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_MIGRATIONS, {
    params,
  });
  return data;
};
