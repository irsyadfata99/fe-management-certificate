/**
 * Layout Component
 * Main layout wrapper dengan Sidebar + Navbar + Content area
 */

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/helpers/cn";

export function Layout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-64",
          sidebarCollapsed && "lg:ml-20",
        )}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-16">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Export both default and named
export default Layout;
