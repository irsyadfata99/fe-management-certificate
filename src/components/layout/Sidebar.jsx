import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getMenuItems, BOTTOM_MENU_ITEMS } from "./sidebarConfig";
import { cn } from "@/utils/helpers/cn";

function NavItem({ item, sidebarCollapsed }) {
  const location = useLocation();

  const isChildActive = item.children?.some((child) =>
    location.pathname.startsWith(child.path),
  );

  const [isOpen, setIsOpen] = useState(isChildActive ?? false);

  const Icon = item.icon;

  // ── GROUPED ITEM (punya children) ──────────────────────────────────────
  if (item.children) {
    return (
      <div>
        <button
          onClick={() => !sidebarCollapsed && setIsOpen((prev) => !prev)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
            "text-slate-700 dark:text-slate-300",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            sidebarCollapsed && "justify-center",
          )}
          aria-expanded={isOpen}
          aria-label={item.label}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />

          {!sidebarCollapsed && (
            <>
              <span className="text-sm flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-slate-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </>
          )}

          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              {item.label}
              {item.description && (
                <div className="text-xs text-slate-300 mt-0.5">
                  {item.description}
                </div>
              )}
            </div>
          )}
        </button>

        {!sidebarCollapsed && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0",
            )}
          >
            <div className="ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-0.5">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const isActive = location.pathname === child.path;

                return (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200",
                      "text-slate-600 dark:text-slate-400 text-sm",
                      "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
                      isActive &&
                        "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium shadow-sm",
                    )}
                  >
                    <ChildIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{child.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="absolute left-full ml-2 top-0 hidden group-hover:block z-50">
            <div className="bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg shadow-lg overflow-hidden min-w-40">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-700">
                {item.label}
              </div>
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const isActive = location.pathname === child.path;

                return (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 transition-colors",
                      "hover:bg-slate-800",
                      isActive && "bg-blue-600 text-white",
                    )}
                  >
                    <ChildIcon className="w-4 h-4" />
                    <span>{child.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── REGULAR ITEM ────────────────────────────────────────────────────────
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          "text-slate-700 dark:text-slate-300",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          isActive &&
            "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium shadow-sm",
          sidebarCollapsed && "justify-center",
        )
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />

      {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}

      {sidebarCollapsed && (
        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
          {item.label}
          {item.description && (
            <div className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
              {item.description}
            </div>
          )}
        </div>
      )}

      {!sidebarCollapsed && item.badge && (
        <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
          5
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const menuItems = getMenuItems(user?.role);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
          "hidden lg:flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800",
            sidebarCollapsed ? "justify-center" : "justify-between",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Certificate
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Management
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              sidebarCollapsed &&
                "absolute -right-3 top-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",
            )}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <NavItem
              key={item.path ?? `group-${index}`}
              item={item}
              sidebarCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-1">
          {BOTTOM_MENU_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              sidebarCollapsed={sidebarCollapsed}
            />
          ))}
        </div>

        {sidebarCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mx-auto shadow-md ring-2 ring-slate-200 dark:ring-slate-700">
              {user?.full_name?.[0] || user?.username?.[0] || "U"}
            </div>
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md ring-2 ring-slate-200 dark:ring-slate-700">
                {user?.full_name?.[0] || user?.username?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.full_name || user?.username || "User"}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">
                  {user?.role || "Role"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300",
          "opacity-0 invisible",
        )}
      />
    </>
  );
}

export default Sidebar;
