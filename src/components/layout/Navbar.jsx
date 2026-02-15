/**
 * Navbar Component
 * Top navigation dengan user menu, dark mode toggle, dan mobile menu
 * FIXED: Avatar gradient visibility and text contrast
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useLogout } from "@/hooks/auth/useAuth";
import { cn } from "@/utils/helpers/cn";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const {
    theme,
    setTheme,
    sidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useUIStore();
  const { mutate: logout } = useLogout();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/branches")) return "Branches";
    if (path.includes("/divisions")) return "Divisions";
    if (path.includes("/modules")) return "Modules";
    if (path.includes("/teachers")) return "Teachers";
    if (path.includes("/certificates")) return "Certificates";
    if (path.includes("/students")) return "Students";
    if (path.includes("/backup")) return "Backup";
    if (path.includes("/profile")) return "Profile";
    return "Certificate Management";
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300",
        "lg:left-64",
        sidebarCollapsed && "lg:left-20",
      )}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Section - Mobile Menu + Page Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileSidebarOpen ? (
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {/* Page Title */}
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            {/* User Button */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              {/* FIXED: Better gradient visibility with shadow and ring */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md ring-2 ring-slate-200 dark:ring-slate-700">
                {user?.full_name?.[0] || user?.username?.[0] || "U"}
              </div>

              {/* User Info (Hidden on mobile) */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.full_name || user?.username || "User"}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">
                  {user?.role || "Role"}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              className={cn(
                "absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 transition-all duration-200 origin-top-right",
                userMenuOpen
                  ? "opacity-100 visible scale-100"
                  : "opacity-0 invisible scale-95 pointer-events-none",
              )}
            >
              {/* User Info Header (visible on mobile in dropdown) */}
              <div className="sm:hidden px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.full_name || user?.username || "User"}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">
                  {user?.role || "Role"}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* Profile */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-200 dark:border-slate-700 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Export both default and named
export default Navbar;
