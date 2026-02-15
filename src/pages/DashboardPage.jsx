/**
 * Dashboard Page
 * Main dashboard - redirects based on user role
 *
 * ROLE-BASED FEATURES:
 *
 * SuperAdmin:
 * - Total branches overview
 * - System health status
 * - Recent activities
 * - Quick actions (Create Branch, View Logs)
 *
 * Admin (Head Branch):
 * - Certificate stock overview
 * - Stock alerts (low stock branches)
 * - Recent certificate activities
 * - Teacher activity summary
 * - Quick actions (Bulk Create, Migrate, Backup)
 *
 * Teacher:
 * - Redirect to TeacherDashboardPage
 *
 * COMPONENTS TO BUILD:
 * - Stats cards (4 columns)
 * - Recent activity table
 * - Stock alerts list
 * - Quick action buttons
 * - Charts (optional - certificate usage over time)
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { isSuperAdmin, isAdmin, isTeacher } from "@/utils/constants/roles";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Redirect teacher to their dashboard
    if (isTeacher(user)) {
      navigate("/teacher", { replace: true });
      return;
    }
  }, [user, navigate]);

  // Don't render anything for teachers (will redirect)
  if (isTeacher(user)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.full_name || user?.username}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 - Total Branches (SuperAdmin) / Certificate Stock (Admin) */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {isSuperAdmin(user) ? "Total Branches" : "Total Stock"}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isSuperAdmin(user) ? "12" : "1,234"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
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
                    {isSuperAdmin(user) ? "Active Users" : "Available"}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isSuperAdmin(user) ? "45" : "856"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
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
                    {isSuperAdmin(user) ? "Pending Actions" : "Reserved"}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isSuperAdmin(user) ? "8" : "123"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
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
                    {isSuperAdmin(user) ? "System Health" : "Printed"}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isSuperAdmin(user) ? "Good" : "255"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isSuperAdmin(user) && (
            <>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Create Branch
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View Logs
              </button>
            </>
          )}
          {isAdmin(user) && (
            <>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Bulk Create
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                Migrate Certs
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View Stock
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Backup DB
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Activities
          </h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500">
            Recent activity data will be displayed here...
          </p>
          {/* TODO: Add activity table/list component */}
        </div>
      </div>
    </div>
  );
}
