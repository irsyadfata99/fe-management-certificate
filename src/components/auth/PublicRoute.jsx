import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PublicRoute({ children, redirectTo = "/dashboard" }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
