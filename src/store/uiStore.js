/**
 * UI Store - Zustand
 * Manages UI state (sidebar, modals, loading states)
 * NO persistence - reset on page refresh
 */

import { create } from "zustand";

/**
 * Initial state
 */
const initialState = {
  // Sidebar
  isSidebarOpen: true,
  isSidebarCollapsed: false,

  // Modals
  modals: {},

  // Loading states
  globalLoading: false,
  loadingMessage: "",

  // Page title
  pageTitle: "",
};

/**
 * UI Store
 * @typedef {Object} UIState
 * @property {boolean} isSidebarOpen - Sidebar visibility
 * @property {boolean} isSidebarCollapsed - Sidebar collapsed state
 * @property {Object} modals - Modal states by ID
 * @property {boolean} globalLoading - Global loading state
 * @property {string} loadingMessage - Loading message
 * @property {string} pageTitle - Current page title
 * @property {Function} toggleSidebar - Toggle sidebar
 * @property {Function} setSidebarOpen - Set sidebar open state
 * @property {Function} setSidebarCollapsed - Set sidebar collapsed state
 * @property {Function} openModal - Open modal by ID
 * @property {Function} closeModal - Close modal by ID
 * @property {Function} toggleModal - Toggle modal by ID
 * @property {Function} closeAllModals - Close all modals
 * @property {Function} setGlobalLoading - Set global loading
 * @property {Function} setPageTitle - Set page title
 */
export const useUIStore = create((set) => ({
  // ==========================================================================
  // STATE
  // ==========================================================================
  ...initialState,

  // ==========================================================================
  // SIDEBAR ACTIONS
  // ==========================================================================

  /**
   * Toggle sidebar open/close
   *
   * @example
   * const { toggleSidebar } = useUIStore();
   * toggleSidebar();
   */
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  /**
   * Set sidebar open state
   * @param {boolean} isOpen - Sidebar open state
   *
   * @example
   * const { setSidebarOpen } = useUIStore();
   * setSidebarOpen(true);
   */
  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  /**
   * Set sidebar collapsed state (for desktop)
   * @param {boolean} isCollapsed - Sidebar collapsed state
   *
   * @example
   * const { setSidebarCollapsed } = useUIStore();
   * setSidebarCollapsed(true);
   */
  setSidebarCollapsed: (isCollapsed) => {
    set({ isSidebarCollapsed: isCollapsed });
  },

  /**
   * Toggle sidebar collapsed state
   *
   * @example
   * const { toggleSidebarCollapsed } = useUIStore();
   * toggleSidebarCollapsed();
   */
  toggleSidebarCollapsed: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  // ==========================================================================
  // MODAL ACTIONS
  // ==========================================================================

  /**
   * Open modal by ID
   * @param {string} modalId - Modal identifier
   * @param {Object} [data] - Optional data to pass to modal
   *
   * @example
   * const { openModal } = useUIStore();
   * openModal('create-branch', { parentId: 1 });
   */
  openModal: (modalId, data = null) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: true, data },
      },
    }));
  },

  /**
   * Close modal by ID
   * @param {string} modalId - Modal identifier
   *
   * @example
   * const { closeModal } = useUIStore();
   * closeModal('create-branch');
   */
  closeModal: (modalId) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: false, data: null },
      },
    }));
  },

  /**
   * Toggle modal by ID
   * @param {string} modalId - Modal identifier
   * @param {Object} [data] - Optional data to pass to modal
   *
   * @example
   * const { toggleModal } = useUIStore();
   * toggleModal('filters');
   */
  toggleModal: (modalId, data = null) => {
    set((state) => {
      const currentModal = state.modals[modalId];
      const isCurrentlyOpen = currentModal?.isOpen || false;

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            isOpen: !isCurrentlyOpen,
            data: !isCurrentlyOpen ? data : null,
          },
        },
      };
    });
  },

  /**
   * Close all modals
   *
   * @example
   * const { closeAllModals } = useUIStore();
   * closeAllModals();
   */
  closeAllModals: () => {
    set({ modals: {} });
  },

  /**
   * Get modal state by ID
   * Helper untuk components
   * @param {string} modalId - Modal identifier
   * @returns {Object} Modal state { isOpen, data }
   */
  getModalState: (modalId) => (state) => {
    return state.modals[modalId] || { isOpen: false, data: null };
  },

  // ==========================================================================
  // LOADING ACTIONS
  // ==========================================================================

  /**
   * Set global loading state
   * @param {boolean} isLoading - Loading state
   * @param {string} [message=''] - Loading message
   *
   * @example
   * const { setGlobalLoading } = useUIStore();
   * setGlobalLoading(true, 'Memuat data...');
   */
  setGlobalLoading: (isLoading, message = "") => {
    set({
      globalLoading: isLoading,
      loadingMessage: isLoading ? message : "",
    });
  },

  // ==========================================================================
  // PAGE TITLE
  // ==========================================================================

  /**
   * Set page title
   * @param {string} title - Page title
   *
   * @example
   * const { setPageTitle } = useUIStore();
   * setPageTitle('Manajemen Branch');
   */
  setPageTitle: (title) => {
    set({ pageTitle: title });

    // Also update document title
    if (title) {
      document.title = `${title} - Certificate Management`;
    } else {
      document.title = "Certificate Management";
    }
  },

  // ==========================================================================
  // RESET
  // ==========================================================================

  /**
   * Reset UI state to initial
   *
   * @example
   * const { resetUI } = useUIStore();
   * resetUI();
   */
  resetUI: () => {
    set(initialState);
  },
}));

/**
 * Selectors untuk optimize re-renders
 */

/**
 * Get sidebar open state
 * @returns {boolean}
 *
 * @example
 * const isSidebarOpen = useUIStore(selectIsSidebarOpen);
 */
export const selectIsSidebarOpen = (state) => state.isSidebarOpen;

/**
 * Get sidebar collapsed state
 * @returns {boolean}
 *
 * @example
 * const isCollapsed = useUIStore(selectIsSidebarCollapsed);
 */
export const selectIsSidebarCollapsed = (state) => state.isSidebarCollapsed;

/**
 * Get modal state by ID
 * @param {string} modalId - Modal identifier
 * @returns {Function} Selector function
 *
 * @example
 * const modalState = useUIStore(selectModal('create-branch'));
 */
export const selectModal = (modalId) => (state) => {
  return state.modals[modalId] || { isOpen: false, data: null };
};

/**
 * Get global loading state
 * @returns {boolean}
 *
 * @example
 * const isLoading = useUIStore(selectGlobalLoading);
 */
export const selectGlobalLoading = (state) => state.globalLoading;

/**
 * Get loading message
 * @returns {string}
 *
 * @example
 * const message = useUIStore(selectLoadingMessage);
 */
export const selectLoadingMessage = (state) => state.loadingMessage;

/**
 * Get page title
 * @returns {string}
 *
 * @example
 * const title = useUIStore(selectPageTitle);
 */
export const selectPageTitle = (state) => state.pageTitle;
