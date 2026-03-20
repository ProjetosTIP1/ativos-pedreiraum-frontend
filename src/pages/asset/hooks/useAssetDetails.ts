import { useAssetStore } from "../../../stores/useAssetStore";

/**
 * Custom hook to fetch and manage asset details by slug
 * Encapsulates the data fetching logic and loading/error states
 */
export const useAssetDetails = () => {
  const { currentAsset, isLoading, error } = useAssetStore();

  return {
    asset: currentAsset,
    isLoading,
    error,
  };
};
