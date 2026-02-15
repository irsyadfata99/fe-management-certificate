/**
 * Certificate Logs Page (Admin)
 * View all certificate-related activities and history
 *
 * FEATURES:
 * - View all certificate logs
 * - Filter by action type (bulk_create, migrate, reserve, print, release)
 * - Filter by user (actor)
 * - Filter by date range
 * - Search by certificate number
 * - Export logs to Excel
 * - View migration history
 *
 * COMPONENTS TO BUILD:
 * - Activity log table with columns:
 *   - Date/Time
 *   - Action Type (badge with color)
 *   - Actor (user who performed action)
 *   - Certificate Number(s)
 *   - Details (from/to branch, student name, etc)
 * - Filter bar:
 *   - Action type dropdown
 *   - User dropdown
 *   - Date range picker
 *   - Certificate number search
 * - Migration history section (separate tab/view)
 * - Export button
 *
 * LAYOUT:
 * - Header with "Export Logs" button
 * - Tabs (All Logs / Migrations)
 * - Filters bar
 * - Activity log table with pagination
 */

import { useState } from "react";

export default function CertificateLogsPage() {
  const [activeTab, setActiveTab] = useState("logs"); // 'logs' or 'migrations'
  const [filters, setFilters] = useState({
    actionType: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Logs & History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all certificate activities and migrations
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          📥 Export Logs
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("logs")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "logs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setActiveTab("migrations")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "migrations"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Migration History
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Action Type Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.actionType}
            onChange={(e) =>
              setFilters({ ...filters, actionType: e.target.value })
            }
          >
            <option value="">All Actions</option>
            <option value="bulk_create">Bulk Create</option>
            <option value="migrate">Migrate</option>
            <option value="reserve">Reserve</option>
            <option value="print">Print</option>
            <option value="release">Release</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            placeholder="Start Date"
          />

          {/* Date To */}
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            placeholder="End Date"
          />

          {/* Search */}
          <input
            type="text"
            placeholder="Search certificate number..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* Logs Table (All Logs Tab) */}
      {activeTab === "logs" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example Log Entry */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  15/02/2026 14:30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                    Print
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  teacher1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  No. 000123
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Student: John Doe | Module: KID-BEG
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  15/02/2026 10:15
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                    Bulk Create
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  admin_hq
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  No. 001001-001100
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Created 100 certificates
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  14/02/2026 16:45
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                    Migrate
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  admin_hq
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  No. 000050-000099
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  From: Head Branch → To: Branch A
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Migration History Table */}
      {activeTab === "migrations" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  From Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  To Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Certificate Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Migrated By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  14/02/2026 16:45
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Head Branch
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Branch A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  No. 000050 - No. 000099
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  50
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  admin_hq
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
