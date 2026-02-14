/**
 * LocalStorage wrapper dengan auto JSON parse/stringify
 * Thread-safe dan error-handled
 */

/**
 * Storage keys - centralized untuk consistency
 */
const KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  THEME: "theme",
  SIDEBAR_STATE: "sidebar_state",
};

/**
 * Safe JSON parse
 * @param {string} value
 * @returns {any}
 */
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/**
 * Safe JSON stringify
 * @param {any} value
 * @returns {string}
 */
const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

/**
 * LocalStorage utilities
 */
export const storage = {
  // ============================================================================
  // AUTH TOKENS
  // ============================================================================

  /**
   * Get access token
   * @returns {string|null}
   */
  getToken: () => {
    try {
      return localStorage.getItem(KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  /**
   * Set access token
   * @param {string} token
   */
  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(KEYS.AUTH_TOKEN, token);
      } else {
        localStorage.removeItem(KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  },

  /**
   * Get refresh token
   * @returns {string|null}
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },

  /**
   * Set refresh token
   * @param {string} token
   */
  setRefreshToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(KEYS.REFRESH_TOKEN, token);
      } else {
        localStorage.removeItem(KEYS.REFRESH_TOKEN);
      }
    } catch (error) {
      console.error("Failed to save refresh token:", error);
    }
  },

  // ============================================================================
  // USER DATA
  // ============================================================================

  /**
   * Get user object
   * @returns {Object|null}
   */
  getUser: () => {
    try {
      const user = localStorage.getItem(KEYS.USER);
      return user ? safeParse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set user object
   * @param {Object} user - User data
   */
  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(KEYS.USER, safeStringify(user));
      } else {
        localStorage.removeItem(KEYS.USER);
      }
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  },

  // ============================================================================
  // AUTH MANAGEMENT
  // ============================================================================

  /**
   * Clear all auth data
   * Dipanggil saat logout
   */
  clearAuth: () => {
    try {
      localStorage.removeItem(KEYS.AUTH_TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error("Failed to clear auth:", error);
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!storage.getToken();
  },

  // ============================================================================
  // UI PREFERENCES
  // ============================================================================

  /**
   * Get theme preference
   * @returns {'light'|'dark'|null}
   */
  getTheme: () => {
    try {
      return localStorage.getItem(KEYS.THEME);
    } catch {
      return null;
    }
  },

  /**
   * Set theme preference
   * @param {'light'|'dark'} theme
   */
  setTheme: (theme) => {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },

  /**
   * Get sidebar state
   * @returns {boolean}
   */
  getSidebarState: () => {
    try {
      const state = localStorage.getItem(KEYS.SIDEBAR_STATE);
      return state === "true";
    } catch {
      return true; // default open
    }
  },

  /**
   * Set sidebar state
   * @param {boolean} isOpen
   */
  setSidebarState: (isOpen) => {
    try {
      localStorage.setItem(KEYS.SIDEBAR_STATE, String(isOpen));
    } catch (error) {
      console.error("Failed to save sidebar state:", error);
    }
  },

  // ============================================================================
  // GENERIC METHODS
  // ============================================================================

  /**
   * Get any value from localStorage with auto-parse
   * @param {string} key
   * @returns {any}
   */
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      // Try parse as JSON first
      const parsed = safeParse(value);
      return parsed !== null ? parsed : value;
    } catch {
      return null;
    }
  },

  /**
   * Set any value to localStorage with auto-stringify
   * @param {string} key
   * @param {any} value
   */
  set: (key, value) => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, safeStringify(value));
      }
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  /**
   * Clear all localStorage
   * ⚠️ Use with caution!
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};

/**
 * Export storage keys untuk debugging/testing
 */
export const STORAGE_KEYS = KEYS;
