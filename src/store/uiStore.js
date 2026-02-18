import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: "light",

      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      activeModal: null,
      modalData: null,

      globalLoading: false,

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";

          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle(
              "dark",
              newTheme === "dark",
            );
          }

          return { theme: newTheme };
        });
      },

      setTheme: (theme) => {
        set({ theme });

        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleMobileSidebar: () => {
        set((state) => ({
          mobileSidebarOpen: !state.mobileSidebarOpen,
        }));
      },

      setMobileSidebarOpen: (open) => {
        set({ mobileSidebarOpen: open });
      },

      openModal: (modalName, data = null) => {
        set({
          activeModal: modalName,
          modalData: data,
        });
      },

      closeModal: () => {
        set({
          activeModal: null,
          modalData: null,
        });
      },

      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },

      initializeUI: () => {
        const { theme } = get();

        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

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
