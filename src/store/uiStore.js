/**
 * UI Store (Zustand)
 * Manages UI state globally (sidebar, theme, modals, etc.)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * UI Store
 */
export const useUIStore = create(
  persist(
    (set, get) => ({
      // Theme State
      theme: "light", // 'light' | 'dark'

      // Sidebar State
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      // Modal State
      activeModal: null,
      modalData: null,

      // Loading State
      globalLoading: false,

      /**
       * Toggle theme between light and dark
       */
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";

          // Update document class for Tailwind dark mode
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle(
              "dark",
              newTheme === "dark",
            );
          }

          return { theme: newTheme };
        });
      },

      /**
       * Set theme explicitly
       * @param {string} theme - 'light' | 'dark'
       */
      setTheme: (theme) => {
        set({ theme });

        // Update document class
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      /**
       * Toggle sidebar collapsed state
       */
      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },

      /**
       * Set sidebar collapsed state
       * @param {boolean} collapsed
       */
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      /**
       * Toggle mobile sidebar open state
       */
      toggleMobileSidebar: () => {
        set((state) => ({
          mobileSidebarOpen: !state.mobileSidebarOpen,
        }));
      },

      /**
       * Set mobile sidebar open state
       * @param {boolean} open
       */
      setMobileSidebarOpen: (open) => {
        set({ mobileSidebarOpen: open });
      },

      /**
       * Open a modal
       * @param {string} modalName - Name/ID of the modal
       * @param {any} data - Data to pass to the modal
       */
      openModal: (modalName, data = null) => {
        set({
          activeModal: modalName,
          modalData: data,
        });
      },

      /**
       * Close active modal
       */
      closeModal: () => {
        set({
          activeModal: null,
          modalData: null,
        });
      },

      /**
       * Set global loading state
       * @param {boolean} loading
       */
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },

      /**
       * Initialize UI based on stored preferences
       */
      initializeUI: () => {
        const { theme } = get();

        // Apply theme on initialization
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
    }),
    {
      name: "ui-storage", // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Initialize UI on module load
if (typeof document !== "undefined") {
  const stored = localStorage.getItem("ui-storage");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.theme) {
        document.documentElement.classList.toggle(
          "dark",
          state.theme === "dark",
        );
      }
    } catch (error) {
      console.error("Failed to parse UI storage:", error);
    }
  }
}
