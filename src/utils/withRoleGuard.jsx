/**
 * withRoleGuard HOC
 * Higher-Order Component for role-based access control
 */

import RoleGuard from "@/components/auth/RoleGuard";

/**
 * Higher-Order Component for role-based access
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} allowedRoles - Allowed roles
 * @returns {React.Component} Wrapped component
 *
 * @example
 * const ProtectedPage = withRoleGuard(MyPage, ['admin', 'superadmin']);
 */
export function withRoleGuard(Component, allowedRoles) {
  return function RoleGuardedComponent(props) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
