import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (userDataOrObject, accessToken, refreshToken) => {
        try {
          let userData, token, refresh;

          if (accessToken && refreshToken) {
            userData = userDataOrObject;
            token = accessToken;
            refresh = refreshToken;
          } else if (
            typeof userDataOrObject === "object" &&
            userDataOrObject !== null
          ) {
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

          if (!userData.id || !userData.username || !userData.role) {
            console.warn("[AuthStore] User data missing required fields:", {
              hasId: !!userData.id,
              hasUsername: !!userData.username,
              hasRole: !!userData.role,
            });
          }

          console.log("[AuthStore] Login successful:", {
            userId: userData.id,
            username: userData.username,
            role: userData.role,
            hasToken: !!token,
            hasRefreshToken: !!refresh,
          });

          set({
            user: userData,
            token: token,
            refreshToken: refresh,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("[AuthStore] Login failed:", error);
        }
      },

      logout: () => {
        console.log("[AuthStore] Logging out...");

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        try {
          localStorage.removeItem("auth-storage");
          console.log("[AuthStore] Logout complete");
        } catch (error) {
          console.error("[AuthStore] Failed to clear localStorage:", error);
        }
      },

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
      hasRole: (roles) => {
        const { user } = get();
        if (!user || !user.role) return false;

        const userRole = user.role.toLowerCase();
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        return rolesArray.some((role) => role.toLowerCase() === userRole);
      },
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

      getRole: () => {
        const { user } = get();
        return user?.role?.toLowerCase() || null;
      },

      isLoggedIn: () => {
        const { isAuthenticated, user, token } = get();
        return isAuthenticated && !!user && !!token;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          console.log("[AuthStore] Migrating storage from v0 to v1");
          return {
            ...persistedState,
          };
        }
        return persistedState;
      },
    },
  ),
);
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectToken = (state) => state.token;
export const selectRefreshToken = (state) => state.refreshToken;
export const selectUserRole = (state) => state.user?.role;

export const getAuthState = () => useAuthStore.getState();
