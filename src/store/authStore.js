/**
 * Auth Store (Zustand)
 * Manages authentication state globally
 * PRODUCTION-READY: Improved error handling, data validation, and flexibility
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
       * Login action - PRODUCTION READY
       * Accepts multiple data formats for flexibility:
       * 1. Single object: { user, accessToken, refreshToken }
       * 2. Separate params: (user, accessToken, refreshToken)
       *
       * @param {Object|Object} userDataOrObject - User data or complete response object
       * @param {string} [accessToken] - JWT access token (optional if first param is object)
       * @param {string} [refreshToken] - JWT refresh token (optional if first param is object)
       *
       * @example
       * // Format 1: Single object (recommended)
       * login({ user: {...}, accessToken: 'xxx', refreshToken: 'yyy' })
       *
       * @example
       * // Format 2: Separate parameters (legacy)
       * login(userData, 'access-token', 'refresh-token')
       */
      login: (userDataOrObject, accessToken, refreshToken) => {
        try {
          let userData, token, refresh;

          // Determine data format
          if (accessToken && refreshToken) {
            // Format 2: Separate parameters (legacy)
            userData = userDataOrObject;
            token = accessToken;
            refresh = refreshToken;
          } else if (
            typeof userDataOrObject === "object" &&
            userDataOrObject !== null
          ) {
            // Format 1: Single object (recommended)
            userData = userDataOrObject.user;
            token = userDataOrObject.accessToken || userDataOrObject.token;
            refresh = userDataOrObject.refreshToken;
          } else {
            console.error(
              "[AuthStore] Invalid login data format:",
              userDataOrObject,
            );
            throw new Error("Invalid login data format");
          }

          // Validate required fields
          if (!userData || typeof userData !== "object") {
            console.error("[AuthStore] Invalid user data:", userData);
            throw new Error("User data is required");
          }

          if (!token || typeof token !== "string") {
            console.error("[AuthStore] Invalid access token:", token);
            throw new Error("Access token is required");
          }

          if (!refresh || typeof refresh !== "string") {
            console.error("[AuthStore] Invalid refresh token:", refresh);
            throw new Error("Refresh token is required");
          }

          // Validate user object has required fields
          if (!userData.id || !userData.username || !userData.role) {
            console.warn("[AuthStore] User data missing required fields:", {
              hasId: !!userData.id,
              hasUsername: !!userData.username,
              hasRole: !!userData.role,
            });
          }

          // Debug logging
          console.log("[AuthStore] Login successful:", {
            userId: userData.id,
            username: userData.username,
            role: userData.role,
            hasToken: !!token,
            hasRefreshToken: !!refresh,
          });

          // Update state
          set({
            user: userData,
            token: token,
            refreshToken: refresh,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("[AuthStore] Login failed:", error);
          // Don't throw - just log error and keep state unchanged
          // This prevents app crashes on login errors
        }
      },

      /**
       * Logout action
       * Clears all auth state
       */
      logout: () => {
        console.log("[AuthStore] Logging out...");

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Clear localStorage
        try {
          localStorage.removeItem("auth-storage");
          console.log("[AuthStore] Logout complete");
        } catch (error) {
          console.error("[AuthStore] Failed to clear localStorage:", error);
        }
      },

      /**
       * Update user data (for profile updates)
       * @param {Object} userData - Updated user data (partial or full)
       *
       * @example
       * setUser({ full_name: 'New Name' }) // Partial update
       * setUser({ ...user, full_name: 'New Name' }) // Full update
       */
      setUser: (userData) => {
        const currentUser = get().user;

        if (!currentUser) {
          console.warn("[AuthStore] Cannot update user - no user logged in");
          return;
        }

        console.log("[AuthStore] Updating user data:", userData);

        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      /**
       * Update tokens (for token refresh)
       * @param {string} accessToken - New access token
       * @param {string} [newRefreshToken] - New refresh token (optional)
       *
       * @example
       * setTokens('new-access-token') // Update access token only
       * setTokens('new-access-token', 'new-refresh-token') // Update both
       */
      setTokens: (accessToken, newRefreshToken) => {
        if (!accessToken || typeof accessToken !== "string") {
          console.error("[AuthStore] Invalid access token:", accessToken);
          return;
        }

        console.log("[AuthStore] Updating tokens:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!newRefreshToken,
        });

        set((state) => ({
          token: accessToken,
          refreshToken: newRefreshToken || state.refreshToken,
        }));
      },

      /**
       * Check if user has specific role
       * @param {string|string[]} roles - Role(s) to check
       * @returns {boolean}
       *
       * @example
       * hasRole('admin') // true if user is admin
       * hasRole(['admin', 'superadmin']) // true if user is admin OR superadmin
       */
      hasRole: (roles) => {
        const { user } = get();
        if (!user || !user.role) return false;

        const userRole = user.role.toLowerCase();
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        return rolesArray.some((role) => role.toLowerCase() === userRole);
      },

      /**
       * Check if user has permission (role hierarchy)
       * SuperAdmin > Admin > Teacher
       *
       * @param {string} minimumRole - Minimum required role
       * @returns {boolean}
       *
       * @example
       * hasPermission('admin') // true if user is admin or superadmin
       * hasPermission('teacher') // true for all roles
       */
      hasPermission: (minimumRole) => {
        const { user } = get();
        if (!user || !user.role) return false;

        const roleHierarchy = {
          teacher: 0,
          admin: 1,
          superadmin: 2,
        };

        const userLevel = roleHierarchy[user.role.toLowerCase()] ?? -1;
        const requiredLevel =
          roleHierarchy[minimumRole.toLowerCase()] ?? Infinity;

        return userLevel >= requiredLevel;
      },

      /**
       * Get current user role (normalized)
       * @returns {string|null} - Role in lowercase or null
       *
       * @example
       * getRole() // 'admin', 'teacher', 'superadmin', or null
       */
      getRole: () => {
        const { user } = get();
        return user?.role?.toLowerCase() || null;
      },

      /**
       * Check if user is authenticated
       * @returns {boolean}
       */
      isLoggedIn: () => {
        const { isAuthenticated, user, token } = get();
        return isAuthenticated && !!user && !!token;
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
      // Optional: Add version for migration
      version: 1,
      // Optional: Migrate old data format
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migrate from old format if needed
          console.log("[AuthStore] Migrating storage from v0 to v1");
          return {
            ...persistedState,
            // Add any necessary migrations here
          };
        }
        return persistedState;
      },
    },
  ),
);

/**
 * Selectors untuk optimize re-renders
 * Use these instead of accessing full state
 */

export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectToken = (state) => state.token;
export const selectRefreshToken = (state) => state.refreshToken;
export const selectUserRole = (state) => state.user?.role;

/**
 * Helper function to get auth state outside React components
 * @returns {Object} Current auth state
 *
 * @example
 * import { getAuthState } from '@/store/authStore';
 * const { user, token } = getAuthState();
 */
export const getAuthState = () => useAuthStore.getState();
