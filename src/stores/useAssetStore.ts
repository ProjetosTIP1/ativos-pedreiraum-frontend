import { create } from "zustand";
import assetService from "../server/assetService";
import { type Asset } from "../schemas/entities";

interface AssetFilter {
  [key: string]: string | number | boolean | undefined;
  category?: string;
  brand?: string;
  min_year?: number;
  max_year?: number;
  q?: string;
}

interface AssetStore {
  assets: Asset[];
  featuredAssets: Asset[];
  currentAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  filters: AssetFilter;

  // Actions
  fetchAssets: (params?: AssetFilter) => Promise<void>;
  fetchHighlights: () => Promise<void>;
  fetchAssetById: (id: string) => Promise<void>;
  setFilters: (filters: AssetFilter) => void;
  clearFilters: () => void;
  createAsset: (asset: Partial<Asset>) => Promise<Asset>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  featuredAssets: [],
  currentAsset: null,
  isLoading: false,
  error: null,
  filters: {},

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  fetchAssets: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = params || get().filters;
      const assets = await assetService.getAll(currentFilters);
      set({ assets, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "Falha ao buscar ativos",
        isLoading: false,
      });
    }
  },

  fetchHighlights: async () => {
    set({ isLoading: true, error: null });
    try {
      const featuredAssets = await assetService.getHighlights();
      set({ featuredAssets, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "Falha ao buscar destaques",
        isLoading: false,
      });
    }
  },

  fetchAssetById: async (id: string) => {
    set({ isLoading: true, error: null, currentAsset: null });
    try {
      const currentAsset = await assetService.getById(id);
      set({ currentAsset, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Falha ao buscar detalhes do ativo",
        isLoading: false,
      });
    }
  },

  createAsset: async (asset: Partial<Asset>) => {
    set({ isLoading: true, error: null });
    try {
      const newAsset = await assetService.create(asset);
      set((state) => ({
        assets: [newAsset, ...state.assets],
        isLoading: false,
      }));
      return newAsset;
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao criar ativo";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  updateAsset: async (id: string, asset: Partial<Asset>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAsset = await assetService.updateAsset(id, asset);
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? updatedAsset : a)),
        currentAsset:
          state.currentAsset?.id === id ? updatedAsset : state.currentAsset,
        isLoading: false,
      }));
      return updatedAsset;
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao atualizar ativo";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await assetService.delete(id);
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao excluir ativo";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },
}));
