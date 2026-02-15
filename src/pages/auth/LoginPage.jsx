/**
 * Login Page
 *
 * FEATURES:
 * - Login form (username, password)
 * - Remember me checkbox
 * - Show/hide password toggle
 * - Form validation with React Hook Form + Zod
 * - Loading state during login
 * - Error message display
 * - Auto redirect to dashboard on success
 * - Redirect based on user role
 *
 * COMPONENTS TO BUILD:
 * - Login form card (centered, max-w-md)
 * - Input fields with icons
 * - Submit button with loading spinner
 * - Error alert component
 *
 * LAYOUT:
 * - Full screen centered
 * - Brand logo/title at top
 * - Card with shadow
 * - Footer with copyright
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/hooks";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending } = useLogin();
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData, {
      onSuccess: () => {
        // Redirect based on role
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      },
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Certificate Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>&copy; 2026 Certificate Management System</p>
        </div>
      </div>
    </div>
  );
}
