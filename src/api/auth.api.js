import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const login = async (credentials) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return data;
};

export const logout = async () => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
  return data;
};

export const refreshAccessToken = async (refreshToken) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return data;
};

export const changePassword = async (passwords) => {
  const { data } = await api.patch(
    API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    passwords,
  );
  return data;
};

export const changeUsername = async ({ newUsername, password }) => {
  const { data } = await api.patch(API_ENDPOINTS.AUTH.CHANGE_USERNAME, {
    newUsername,
    currentPassword: password,
  });
  return data;
};
