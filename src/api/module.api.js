import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getAllModules = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.MODULES.GET_ALL, { params });
  return data;
};

export const getModuleById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.MODULES.GET_BY_ID(id));
  return data;
};

export const createModule = async (moduleData) => {
  const { data } = await api.post(API_ENDPOINTS.MODULES.CREATE, moduleData);
  return data;
};

export const updateModule = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.MODULES.UPDATE(id), updates);
  return data;
};

export const toggleModuleActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.MODULES.TOGGLE_ACTIVE(id));
  return data;
};

export const deleteModule = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.MODULES.DELETE(id));
  return data;
};
