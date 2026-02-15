/**
 * Teacher Dashboard Page
 * Main dashboard for Teacher role
 *
 * FEATURES:
 * - Certificate availability status
 * - Active reservations (max 5)
 * - Recent prints history
 * - Quick actions (Reserve, View Prints)
 * - Assigned branches display
 * - Assigned divisions display
 * - Statistics (total printed this month, etc)
 *
 * COMPONENTS TO BUILD:
 * - Stats cards (available certs, active reservations, printed this month)
 * - Certificate availability widget (per branch)
 * - Active reservations list with:
 *   - Certificate number
 *   - Reserved time
 *   - Expires in (countdown)
 *   - Release button
 * - Recent prints preview table
 * - Quick action buttons
 *
 * LAYOUT:
 * - Header with welcome message
 * - Stats cards (3 columns)
 * - Two columns: Availability & Reservations
 * - Recent prints section
 */

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's your certificate overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    Available to Reserve
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      45
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      certificates
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
                    Active Reservations
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      3
                    </div>
                    <div className="ml-2 text-sm text-gray-500">/ 5 max</div>
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
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🖨️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Printed This Month
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
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Availability */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Certificate Availability
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Branch 1 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Head Branch
                  </p>
                  <p className="text-xs text-gray-500">Your primary branch</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">35</p>
                  <p className="text-xs text-gray-500">available</p>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">Branch A</p>
                  <p className="text-xs text-gray-500">Secondary branch</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">10</p>
                  <p className="text-xs text-gray-500">available</p>
                </div>
              </div>

              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Reserve Certificate →
              </button>
            </div>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Active Reservations (3/5)
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {/* Reservation 1 */}
              <div className="flex items-start justify-between p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <p className="text-sm font-mono font-medium text-gray-900">
                    No. 000123
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reserved 1 hour ago
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    ⏰ Expires in 23 hours
                  </p>
                </div>
                <button className="text-xs text-red-600 hover:text-red-700">
                  Release
                </button>
              </div>

              {/* Reservation 2 */}
              <div className="flex items-start justify-between p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <p className="text-sm font-mono font-medium text-gray-900">
                    No. 000124
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reserved 30 minutes ago
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    ⏰ Expires in 23.5 hours
                  </p>
                </div>
                <button className="text-xs text-red-600 hover:text-red-700">
                  Release
                </button>
              </div>

              {/* Reservation 3 */}
              <div className="flex items-start justify-between p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <p className="text-sm font-mono font-medium text-gray-900">
                    No. 000125
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reserved 10 minutes ago
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ⏰ Expires in 23.8 hours
                  </p>
                </div>
                <button className="text-xs text-red-600 hover:text-red-700">
                  Release
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                You can reserve up to 5 certificates at once
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Prints */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Prints</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View All →
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Certificate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                No. 000123
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                John Doe
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                KID-BEG
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15/02/2026
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                No. 000122
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Jane Smith
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                TEEN-INT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                14/02/2026
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
