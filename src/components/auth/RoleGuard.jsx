import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ROLE_HIERARCHY = {
  teacher: 0,
  admin: 1,
  superadmin: 2,
};

export default function RoleGuard({
  children,
  allowedRoles = [],
  redirectTo = "/unauthorized",
  fallback = null,
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const userRole = user?.role?.toLowerCase();
  const userRoleLevel = ROLE_HIERARCHY[userRole] ?? -1;

  const hasPermission = () => {
    if (roles.length === 0) {
      return true;
    }

    if (roles.includes(userRole)) {
      return true;
    }

    const minRequiredLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role.toLowerCase()] ?? Infinity),
    );

    return userRoleLevel >= minRequiredLevel;
  };

  if (!hasPermission()) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
