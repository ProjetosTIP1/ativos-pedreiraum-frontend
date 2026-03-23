import { create } from "zustand";
import userService from "../server/userService";
import {
  type User,
  type UserCreateRequest,
  type UserUpdateRequest,
  type UserUpdatePasswordRequest,
  type AdminUserUpdateRequest,
} from "../schemas/entities";

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (data: UserCreateRequest) => Promise<User>;
  updateUser: (userId: string, data: AdminUserUpdateRequest) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  updateMe: (data: UserUpdateRequest) => Promise<User>;
  updatePassword: (data: UserUpdatePasswordRequest) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getAll();
      set({ users, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Erro ao buscar usuários",
        isLoading: false,
      });
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.create(data);
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
      return newUser;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao criar usuário";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.update(userId, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
        isLoading: false,
      }));
      return updatedUser;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar usuário";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await userService.delete(userId);
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao excluir usuário";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  updateMe: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateMe(data);
      set({ isLoading: false });
      return updatedUser;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  updatePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await userService.updatePassword(data);
      set({ isLoading: false });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar senha";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },
}));
