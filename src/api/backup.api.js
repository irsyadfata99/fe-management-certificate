import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const createBackup = async (payload = {}) => {
  const { data } = await api.post(API_ENDPOINTS.BACKUP.CREATE, payload);
  return data;
};

export const listBackups = async () => {
  const { data } = await api.get(API_ENDPOINTS.BACKUP.LIST);
  return data;
};

export const restoreBackup = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.BACKUP.RESTORE, payload);
  return data;
};

export const deleteBackup = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.BACKUP.DELETE(id));
  return data;
};

export const downloadBackup = async (id) => {
  const response = await api.get(API_ENDPOINTS.BACKUP.DOWNLOAD(id), {
    responseType: "blob",
  });
  return response.data;
};
