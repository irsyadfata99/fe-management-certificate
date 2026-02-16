/**
 * Sidebar Navigation Configuration
 * Role-based menu items untuk SuperAdmin, Admin, dan Teacher
 */

import { LayoutDashboard, Building2, Layers, BookOpen, Users, Award, FileText, UserCircle, Package, ClipboardList, Printer, Clock, Database } from "lucide-react";

/**
 * Menu structure per role
 * Format: { label, path, icon, badge?, children? }
 * children: sub-menu items (untuk grouped navigation)
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
      path: "/certificates/print",
      icon: Printer,
      description: "Reserve & print",
    },
    {
      label: "My Reservations",
      path: "/certificates/reservations",
      icon: Clock,
      description: "Active reservations",
      badge: "dynamic",
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
 * FIX: Handle various role formats from backend (SuperAdmin, Admin, Teacher)
 */
export const getMenuItems = (role) => {
  if (!role) {
    console.warn("[Sidebar] No role provided to getMenuItems");
    return [];
  }

  const normalizedRole = role.toLowerCase().replace(/[_\s-]/g, "");

  const roleMap = {
    superadmin: "superadmin",
    admin: "admin",
    teacher: "teacher",
  };

  const mappedRole = roleMap[normalizedRole];

  console.log("[Sidebar] Original role:", role);
  console.log("[Sidebar] Normalized role:", normalizedRole);
  console.log("[Sidebar] Mapped role:", mappedRole);
  console.log("[Sidebar] Menu items found:", !!SIDEBAR_MENUS[mappedRole]);

  const menuItems = SIDEBAR_MENUS[mappedRole] || [];

  if (!menuItems.length) {
    console.warn(`[Sidebar] No menu items found for role: ${role}`);
  }

  return menuItems;
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
