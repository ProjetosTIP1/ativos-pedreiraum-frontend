import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../schemas/entities";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-industrial-orange)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn("Unauthorized access attempt - Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.error(
      `Access denied: User role ${user.role} not in allowed roles: ${allowedRoles.join(", ")}`,
    );
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
