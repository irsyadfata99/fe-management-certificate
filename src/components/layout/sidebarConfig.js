/**
 * Sidebar Navigation Configuration
 * Role-based menu items untuk SuperAdmin, Admin, dan Teacher
 */

import {
  LayoutDashboard,
  Building2,
  Layers,
  BookOpen,
  Users,
  Award,
  FileText,
  UserCircle,
  Package,
  ClipboardList,
  Printer,
  Clock,
  Database,
} from "lucide-react";

/**
 * Menu structure per role
 * Format: { label, path, icon, badge? }
 */
export const SIDEBAR_MENUS = {
  superadmin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Branches",
      path: "/branches",
      icon: Building2,
      description: "Manage all branches",
    },
    {
      label: "Divisions",
      path: "/divisions",
      icon: Layers,
      description: "Age groups & divisions",
    },
    {
      label: "Modules",
      path: "/modules",
      icon: BookOpen,
      description: "Course modules",
    },
    {
      label: "Teachers",
      path: "/teachers",
      icon: Users,
      description: "Teacher management",
    },
    {
      label: "Certificates",
      path: "/certificates/stock",
      icon: Award,
      description: "Certificate stock",
    },
    {
      label: "Students",
      path: "/students",
      icon: UserCircle,
      description: "Student records",
    },
    {
      label: "Backup",
      path: "/backup",
      icon: Database,
      description: "Database backup",
    },
  ],

  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Certificate Stock",
      path: "/certificates/stock",
      icon: Package,
      description: "Manage stock",
    },
    {
      label: "Certificate Logs",
      path: "/certificates/logs",
      icon: ClipboardList,
      description: "Audit logs",
    },
    {
      label: "Teachers",
      path: "/teachers",
      icon: Users,
      description: "Manage teachers",
    },
    {
      label: "Divisions",
      path: "/divisions",
      icon: Layers,
      description: "Age divisions",
    },
    {
      label: "Modules",
      path: "/modules",
      icon: BookOpen,
      description: "Course modules",
    },
    {
      label: "Students",
      path: "/students",
      icon: UserCircle,
      description: "Student records",
    },
    {
      label: "Backup",
      path: "/backup",
      icon: Database,
      description: "Backup & restore",
    },
  ],

  teacher: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Print Certificate",
      path: "/certificates/print",
      icon: Printer,
      description: "Reserve & print",
    },
    {
      label: "My Reservations",
      path: "/certificates/reservations",
      icon: Clock,
      description: "Active reservations",
      badge: "dynamic", // Will show count
    },
    {
      label: "Print History",
      path: "/certificates/history",
      icon: FileText,
      description: "My print records",
    },
    {
      label: "Students",
      path: "/students",
      icon: UserCircle,
      description: "Search students",
    },
  ],
};

/**
 * Get menu items for current user role
 * @param {string} role - User role (superadmin, admin, teacher)
 * @returns {Array} Menu items
 */
export const getMenuItems = (role) => {
  if (!role) return [];
  const normalizedRole = role.toLowerCase();
  return SIDEBAR_MENUS[normalizedRole] || [];
};

/**
 * Bottom navigation items (common untuk semua roles)
 */
export const BOTTOM_MENU_ITEMS = [
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
    description: "Account settings",
  },
];
