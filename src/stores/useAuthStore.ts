import { create } from "zustand";
import authService from "../server/authService";
import { type User } from "../schemas/entities";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: Record<string, string>) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.login(credentials);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Falha no login";
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
        } catch (err: unknown) {
            console.error("Logout failed:", err);
        } finally {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const user = await authService.me();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
