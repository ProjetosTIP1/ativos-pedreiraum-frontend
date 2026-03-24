import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAssetStore } from "../../../stores/useAssetStore";
import { useImageStore } from "../../../stores/useImageStore";

/**
 * Custom hook to fetch and manage asset details by ID.
 * Reads :id from the route params, then fetches the asset and its images
 * in parallel before the page renders.
 *
 * Architecture note: this hook is the single entry point for AssetDetails data.
 * It orchestrates two stores (asset + images) so the page component stays pure UI.
 */
export const useAssetDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Use selective selectors to prevent unnecessary re-renders
  // and ensure action stability.
  const currentAsset = useAssetStore((state) => state.currentAsset);
  const isLoadingAsset = useAssetStore((state) => state.isLoading);
  const assetError = useAssetStore((state) => state.error);
  const fetchAssetById = useAssetStore((state) => state.fetchAssetById);

  const fetchAssetImages = useImageStore((state) => state.fetchAssetImages);
  const isLoadingImages = useImageStore((state) => state.isLoading);

  // Use a ref to strictly prevent double-fetching in StrictMode
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    if (!id || lastFetchedId.current === id) return;

    // Only fetch if the asset ID changed or if we don't have the asset yet
    if (currentAsset?.id !== id) {
      const load = async () => {
        try {
          lastFetchedId.current = id;
          await Promise.all([fetchAssetById(id), fetchAssetImages(id)]);
        } catch (err) {
          console.error("Error loading asset details:", err);
          lastFetchedId.current = null; // Reset on error to allow retry
        }
      };
      load();
    }
  }, [id, currentAsset?.id, fetchAssetById, fetchAssetImages]);

  return {
    asset: currentAsset,
    isLoading: isLoadingAsset || isLoadingImages,
    error: assetError,
  };
};
