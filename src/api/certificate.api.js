import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getCertificateBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_BRANCHES);
  return data;
};

export const bulkCreateCertificates = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES.BULK_CREATE,
    payload,
  );
  return data;
};

export const getCertificates = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_ALL, {
    params,
  });
  return data;
};

export const getAllCertificates = getCertificates;

export const getCertificateStock = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK);
  return data;
};

export const getStockAlerts = async (threshold = 10) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK_ALERTS, {
    params: { threshold },
  });
  return data;
};

export const migrateCertificates = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES.MIGRATE, payload);
  return data;
};

export const getCertificateStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STATISTICS, {
    params,
  });
  return data;
};
