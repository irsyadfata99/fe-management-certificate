/**
 * PublicRoute Component
 * Redirects authenticated users away from public pages (like login)
 * Allows unauthenticated users to access public pages
 */

import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * PublicRoute wrapper component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Where to redirect authenticated users (default: /dashboard)
 */
export default function PublicRoute({ children, redirectTo = "/dashboard" }) {
  const { isAuthenticated } = useAuthStore();

  // If user is authenticated, redirect to dashboard or specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is not authenticated, render the public page (e.g., login)
  return children;
}
