/**
 * Modern Login Page - Glassmorphism Design
 * Features: Dark mode toggle, animations, modern UI
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/hooks";
import { useUIStore } from "@/store/uiStore";
import { Eye, EyeOff, Sun, Moon, Award } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending } = useLogin();
  const { theme, setTheme } = useUIStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData, {
      onSuccess: () => {
        setTimeout(() => {
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }, 100);
      },
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-45 transition-transform duration-300" />
        )}
      </button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-md w-full space-y-8 animate-fade-in-scale">
          {/* Logo & Header */}
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-6 animate-float">
              <Award className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sign in to Certificate Management System
            </p>
          </div>

          {/* Glassmorphism Login Card */}
          <div className="relative">
            {/* Glass Card */}
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 space-y-6">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl pointer-events-none"></div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    className="block w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isPending}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="block w-full px-4 py-3 pr-12 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="relative w-full group overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <span className="flex items-center justify-center w-full px-6 py-3 rounded-[6px] bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-700">
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Bottom glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Certificate Management System
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Secure • Reliable • Professional
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
