/**
 * User roles dan role checker utilities
 */

export const ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  TEACHER: "teacher",
};

/**
 * Role labels untuk display
 */
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
};

/**
 * Role badge colors (Tailwind classes)
 */
export const ROLE_BADGE_VARIANTS = {
  [ROLES.SUPER_ADMIN]: "bg-purple-100 text-purple-800 border-purple-200",
  [ROLES.ADMIN]: "bg-blue-100 text-blue-800 border-blue-200",
  [ROLES.TEACHER]: "bg-green-100 text-green-800 border-green-200",
};

/**
 * Check if user is super admin
 * @param {Object} user - User object
 * @param {string} user.role - User role
 * @returns {boolean}
 * @example
 * isSuperAdmin({ role: 'superAdmin' }) // true
 */
export const isSuperAdmin = (user) => {
  return user?.role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user is admin (includes superAdmin)
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN || isSuperAdmin(user);
};

/**
 * Check if user is teacher
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isTeacher = (user) => {
  return user?.role === ROLES.TEACHER;
};

/**
 * Check if user has specific role(s)
 * @param {Object} user - User object
 * @param {string|string[]} allowedRoles - Single role or array of roles
 * @returns {boolean}
 * @example
 * hasRole(user, 'admin') // true if admin
 * hasRole(user, ['admin', 'teacher']) // true if admin OR teacher
 */
export const hasRole = (user, allowedRoles) => {
  if (!user?.role) return false;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

/**
 * Get user role label
 * @param {Object} user - User object
 * @returns {string}
 */
export const getRoleLabel = (user) => {
  return ROLE_LABELS[user?.role] || "-";
};

/**
 * Check if user can access admin features
 * SuperAdmin dan Admin bisa akses
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canAccessAdmin = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can manage branches
 * Only SuperAdmin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageBranches = (user) => {
  return isSuperAdmin(user);
};

/**
 * Check if user can manage teachers
 * Admin dan SuperAdmin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageTeachers = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can print certificates
 * Only Teacher
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canPrintCertificates = (user) => {
  return isTeacher(user);
};
