const KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  THEME: "theme",
  SIDEBAR_STATE: "sidebar_state",
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem(KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

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

  getRefreshToken: () => {
    try {
      return localStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },

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

  getUser: () => {
    try {
      const user = localStorage.getItem(KEYS.USER);
      return user ? safeParse(user) : null;
    } catch {
      return null;
    }
  },

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

  clearAuth: () => {
    try {
      localStorage.removeItem(KEYS.AUTH_TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error("Failed to clear auth:", error);
    }
  },

  isAuthenticated: () => {
    return !!storage.getToken();
  },

  getTheme: () => {
    try {
      return localStorage.getItem(KEYS.THEME);
    } catch {
      return null;
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },

  getSidebarState: () => {
    try {
      const state = localStorage.getItem(KEYS.SIDEBAR_STATE);
      return state === "true";
    } catch {
      return true; // default open
    }
  },

  setSidebarState: (isOpen) => {
    try {
      localStorage.setItem(KEYS.SIDEBAR_STATE, String(isOpen));
    } catch (error) {
      console.error("Failed to save sidebar state:", error);
    }
  },

  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      const parsed = safeParse(value);
      return parsed !== null ? parsed : value;
    } catch {
      return null;
    }
  },

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

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};

export const STORAGE_KEYS = KEYS;
