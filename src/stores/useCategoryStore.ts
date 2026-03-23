import { create } from "zustand";
import categoryService from "../server/categoryService";
import { type Category } from "../schemas/entities";

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.getAll();
      set({ categories, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Erro ao buscar categorias",
        isLoading: false,
      });
    }
  },
}));
