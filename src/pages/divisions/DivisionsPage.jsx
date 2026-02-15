/**
 * Divisions Page (Admin)
 *
 * FEATURES:
 * - List all divisions with sub divisions
 * - Create new division (with optional sub divisions)
 * - Edit division name
 * - Toggle division active/inactive
 * - Delete division
 * - Manage sub divisions (CRUD)
 * - Age range display for sub divisions
 *
 * COMPONENTS TO BUILD:
 * - Division cards/accordion (expand to show sub divisions)
 * - Create division modal
 *   - Division name field
 *   - Dynamic sub division form (add/remove rows)
 *   - Sub division fields: name, age_min, age_max
 * - Edit division modal (name only)
 * - Sub division item with:
 *   - Name, age range
 *   - Edit/Delete buttons
 * - Age range validation display
 *
 * LAYOUT:
 * - Header with "Create Division" button
 * - Filter (show inactive)
 * - Grid of division cards (2-3 columns)
 * - Each card shows:
 *   - Division name
 *   - Status badge
 *   - Sub divisions count
 *   - List of sub divisions with age ranges
 *   - Actions (Edit, Toggle, Delete)
 */

import { useState } from "react";
import { useDivisions } from "@/hooks";

export default function DivisionsPage() {
  const [filters, setFilters] = useState({
    includeInactive: false,
  });

  const { data: divisions, isLoading } = useDivisions(filters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Division Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage divisions and their sub divisions
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          + Create Division
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
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
            Show inactive divisions
          </span>
        </label>
      </div>

      {/* Divisions Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">
          Loading divisions...
        </div>
      ) : divisions?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No divisions found</p>
          <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
            Create your first division
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions?.map((division) => (
            <div key={division.id} className="bg-white shadow rounded-lg">
              {/* Division Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {division.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {division.sub_divisions?.length || 0} Sub Divisions
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      division.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {division.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Sub Divisions */}
              <div className="px-6 py-4">
                {division.sub_divisions?.length > 0 ? (
                  <div className="space-y-2">
                    {division.sub_divisions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {sub.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Age: {sub.age_min} - {sub.age_max} years
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="text-xs text-blue-600 hover:text-blue-700">
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-xs text-red-600 hover:text-red-700">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No sub divisions
                  </p>
                )}

                <button className="mt-3 w-full text-sm text-blue-600 hover:text-blue-700">
                  + Add Sub Division
                </button>
              </div>

              {/* Division Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Edit
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700">
                  Toggle Status
                </button>
                <button className="text-sm text-red-600 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TODO: Modals */}
      {/* - Create Division Modal (with sub divisions form) */}
      {/* - Edit Division Modal */}
      {/* - Add Sub Division Modal */}
      {/* - Edit Sub Division Modal */}
      {/* - Delete Confirmation Dialogs */}
    </div>
  );
}
