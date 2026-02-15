/**
 * useRoleGuard Hook
 * Custom hook for checking role-based permissions
 */

import { useAuthStore } from "@/store/authStore";

/**
 * Role hierarchy for permission checks
 */
const ROLE_HIERARCHY = {
  teacher: 0,
  admin: 1,
  superadmin: 2,
};

/**
 * Hook for checking permissions in components
 * @param {string|string[]} allowedRoles - Role(s) to check against
 * @returns {Object} { hasPermission: boolean, userRole: string, userRoleLevel: number }
 *
 * @example
 * const { hasPermission, userRole } = useRoleGuard(['admin', 'superadmin']);
 * if (!hasPermission) return <p>Access Denied</p>;
 */
export function useRoleGuard(allowedRoles = []) {
  const { user } = useAuthStore();
  const userRole = user?.role?.toLowerCase();
  const userRoleLevel = ROLE_HIERARCHY[userRole] ?? -1;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const hasPermission = () => {
    if (roles.length === 0) return true;
    if (roles.includes(userRole)) return true;

    const minRequiredLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role.toLowerCase()] ?? Infinity),
    );

    return userRoleLevel >= minRequiredLevel;
  };

  return {
    hasPermission: hasPermission(),
    userRole,
    userRoleLevel,
  };
}
