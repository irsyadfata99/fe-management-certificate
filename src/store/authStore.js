/**
 * Auth Store (Zustand)
 * Manages authentication state globally
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth Store
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      /**
       * Login action
       * @param {Object} userData - User data from login response
       * @param {string} accessToken - JWT access token
       * @param {string} refreshToken - JWT refresh token
       */
      login: (userData, accessToken, refreshToken) => {
        set({
          user: userData,
          token: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true,
        });
      },

      /**
       * Logout action
       * Clears all auth state
       */
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Clear localStorage
        localStorage.removeItem("auth-storage");
      },

      /**
       * Update user data
       * @param {Object} userData - Updated user data
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      /**
       * Update tokens
       * @param {string} accessToken - New access token
       * @param {string} refreshToken - New refresh token (optional)
       */
      updateTokens: (accessToken, refreshToken) => {
        set((state) => ({
          token: accessToken,
          refreshToken: refreshToken || state.refreshToken,
        }));
      },

      /**
       * Check if user has specific role
       * @param {string|string[]} roles - Role(s) to check
       * @returns {boolean}
       */
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;

        const userRole = user.role?.toLowerCase();
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        return rolesArray.some((role) => role.toLowerCase() === userRole);
      },

      /**
       * Check if user has permission (role hierarchy)
       * @param {string} minimumRole - Minimum required role
       * @returns {boolean}
       */
      hasPermission: (minimumRole) => {
        const { user } = get();
        if (!user) return false;

        const roleHierarchy = {
          teacher: 0,
          admin: 1,
          superadmin: 2,
        };

        const userLevel = roleHierarchy[user.role?.toLowerCase()] ?? -1;
        const requiredLevel =
          roleHierarchy[minimumRole.toLowerCase()] ?? Infinity;

        return userLevel >= requiredLevel;
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
