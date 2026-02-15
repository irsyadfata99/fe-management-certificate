/**
 * UI Store
 * Global UI state management (Zustand)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Initial state
 */
const initialState = {
  // Theme: 'light' | 'dark' | 'system'
  theme: "system",

  // Sidebar state (for mobile/responsive)
  sidebarOpen: true,
  sidebarCollapsed: false,

  // Mobile breakpoint
  isMobile: false,
};

/**
 * UI Store
 */
export const useUIStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Theme Actions
      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const currentTheme = get().theme;
        const effectiveTheme =
          currentTheme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            : currentTheme;

        set({ theme: effectiveTheme === "dark" ? "light" : "dark" });
      },

      // Sidebar Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Mobile Actions
      setIsMobile: (isMobile) => set({ isMobile }),

      // Reset to initial state
      reset: () => set(initialState),
    }),
    {
      name: "ui-storage", // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }), // Only persist theme and sidebarCollapsed
    },
  ),
);
