/**
 * App Layout
 * Main layout untuk authenticated users
 * Includes: Sidebar, Header, Main Content
 */

import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">
            Certificate System
          </h1>
        </div>
        {/* TODO: Add navigation menu */}
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            {/* TODO: Add user menu, notifications */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
