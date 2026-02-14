/**
 * Backup API
 * Database backup and restore endpoints (Admin - Head Branch only)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Create database backup
 * @param {Object} [payload]
 * @param {string} [payload.description] - Backup description (optional)
 * @returns {Promise<{backup: Object, message: string}>}
 *
 * @example
 * const result = await createBackup({
 *   description: 'Before major update'
 * });
 */
export const createBackup = async (payload = {}) => {
  const { data } = await api.post(API_ENDPOINTS.BACKUP.CREATE, payload);
  return data;
};

/**
 * Get list of all backups
 * @returns {Promise<{backups: Array}>}
 *
 * @example
 * const { backups } = await listBackups();
 * // Returns array sorted by created_at DESC
 */
export const listBackups = async () => {
  const { data } = await api.get(API_ENDPOINTS.BACKUP.LIST);
  return data;
};

/**
 * Restore database from backup
 * ⚠️ DESTRUCTIVE OPERATION - Will replace current database
 * @param {Object} payload
 * @param {number} payload.backupId - Backup ID to restore
 * @param {string} payload.confirmPassword - Admin password for confirmation
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await restoreBackup({
 *   backupId: 5,
 *   confirmPassword: 'admin-password'
 * });
 */
export const restoreBackup = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.BACKUP.RESTORE, payload);
  return data;
};

/**
 * Delete backup file
 * @param {number} id - Backup ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteBackup(5);
 */
export const deleteBackup = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.BACKUP.DELETE(id));
  return data;
};

/**
 * Download backup file
 * @param {number} id - Backup ID
 * @returns {Promise<Blob>}
 *
 * @example
 * const blob = await downloadBackup(5);
 * // Use downloadBlob() helper to save file
 *
 * import { downloadBlob } from '@/utils/helpers/download';
 * const response = await api.get(API_ENDPOINTS.BACKUP.DOWNLOAD(id), {
 *   responseType: 'blob'
 * });
 * downloadBlob(response.data, 'backup.sql');
 */
export const downloadBackup = async (id) => {
  const response = await api.get(API_ENDPOINTS.BACKUP.DOWNLOAD(id), {
    responseType: "blob",
  });
  return response.data;
};
