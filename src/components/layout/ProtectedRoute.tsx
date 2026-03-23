import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-industrial-orange)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.warn('Unauthorized access attempt - Redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
