import { useEffect } from "react";
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
  const { currentAsset, isLoading, error, fetchAssetById } = useAssetStore();
  const { fetchAssetImages } = useImageStore();

  useEffect(() => {
    if (!id) return;

    // Fetch asset data; once we also have the ID we can fetch images in parallel
    const load = async () => {
      await Promise.all([
        fetchAssetById(id),
        fetchAssetImages(id),
      ]);
    };

    load();
  }, [id, fetchAssetById, fetchAssetImages]);

  return {
    asset: currentAsset,
    isLoading,
    error,
  };
};
