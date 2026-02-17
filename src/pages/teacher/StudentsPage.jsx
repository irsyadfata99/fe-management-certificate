/**
 * Students Page (Admin)
 *
 * FEATURES:
 * - List all students
 * - View student certificate history
 * - Search students by name
 * - Edit student name
 * - Toggle student active/inactive
 * - View statistics (total certs printed per student)
 * - Export student data
 *
 * COMPONENTS TO BUILD:
 * - Student table with columns:
 *   - Student Name
 *   - Total Certificates
 *   - Last Certificate Date
 *   - Status Badge
 *   - Actions (View History, Edit, Toggle)
 * - Student detail modal/drawer:
 *   - Certificate history table
 *   - Module breakdown
 *   - Timeline view
 * - Edit student modal (name only)
 * - Search input
 * - Stats cards (total students, active, total certs issued)
 *
 * LAYOUT:
 * - Header with stats cards
 * - Filters (search, show inactive)
 * - Student table with pagination
 */

import { useState } from "react";

export default function StudentsPage() {
  const [filters, setFilters] = useState({
    search: "",
    includeInactive: false,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View student records and certificate history
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          📊 Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
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
                    Active Students
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      1,189
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
                  <span className="text-purple-600 text-xl">📄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Certificates Issued
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      3,456
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
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search student by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Show Inactive */}
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={filters.includeInactive}
              onChange={(e) =>
                setFilters({ ...filters, includeInactive: e.target.checked })
              }
            />
            <span className="ml-2 text-sm text-gray-700">Show inactive</span>
          </label>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Certificates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Certificate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Example Student Row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        JD
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      John Doe
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">5</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">15/02/2026</div>
                <div className="text-xs text-gray-400">KID-BEG Module</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className="text-blue-600 hover:text-blue-700 mr-3">
                  View History
                </button>
                <button className="text-gray-600 hover:text-gray-700 mr-3">
                  Edit
                </button>
                <button className="text-orange-600 hover:text-orange-700">
                  Toggle
                </button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">
                        JS
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Jane Smith
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">8</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">12/02/2026</div>
                <div className="text-xs text-gray-400">TEEN-INT Module</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className="text-blue-600 hover:text-blue-700 mr-3">
                  View History
                </button>
                <button className="text-gray-600 hover:text-gray-700 mr-3">
                  Edit
                </button>
                <button className="text-orange-600 hover:text-orange-700">
                  Toggle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO: Modals */}
      {/* - Student History Modal (certificate timeline) */}
      {/* - Edit Student Modal (name only) */}
    </div>
  );
}
