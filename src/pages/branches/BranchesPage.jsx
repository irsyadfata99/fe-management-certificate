/**
 * Branches Page (SuperAdmin Only)
 *
 * FEATURES:
 * - List all branches (tree view: head → sub branches)
 * - Create new branch (head or sub)
 * - Edit branch details
 * - Toggle active/inactive status
 * - Convert head ↔ sub branch
 * - Reset admin password for head branches
 * - Delete branch (with confirmation)
 * - Search/filter branches
 *
 * COMPONENTS TO BUILD:
 * - Branch tree/list with hierarchy indicator
 * - Create branch modal (conditional fields based on is_head_branch)
 * - Edit branch modal
 * - Branch card/item showing:
 *   - Code, name, status badge
 *   - Branch type badge (Head/Sub)
 *   - Parent branch (if sub)
 *   - Action buttons (Edit, Toggle Active, Delete, Reset Password)
 * - Confirmation dialog for delete
 * - Password display modal (after reset)
 *
 * LAYOUT:
 * - Header with "Create Branch" button
 * - Filters (active/inactive, head/sub)
 * - Tree view or grouped list
 */

import { useState } from "react";
import { useBranches } from "@/hooks";

export default function BranchesPage() {
  const [filters, setFilters] = useState({
    includeInactive: false,
  });

  const { data: branches, isLoading } = useBranches(filters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Branch Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all branches and their hierarchy
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          + Create Branch
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={filters.includeInactive}
              onChange={(e) =>
                setFilters({ ...filters, includeInactive: e.target.checked })
              }
            />
            <span className="ml-2 text-sm text-gray-700">
              Show inactive branches
            </span>
          </label>
        </div>
      </div>

      {/* Branches List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All Branches ({branches?.length || 0})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Loading branches...
            </div>
          ) : branches?.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No branches found
            </div>
          ) : (
            branches?.map((branch) => (
              <div
                key={branch.id}
                className="px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {/* Indent for sub branches */}
                      {!branch.is_head_branch && (
                        <span className="text-gray-400 ml-4">└─</span>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {branch.name}
                          </span>
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {branch.code}
                          </span>

                          {/* Head/Sub Badge */}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              branch.is_head_branch
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {branch.is_head_branch
                              ? "Head Branch"
                              : "Sub Branch"}
                          </span>

                          {/* Active/Inactive Badge */}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              branch.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {branch.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {!branch.is_head_branch && branch.parent_name && (
                          <p className="text-sm text-gray-500 mt-1">
                            Parent: {branch.parent_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Edit
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-700">
                      Toggle Status
                    </button>
                    {branch.is_head_branch && (
                      <button className="text-sm text-orange-600 hover:text-orange-700">
                        Reset Password
                      </button>
                    )}
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TODO: Modals */}
      {/* - Create Branch Modal */}
      {/* - Edit Branch Modal */}
      {/* - Delete Confirmation Dialog */}
      {/* - Password Display Modal */}
    </div>
  );
}
