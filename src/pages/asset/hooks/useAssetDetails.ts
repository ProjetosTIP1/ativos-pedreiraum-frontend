import { useEffect } from "react";
import { useAssetStore } from "../../../stores/useAssetStore";

/**
 * Custom hook to fetch and manage asset details by slug
 * Encapsulates the data fetching logic and loading/error states
 */
export const useAssetDetails = (slug?: string) => {
  const { currentAsset, fetchAssetBySlug, isLoading, error } = useAssetStore();

  useEffect(() => {
    if (slug) {
      fetchAssetBySlug(slug);
    }
  }, [slug, fetchAssetBySlug]);

  return {
    asset: currentAsset,
    isLoading,
    error,
  };
};
