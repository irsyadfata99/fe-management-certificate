/**
 * Certificates Page (Admin)
 * Main certificate management page
 *
 * FEATURES:
 * - List all certificates
 * - Bulk create certificates (range input)
 * - Migrate certificates to another branch
 * - Filter by status (in_stock, reserved, printed, migrated)
 * - Filter by branch
 * - Search by certificate number
 * - View certificate details
 * - Export to Excel
 *
 * COMPONENTS TO BUILD:
 * - Certificate table with columns:
 *   - Certificate Number (No. 000001 format)
 *   - Status Badge (colored)
 *   - Current Branch
 *   - Reserved By (if reserved)
 *   - Printed For (student name if printed)
 *   - Date
 * - Bulk create modal:
 *   - Start number input
 *   - End number input
 *   - Preview (e.g., "Will create 100 certificates")
 *   - Validation
 * - Migrate modal:
 *   - Start number input
 *   - End number input
 *   - Target branch dropdown
 *   - Confirmation
 * - Filters bar (status, branch, search)
 * - Pagination
 *
 * LAYOUT:
 * - Header with action buttons (Bulk Create, Migrate, Export)
 * - Stats cards (total, in_stock, reserved, printed)
 * - Filters bar
 * - Certificate table
 */

import { useState } from "react";

export default function CertificatesPage() {
  const [filters, setFilters] = useState({
    status: "",
    currentBranchId: "",
    search: "",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all certificates across branches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Bulk Create
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Migrate
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Certificates
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      1,234
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Stock
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      856
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reserved
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      123
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🖨️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Printed
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      255
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search certificate number..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="in_stock">Available</option>
            <option value="reserved">Reserved</option>
            <option value="printed">Printed</option>
            <option value="migrated">Migrated</option>
          </select>

          {/* Branch Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.currentBranchId}
            onChange={(e) =>
              setFilters({ ...filters, currentBranchId: e.target.value })
            }
          >
            <option value="">All Branches</option>
            <option value="1">Head Branch</option>
            <option value="2">Branch A</option>
          </select>

          {/* Clear Filters */}
          <button
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() =>
              setFilters({ status: "", currentBranchId: "", search: "" })
            }
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Certificate data will be loaded here...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO: Modals */}
      {/* - Bulk Create Modal */}
      {/* - Migrate Modal */}
      {/* - Certificate Detail Modal */}
    </div>
  );
}
