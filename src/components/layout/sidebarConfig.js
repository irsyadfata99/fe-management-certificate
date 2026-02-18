/**
 * Sidebar Navigation Configuration
 * Role-based menu items untuk SuperAdmin, Admin, dan Teacher
 *
 * Route map:
 *   /dashboard               — semua role
 *   /profile                 — semua role
 *   /branches                — superadmin
 *   /certificates            — admin
 *   /certificates/stock      — admin
 *   /certificates/logs       — admin
 *   /teachers                — admin
 *   /divisions               — admin  ← DivisionsPage
 *   /modules                 — admin
 *   /backup                  — admin
 *   /certificates/print      — teacher
 *   /certificates/reservations — teacher
 *   /certificates/history    — teacher
 *   /students                — teacher
 */

import { LayoutDashboard, Building2, Layers, BookOpen, Users, Award, FileText, UserCircle, Package, ClipboardList, Printer, Clock, Database } from "lucide-react";

/**
 * Menu structure per role
 * Format: { label, path, icon, badge?, description?, children? }
 * children: sub-menu items (grouped navigation)
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
  ],

  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    // GROUPED: Certificate menu dengan 3 sub-menu
    {
      label: "Certificates",
      icon: Award,
      description: "Manage certificates",
      children: [
        {
          label: "Certificate Stock",
          path: "/certificates/stock",
          icon: Package,
          description: "Monitor stock",
        },
        {
          label: "Certificates",
          path: "/certificates",
          icon: Award,
          description: "Manage certificates",
        },
        {
          label: "Certificate Logs",
          path: "/certificates/logs",
          icon: ClipboardList,
          description: "Audit logs",
        },
      ],
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
      path: "/certificates/reservations",
      icon: Printer,
      description: "Reserve & print",
    },
    {
      label: "Print History",
      path: "/certificates/print",
      icon: Clock,
      description: "My print History",
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
 * Get menu items for current user role.
 * Handles various role formats from backend (e.g. "SuperAdmin", "super_admin", "admin")
 */
export const getMenuItems = (role) => {
  if (!role) return [];

  const normalized = role.toLowerCase().replace(/[_\s-]/g, "");

  const roleMap = {
    superadmin: "superadmin",
    admin: "admin",
    teacher: "teacher",
  };

  const mapped = roleMap[normalized];

  if (!mapped) {
    if (import.meta.env.DEV) {
      console.warn(`[Sidebar] Unknown role: "${role}" (normalized: "${normalized}")`);
    }
    return [];
  }

  return SIDEBAR_MENUS[mapped] ?? [];
};

/**
 * Bottom navigation items — ditampilkan di semua role
 */
export const BOTTOM_MENU_ITEMS = [
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
    description: "Account settings",
  },
];
