/**
 * Component Showcase Page
 * Display Sidebar, Navbar, and all reusable UI components
 */

import { useState } from "react";
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
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Home,
  FileCheck,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui";

export default function ComponentShowcasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [role] = useState("admin"); // Can be: admin, teacher, superadmin

  // Navigation items for different roles
  const adminMenuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    { id: "branches", icon: Building2, label: "Cabang", path: "/branches" },
    { id: "divisions", icon: Network, label: "Divisi", path: "/divisions" },
    { id: "modules", icon: BookOpen, label: "Modul", path: "/modules" },
    { id: "teachers", icon: Users, label: "Guru", path: "/teachers" },
    {
      id: "certificates",
      icon: FileText,
      label: "Sertifikat",
      path: "/certificates",
    },
    { id: "students", icon: GraduationCap, label: "Siswa", path: "/students" },
    { id: "backup", icon: Database, label: "Backup", path: "/backup" },
  ];

  const teacherMenuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    {
      id: "certificates",
      icon: FileCheck,
      label: "Sertifikat Saya",
      path: "/certificates",
    },
    { id: "history", icon: History, label: "Riwayat Print", path: "/history" },
    { id: "profile", icon: User, label: "Profil", path: "/profile" },
  ];

  const menuItems = role === "teacher" ? teacherMenuItems : adminMenuItems;

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out
          bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "w-20" : "w-64"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
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
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">AD</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  Admin User
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="primary" className="text-xs">
                    {role === "teacher" ? "Teacher" : "Admin"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
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
                {!sidebarCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
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

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* NAVBAR */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="h-full px-4 flex items-center justify-between gap-4">
            {/* Left: Mobile Menu + Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Settings */}
              <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>

              {/* User Menu */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">AD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Component Showcase
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Sidebar, Navbar, dan semua reusable components dalam satu
                halaman
              </p>
            </div>

            {/* Layout Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Sidebar Features</h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Collapsible sidebar (click menu icon)
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Role-based navigation items
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Active state indicator
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    User profile section
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Responsive mobile drawer
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Navbar Features</h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Global search bar
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Notification bell with badge
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Settings quick access
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    User menu dropdown
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    Sticky positioning
                  </li>
                </ul>
              </div>
            </div>

            {/* Role Switcher Demo */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Role-Based Navigation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Sidebar menu berubah berdasarkan role user:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">Admin</Badge>
                  </div>
                  <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Dashboard</li>
                    <li>• Cabang</li>
                    <li>• Divisi</li>
                    <li>• Modul</li>
                    <li>• Guru</li>
                    <li>• Sertifikat</li>
                    <li>• Siswa</li>
                    <li>• Backup</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="success">Teacher</Badge>
                  </div>
                  <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Dashboard</li>
                    <li>• Sertifikat Saya</li>
                    <li>• Riwayat Print</li>
                    <li>• Profil</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* All Components Link */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                Lihat Semua UI Components
              </h3>
              <p className="text-primary-100 mb-4">
                Untuk melihat showcase lengkap dari buttons, forms, tables,
                modals, dan components lainnya
              </p>
              <button
                onClick={() => {
                  window.location.href = "/components";
                }}
                className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Buka Component Library →
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Cara Menggunakan</h3>
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <p>
                  <strong>1. Toggle Sidebar:</strong> Klik icon menu di header
                  sidebar untuk collapse/expand
                </p>
                <p>
                  <strong>2. Mobile View:</strong> Di mobile, sidebar menjadi
                  drawer yang bisa dibuka dengan tombol menu di navbar
                </p>
                <p>
                  <strong>3. Navigation:</strong> Klik menu items untuk melihat
                  active state
                </p>
                <p>
                  <strong>4. Search:</strong> Gunakan search bar di navbar untuk
                  pencarian global
                </p>
                <p>
                  <strong>5. Notifications:</strong> Badge merah di bell icon
                  menunjukkan notifikasi baru
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
