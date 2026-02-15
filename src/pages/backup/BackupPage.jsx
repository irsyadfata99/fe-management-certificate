/**
 * Backup Page (Admin - Head Branch Only)
 * Database backup and restore management
 *
 * FEATURES:
 * - Create new backup (with optional description)
 * - List all backups
 * - Download backup file
 * - Restore from backup (with password confirmation)
 * - Delete backup
 * - Auto backup scheduling info
 *
 * COMPONENTS TO BUILD:
 * - Create backup button + modal
 * - Backup list/table with:
 *   - Filename
 *   - Description
 *   - File size
 *   - Created date
 *   - Actions (Download, Restore, Delete)
 * - Restore confirmation modal:
 *   - ⚠️ Warning message
 *   - Password input for confirmation
 *   - Restore button
 * - Delete confirmation dialog
 * - Warning banner about restore dangers
 *
 * LAYOUT:
 * - Header with "Create Backup" button
 * - Warning banner
 * - Backup list with actions
 */

import { useState } from "react";

export default function BackupPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Database Backup & Restore
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage database backups (Head Branch only)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          💾 Create Backup
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-600 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Restoring a backup will{" "}
                  <strong>replace all current data</strong>
                </li>
                <li>
                  Always create a backup before restoring to prevent data loss
                </li>
                <li>Backup files are stored securely on the server</li>
                <li>Only head branch admins can perform backup operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Backup Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Backups</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Size</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">245 MB</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Backup</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Available Backups
          </h2>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Filename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Example Backup Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900">
                  backup_2026-02-15_14-30-00.sql
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  Before major update
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">24.5 MB</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">15/02/2026 14:30</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Restore
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900">
                  backup_2026-02-14_09-00-00.sql
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">Daily backup</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">23.8 MB</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">14/02/2026 09:00</div>
                <div className="text-xs text-gray-500">1 day ago</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
                <button className="text-orange-600 hover:text-orange-700">
                  Restore
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900">
                  backup_2026-02-13_09-00-00.sql
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">Daily backup</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">23.2 MB</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">13/02/2026 09:00</div>
                <div className="text-xs text-gray-500">2 days ago</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
                <button className="text-orange-600 hover:text-orange-700">
                  Restore
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO: Modals */}
      {/* - Create Backup Modal (description input) */}
      {/* - Restore Confirmation Modal (password input + warnings) */}
      {/* - Delete Confirmation Dialog */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Database Backup
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add an optional description for this backup
            </p>
            <input
              type="text"
              placeholder="e.g., Before major update"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start mb-4">
              <span className="text-red-600 text-3xl mr-3">⚠️</span>
              <div>
                <h3 className="text-lg font-medium text-red-900">
                  Restore Database
                </h3>
                <p className="text-sm text-red-700 mt-2">
                  This will replace ALL current data with the backup. This
                  action cannot be undone!
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Enter your admin password to confirm:
            </p>
            <input
              type="password"
              placeholder="Admin password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">
                Restore Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
