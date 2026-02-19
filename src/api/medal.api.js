import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getMedalStock = async () => {
  const { data } = await api.get(API_ENDPOINTS.MEDALS.GET_STOCK);
  return data;
};

export const addMedalStock = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.MEDALS.ADD_STOCK, payload);
  return data;
};

export const migrateMedalStock = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.MEDALS.MIGRATE, payload);
  return data;
};

export const getMedalLogs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.MEDALS.GET_LOGS, { params });
  return data;
};

export const getMedalAlerts = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.MEDALS.GET_ALERTS, { params });
  return data;
};
