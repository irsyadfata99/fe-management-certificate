export const ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  TEACHER: "teacher",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
};

export const ROLE_BADGE_VARIANTS = {
  [ROLES.SUPER_ADMIN]: "bg-purple-100 text-purple-800 border-purple-200",
  [ROLES.ADMIN]: "bg-blue-100 text-blue-800 border-blue-200",
  [ROLES.TEACHER]: "bg-green-100 text-green-800 border-green-200",
};

export const isSuperAdmin = (user) => {
  return user?.role === ROLES.SUPER_ADMIN;
};

export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN || isSuperAdmin(user);
};

export const isTeacher = (user) => {
  return user?.role === ROLES.TEACHER;
};

export const hasRole = (user, allowedRoles) => {
  if (!user?.role) return false;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

export const getRoleLabel = (user) => {
  return ROLE_LABELS[user?.role] || "-";
};

export const canAccessAdmin = (user) => {
  return isAdmin(user);
};

export const canManageBranches = (user) => {
  return isSuperAdmin(user);
};

export const canManageTeachers = (user) => {
  return isAdmin(user);
};

export const canPrintCertificates = (user) => {
  return isTeacher(user);
};
