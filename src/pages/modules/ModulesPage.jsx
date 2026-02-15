/**
 * Modules Page (Admin)
 *
 * FEATURES:
 * - List all modules
 * - Create new module
 * - Edit module
 * - Toggle active/inactive
 * - Delete module
 * - Filter by division/sub division
 * - Search by code or name
 *
 * COMPONENTS TO BUILD:
 * - Module table with columns:
 *   - Module Code
 *   - Module Name
 *   - Division
 *   - Sub Division
 *   - Status Badge
 *   - Actions
 * - Create module modal:
 *   - Module code (uppercase input)
 *   - Module name
 *   - Division dropdown
 *   - Sub division dropdown (filtered by division)
 * - Edit module modal (same fields)
 * - Search input
 * - Division filter dropdown
 *
 * LAYOUT:
 * - Header with "Create Module" button
 * - Filters bar (search, division filter, show inactive)
 * - Module table with pagination
 */

import { useState } from "react";
import { useModules } from "@/hooks";

export default function ModulesPage() {
  const [filters, setFilters] = useState({
    includeInactive: false,
    search: "",
  });

  const { data: modules, isLoading } = useModules(filters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Module Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage modules for different divisions
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          + Create Module
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by code or name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Division Filter */}
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Divisions</option>
            <option value="1">Kids</option>
            <option value="2">Teens</option>
            <option value="3">Adults</option>
          </select>

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

      {/* Modules Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Division
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
                  Loading modules...
                </td>
              </tr>
            ) : modules?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No modules found
                </td>
              </tr>
            ) : (
              modules?.map((module) => (
                <tr key={module.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {module.module_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{module.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {module.division_name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {module.sub_div_name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded ${
                        module.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {module.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 mr-3">
                      Toggle
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TODO: Modals */}
      {/* - Create Module Modal */}
      {/* - Edit Module Modal */}
      {/* - Delete Confirmation Dialog */}
    </div>
  );
}
