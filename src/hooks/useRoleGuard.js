import { useAuthStore } from "@/store/authStore";

const ROLE_HIERARCHY = {
  teacher: 0,
  admin: 1,
  superAdmin: 2,
};

export function useRoleGuard(allowedRoles = []) {
  const { user } = useAuthStore();

  const userRole = user?.role;
  const userRoleLevel = ROLE_HIERARCHY[userRole] ?? -1;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const hasPermission = () => {
    if (roles.length === 0) return true;
    if (roles.includes(userRole)) return true;

    const minRequiredLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role] ?? Infinity),
    );

    return userRoleLevel >= minRequiredLevel;
  };

  return {
    hasPermission: hasPermission(),
    userRole,
    userRoleLevel,
  };
}
