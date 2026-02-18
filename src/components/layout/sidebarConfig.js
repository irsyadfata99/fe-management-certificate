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
  ],
};
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
      console.warn(
        `[Sidebar] Unknown role: "${role}" (normalized: "${normalized}")`,
      );
    }
    return [];
  }

  return SIDEBAR_MENUS[mapped] ?? [];
};

export const BOTTOM_MENU_ITEMS = [
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
    description: "Account settings",
  },
];
