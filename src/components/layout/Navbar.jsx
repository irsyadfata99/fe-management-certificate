/**
 * Navbar Component
 * Top navigation bar with search, notifications, and user menu
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  Menu,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownLabel,
} from "@/components/ui";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, toggleMobileSidebar } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(3); // Mock notification count

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search for:", searchQuery);
      // TODO: Implement search functionality
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Toggle + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="
                w-full pl-10 pr-4 py-2 rounded-lg 
                border border-neutral-200 dark:border-neutral-600 
                bg-neutral-50 dark:bg-neutral-700 
                text-sm text-neutral-900 dark:text-white
                placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-colors
              "
            />
          </form>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              </span>
            )}
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </Link>

          {/* User Menu Dropdown */}
          <Dropdown
            trigger={
              <DropdownTrigger>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "U"}
                    </span>
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-neutral-900 dark:text-white">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="hidden md:inline w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                </button>
              </DropdownTrigger>
            }
          >
            <DropdownMenu>
              <DropdownLabel>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownLabel>

              <DropdownDivider />

              <DropdownItem
                icon={<User className="w-4 h-4" />}
                onClick={() => (window.location.href = "/profile")}
              >
                Profil Saya
              </DropdownItem>

              <DropdownItem
                icon={<Settings className="w-4 h-4" />}
                onClick={() => (window.location.href = "/settings")}
              >
                Pengaturan
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
                danger
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
