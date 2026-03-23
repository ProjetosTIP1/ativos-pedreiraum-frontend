import { useAuthStore } from "../stores/useAuthStore";

/**
 * Custom hook to access authentication state and derive helper properties.
 * Provides a clean interface for checking roles and user status.
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();

  /**
   * Helper property to check if the current user has administrative privileges.
   * Returns true only if the user is authenticated and has the 'ADMIN' role.
   */
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
  };
};

export default useAuth;
