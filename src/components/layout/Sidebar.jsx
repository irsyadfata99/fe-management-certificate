/**
 * Sidebar Component
 * Collapsible sidebar with role-based navigation
 */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Network,
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  Database,
  Menu,
  LogOut,
  Home,
  FileCheck,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

/**
 * Navigation menu items for different roles
 */
const navigationConfig = {
  superadmin: [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "branches",
      icon: Building2,
      label: "Cabang",
      path: "/branches",
    },
    {
      id: "divisions",
      icon: Network,
      label: "Divisi",
      path: "/divisions",
    },
    {
      id: "modules",
      icon: BookOpen,
      label: "Modul",
      path: "/modules",
    },
    {
      id: "teachers",
      icon: Users,
      label: "Guru",
      path: "/teachers",
    },
    {
      id: "certificates",
      icon: FileText,
      label: "Sertifikat",
      path: "/certificates",
    },
    {
      id: "students",
      icon: GraduationCap,
      label: "Siswa",
      path: "/students",
    },
    {
      id: "backup",
      icon: Database,
      label: "Backup",
      path: "/backup",
    },
  ],
  admin: [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "branches",
      icon: Building2,
      label: "Cabang",
      path: "/branches",
    },
    {
      id: "divisions",
      icon: Network,
      label: "Divisi",
      path: "/divisions",
    },
    {
      id: "modules",
      icon: BookOpen,
      label: "Modul",
      path: "/modules",
    },
    {
      id: "teachers",
      icon: Users,
      label: "Guru",
      path: "/teachers",
    },
    {
      id: "certificates",
      icon: FileText,
      label: "Sertifikat",
      path: "/certificates",
    },
    {
      id: "students",
      icon: GraduationCap,
      label: "Siswa",
      path: "/students",
    },
    {
      id: "backup",
      icon: Database,
      label: "Backup",
      path: "/backup",
    },
  ],
  teacher: [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      path: "/teacher/dashboard",
    },
    {
      id: "certificates",
      icon: FileCheck,
      label: "Sertifikat Saya",
      path: "/teacher/certificates",
    },
    {
      id: "history",
      icon: History,
      label: "Riwayat Print",
      path: "/teacher/history",
    },
    {
      id: "profile",
      icon: User,
      label: "Profil",
      path: "/teacher/profile",
    },
  ],
};

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  // Get menu items based on user role
  const menuItems =
    navigationConfig[user?.role?.toLowerCase()] || navigationConfig.teacher;

  /**
   * Check if menu item is active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen 
        bg-white dark:bg-neutral-800 
        border-r border-neutral-200 dark:border-neutral-700
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-900 dark:text-white">
                Certificate
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Management
              </p>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          )}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-white">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </span>
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <Badge
                variant={
                  user?.role === "superadmin"
                    ? "danger"
                    : user?.role === "admin"
                      ? "primary"
                      : "success"
                }
                className="text-xs mt-1"
              >
                {user?.role === "superadmin"
                  ? "Super Admin"
                  : user?.role === "admin"
                    ? "Admin"
                    : "Teacher"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200
                ${
                  active
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }
                ${sidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!sidebarCollapsed && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-neutral-600 dark:text-neutral-400 
            hover:bg-red-50 dark:hover:bg-red-900/20
            hover:text-red-600 dark:hover:text-red-400
            transition-all duration-200
            ${sidebarCollapsed ? "justify-center" : ""}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}
