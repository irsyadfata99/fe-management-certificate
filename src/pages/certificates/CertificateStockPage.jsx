/**
 * Certificate Stock Page (Admin)
 * Overview of certificate stock across all branches
 *
 * FEATURES:
 * - Stock overview per branch
 * - Stock breakdown (in_stock, reserved, printed)
 * - Low stock alerts (configurable threshold)
 * - Quick migrate action
 * - Export stock report
 * - Visual indicators (progress bars, badges)
 *
 * COMPONENTS TO BUILD:
 * - Stock summary cards at top
 * - Branch stock table/cards with:
 *   - Branch name
 *   - Total stock
 *   - Available (in_stock)
 *   - Reserved count
 *   - Printed count
 *   - Progress bar visualization
 *   - Alert badge if low stock
 *   - Quick actions (Migrate to this branch)
 * - Stock alerts section (branches below threshold)
 * - Threshold setting input
 *
 * LAYOUT:
 * - Header with "Export Report" button
 * - Alert threshold setting
 * - Low stock alerts (if any)
 * - Branch stock grid/table
 */

import { useState } from "react";

export default function CertificateStockPage() {
  const [threshold, setThreshold] = useState(10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Stock Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor certificate inventory across all branches
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          📊 Export Report
        </button>
      </div>

      {/* Alert Threshold Setting */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Low Stock Alert Threshold:
          </label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
          />
          <span className="text-sm text-gray-500">
            Alert when available stock ≤ {threshold}
          </span>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Low Stock Alert
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Branch A: Only 5 certificates available</li>
                <li>Branch C: Only 3 certificates available</li>
              </ul>
            </div>
            <div className="mt-3">
              <button className="text-sm font-medium text-red-600 hover:text-red-500">
                Migrate certificates to these branches →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example Branch Card 1 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Head Branch (HQ)
              </h3>
              <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                Healthy
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">450</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">45</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Printed</p>
                <p className="text-2xl font-bold text-blue-600">105</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Stock Usage</span>
                <span>600 total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                View Details
              </button>
              <button className="flex-1 text-sm px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Migrate Here
              </button>
            </div>
          </div>
        </div>

        {/* Example Branch Card 2 - Low Stock */}
        <div className="bg-white shadow rounded-lg overflow-hidden border-2 border-red-300">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Branch A</h3>
              <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
                ⚠️ Low Stock
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-2xl font-bold text-red-600">5</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Printed</p>
                <p className="text-2xl font-bold text-blue-600">83</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Stock Usage</span>
                <span>100 total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "5%" }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                View Details
              </button>
              <button className="flex-1 text-sm px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                🚨 Migrate Here
              </button>
            </div>
          </div>
        </div>

        {/* Add more branch cards... */}
      </div>

      {/* Summary Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Stock Summary by Branch
          </h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Branch
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Available
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Reserved
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Printed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Stock data will be loaded here...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
