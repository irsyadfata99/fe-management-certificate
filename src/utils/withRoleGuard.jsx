import RoleGuard from "@/components/auth/RoleGuard";

export function withRoleGuard(Component, allowedRoles) {
  return function RoleGuardedComponent(props) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
