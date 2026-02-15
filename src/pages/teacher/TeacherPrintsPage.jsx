/**
 * Teacher Prints Page
 * View print history and upload PDFs
 *
 * FEATURES:
 * - View all printed certificates (teacher's own)
 * - Filter by date range
 * - Filter by module
 * - Search by student name or certificate number
 * - Upload PDF for printed certificates (if not uploaded yet)
 * - Download PDF
 * - Delete PDF
 * - View print details
 *
 * COMPONENTS TO BUILD:
 * - Print history table with columns:
 *   - Certificate Number
 *   - Student Name
 *   - Module
 *   - PTC Date
 *   - Print Date
 *   - PDF Status (uploaded/not uploaded)
 *   - Actions (Upload/Download/Delete PDF)
 * - Upload PDF modal
 * - Filters bar
 * - Export button
 *
 * LAYOUT:
 * - Header with "Export" button
 * - Stats cards (total prints, this month, PDFs uploaded)
 * - Filters bar
 * - Print history table with pagination
 */

import { useState } from "react";

export default function TeacherPrintsPage() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    moduleId: "",
    search: "",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Print History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your certificate print history and manage PDFs
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          📥 Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    Total Prints
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      124
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
                  <span className="text-green-600 text-xl">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Month
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      28
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
                  <span className="text-purple-600 text-xl">📎</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    PDFs Uploaded
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      118
                    </div>
                    <div className="ml-2 text-sm text-gray-500">/ 124</div>
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
            placeholder="Search student or certificate..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          {/* Module Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.moduleId}
            onChange={(e) =>
              setFilters({ ...filters, moduleId: e.target.value })
            }
          >
            <option value="">All Modules</option>
            <option value="1">KID-BEG</option>
            <option value="2">KID-INT</option>
            <option value="3">TEEN-BEG</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            placeholder="From Date"
          />

          {/* Date To */}
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            placeholder="To Date"
          />
        </div>
      </div>

      {/* Print History Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PTC Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Printed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PDF
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Example Print Record with PDF */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                No. 000123
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                John Doe
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                KID-BEG
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                10/02/2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15/02/2026 14:30
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  ✓ Uploaded
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>

            {/* Example Print Record without PDF */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                No. 000124
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Jane Smith
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                TEEN-INT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                12/02/2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                14/02/2026 09:15
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                  ⚠️ Not Uploaded
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className="text-blue-600 hover:text-blue-700">
                  Upload PDF
                </button>
              </td>
            </tr>

            {/* Another example with PDF */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                No. 000122
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Mike Johnson
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                KID-INT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                08/02/2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                13/02/2026 16:45
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  ✓ Uploaded
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
                <button className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">20</span> of{" "}
            <span className="font-medium">124</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* TODO: Modals */}
      {/* - Upload PDF Modal */}
      {/* - Delete PDF Confirmation */}
    </div>
  );
}
