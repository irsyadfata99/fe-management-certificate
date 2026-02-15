/**
 * Auth API
 * Authentication endpoints
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Login
 * @param {Object} credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 *
 * @example
 * const data = await login({ username: 'admin', password: 'password' });
 * // { user: {...}, accessToken: 'xxx', refreshToken: 'yyy' }
 */
export const login = async (credentials) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return data;
};

/**
 * Logout
 * Invalidates refresh token on server
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await logout();
 */
export const logout = async () => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  return data;
};

/**
 * Get current user
 * @returns {Promise<{user: Object}>}
 *
 * @example
 * const { user } = await getCurrentUser();
 */
export const getCurrentUser = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
  return data;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 *
 * @example
 * const { accessToken, refreshToken } = await refreshAccessToken('refresh-token');
 */
export const refreshAccessToken = async (refreshToken) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return data;
};

/**
 * Change password
 * @param {Object} passwords
 * @param {string} passwords.currentPassword - Current password
 * @param {string} passwords.newPassword - New password
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await changePassword({
 *   currentPassword: 'old123',
 *   newPassword: 'new123'
 * });
 */
export const changePassword = async (passwords) => {
  // FIX: Backend menggunakan PATCH, bukan POST (lihat authRoutes.js)
  const { data } = await api.patch(
    API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    passwords,
  );
  return data;
};

/**
 * Change username
 * @param {Object} payload
 * @param {string} payload.newUsername - New username
 * @param {string} payload.password - Current password for confirmation
 * @returns {Promise<{message: string, user: Object}>}
 *
 * @example
 * const { user } = await changeUsername({
 *   newUsername: 'newuser',
 *   password: 'current-password'
 * });
 */
export const changeUsername = async ({ newUsername, password }) => {
  // FIX: Backend mengharapkan field "currentPassword", bukan "password"
  // (lihat authRoutes.js: body("currentPassword").notEmpty()...)
  const { data } = await api.patch(API_ENDPOINTS.AUTH.CHANGE_USERNAME, {
    newUsername,
    currentPassword: password,
  });
  return data;
};
