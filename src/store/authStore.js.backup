/**
 * Auth Store - Zustand
 * Manages authentication state dengan localStorage persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "@/utils/helpers/storage";

/**
 * Initial state
 */
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

/**
 * Auth Store
 * @typedef {Object} AuthState
 * @property {Object|null} user - Current user object
 * @property {string|null} token - Access token
 * @property {string|null} refreshToken - Refresh token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {Function} login - Login action
 * @property {Function} logout - Logout action
 * @property {Function} setUser - Set user data
 * @property {Function} setTokens - Set tokens
 * @property {Function} clearAuth - Clear all auth data
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // ========================================================================
      // STATE
      // ========================================================================
      ...initialState,

      // ========================================================================
      // ACTIONS
      // ========================================================================

      /**
       * Login - Set user dan tokens
       * @param {Object} userData - User data from login response
       * @param {Object} userData.user - User object
       * @param {string} userData.token - Access token
       * @param {string} userData.refreshToken - Refresh token
       *
       * @example
       * const { login } = useAuthStore();
       * login({ user: {...}, token: 'xxx', refreshToken: 'yyy' });
       */
      login: (userData) => {
        const { user, token, refreshToken } = userData;

        // Update Zustand state
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });

        // Sync to localStorage via storage helper
        storage.setUser(user);
        storage.setToken(token);
        storage.setRefreshToken(refreshToken);
      },

      /**
       * Logout - Clear semua auth data
       *
       * @example
       * const { logout } = useAuthStore();
       * logout();
       */
      logout: () => {
        // Clear Zustand state
        set(initialState);

        // Clear localStorage
        storage.clearAuth();
      },

      /**
       * Set user data only (tanpa token)
       * Digunakan saat update profile
       * @param {Object} user - Updated user object
       *
       * @example
       * const { setUser } = useAuthStore();
       * setUser({ ...user, full_name: 'New Name' });
       */
      setUser: (user) => {
        set({ user });
        storage.setUser(user);
      },

      /**
       * Set tokens only (tanpa user)
       * Digunakan saat token refresh
       * @param {string} token - New access token
       * @param {string} [refreshToken] - New refresh token (optional)
       *
       * @example
       * const { setTokens } = useAuthStore();
       * setTokens('new-access-token', 'new-refresh-token');
       */
      setTokens: (token, refreshToken) => {
        const updates = { token };

        if (refreshToken) {
          updates.refreshToken = refreshToken;
        }

        set(updates);

        storage.setToken(token);
        if (refreshToken) {
          storage.setRefreshToken(refreshToken);
        }
      },

      /**
       * Clear all auth data (sama dengan logout tapi tanpa side effect)
       *
       * @example
       * const { clearAuth } = useAuthStore();
       * clearAuth();
       */
      clearAuth: () => {
        set(initialState);
        storage.clearAuth();
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Selectors untuk optimize re-renders
 * Gunakan ini daripada mengambil seluruh state
 */

/**
 * Get current user
 * @returns {Object|null}
 *
 * @example
 * const user = useAuthStore(selectUser);
 */
export const selectUser = (state) => state.user;

/**
 * Get authentication status
 * @returns {boolean}
 *
 * @example
 * const isAuth = useAuthStore(selectIsAuthenticated);
 */
export const selectIsAuthenticated = (state) => state.isAuthenticated;

/**
 * Get access token
 * @returns {string|null}
 *
 * @example
 * const token = useAuthStore(selectToken);
 */
export const selectToken = (state) => state.token;

/**
 * Get refresh token
 * @returns {string|null}
 *
 * @example
 * const refreshToken = useAuthStore(selectRefreshToken);
 */
export const selectRefreshToken = (state) => state.refreshToken;

/**
 * Get user role
 * @returns {string|null}
 *
 * @example
 * const role = useAuthStore(selectUserRole);
 */
export const selectUserRole = (state) => state.user?.role;
