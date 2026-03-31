import { create } from "zustand";
import imageService from "../server/imageService";
import { type ImageMetadata } from "../schemas/entities";

interface ImageStore {
  assetImages: Record<string, ImageMetadata[]>;
  imageBlobs: Record<string, Blob>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAssetImages: (assetId: string) => Promise<void>;
  fetchImageBlob: (filename: string) => Promise<Blob>;
  uploadImage: (
    file: File,
    assetId?: string,
    position?: string,
    isMain?: boolean,
  ) => Promise<ImageMetadata>;
  deleteImage: (url: string) => Promise<void>;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  assetImages: {},
  imageBlobs: {},
  isLoading: false,
  error: null,

  fetchAssetImages: async (assetId: string) => {
    set({ isLoading: true, error: null });
    try {
      const images = await imageService.getAssetImages(assetId);
      set((state) => ({
        assetImages: { ...state.assetImages, [assetId]: images },
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Erro ao buscar imagens",
        isLoading: false,
      });
    }
  },

  fetchImageBlob: async (filename: string) => {
    // Check cache first
    const cached = get().imageBlobs[filename];
    if (cached) return cached;

    set({ isLoading: true, error: null });
    try {
      const blob = await imageService.fetchAnImage(filename);
      if (!blob) throw new Error("Image not found");

      set((state) => ({
        imageBlobs: { ...state.imageBlobs, [filename]: blob },
        isLoading: false,
      }));
      return blob;
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Erro ao buscar arquivo da imagem",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadImage: async (file, assetId, position, isMain) => {
    set({ isLoading: true, error: null });
    try {
      const metadata = await imageService.uploadAnImage(file, assetId, position, isMain);
      
      // If assetId provided, optionally refresh the collection in state
      if (assetId) {
        const current = get().assetImages[assetId] || [];
        set((state) => ({
          assetImages: { ...state.assetImages, [assetId]: [...current, metadata] },
        }));
      }

      set({ isLoading: false });
      return metadata;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro no upload";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  deleteImage: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      await imageService.deleteImage(url);
      set({ isLoading: false });
      // Note: In a real scenario, we might want to filtered out the deleted image from state
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Erro ao excluir imagem",
        isLoading: false,
      });
      throw error;
    }
  },
}));
