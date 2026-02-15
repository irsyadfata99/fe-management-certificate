/**
 * Teachers Page (Admin)
 *
 * FEATURES:
 * - List all teachers
 * - Create new teacher (auto-generated password)
 * - Edit teacher (username, full_name, branch_ids, division_ids)
 * - Reset teacher password
 * - Toggle active/inactive
 * - View teacher details (assigned branches & divisions)
 * - Search by name or username
 *
 * COMPONENTS TO BUILD:
 * - Teacher table with columns:
 *   - Username
 *   - Full Name
 *   - Branches (count/tooltip)
 *   - Divisions (count/tooltip)
 *   - Status Badge
 *   - Actions
 * - Create teacher modal:
 *   - Username input
 *   - Full name input
 *   - Branch multi-select (max 10)
 *   - Division multi-select (max 20)
 * - Edit teacher modal (same fields)
 * - Password display modal (after create/reset)
 * - Teacher detail drawer/modal (view only)
 *
 * LAYOUT:
 * - Header with "Create Teacher" button
 * - Filters (search, show inactive)
 * - Teacher table with pagination
 */

import { useState } from "react";
import { useTeachers } from "@/hooks";

export default function TeachersPage() {
  const [filters, setFilters] = useState({
    includeInactive: false,
    search: "",
  });

  const { data: teachers, isLoading } = useTeachers(filters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage teachers and their assignments
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          + Create Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by username or name..."
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

      {/* Teachers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Divisions
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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading teachers...
                </td>
              </tr>
            ) : teachers?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers?.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {teacher.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {teacher.full_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      {teacher.branch_ids?.length || 0} branches
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      {teacher.division_ids?.length || 0} divisions
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded ${
                        teacher.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {teacher.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button className="text-orange-600 hover:text-orange-700 mr-3">
                      Reset Password
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 mr-3">
                      Toggle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TODO: Modals */}
      {/* - Create Teacher Modal (with branch & division multi-select) */}
      {/* - Edit Teacher Modal */}
      {/* - Password Display Modal (copy button) */}
      {/* - Teacher Detail Modal/Drawer */}
    </div>
  );
}
