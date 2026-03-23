import { useEffect, useMemo } from "react";
import { useImageStore } from "../stores/useImageStore";
import type { ImageMetadata } from "../schemas/entities";

/**
 * Custom hook to manage image fetching and selection for a specific asset.
 * Encapsulates the logic of checking the store and triggering a fetch if needed.
 * 
 * @param assetId - The unique identifier of the asset
 * @param initialImages - Optional pre-loaded image metadata
 * @returns An object containing the images, the main image, and loading state
 */
export const useAssetImages = (assetId?: string, initialImages?: ImageMetadata[]) => {
  const { assetImages, fetchAssetImages, isLoading } = useImageStore();

  useEffect(() => {
    // Guard: only fetch if the store doesn't already have data for this asset
    // and no initial images were passed in.
    // assetImages and initialImages intentionally excluded from deps to avoid
    // re-triggering the fetch on every render when the store reference changes.
    if (assetId && !useImageStore.getState().assetImages[assetId] && (!initialImages || initialImages.length === 0)) {
      fetchAssetImages(assetId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, fetchAssetImages]);

  // Use initialImages if provided, otherwise fallback to store
  const images = useMemo(() => {
    if (assetId && assetImages[assetId]) {
      return assetImages[assetId];
    }
    return initialImages || [];
  }, [assetId, assetImages, initialImages]);

  // Derive the main image: 
  // 1. Explicitly marked as main
  // 2. First image in the array
  // 3. Null if no images
  const mainImage = useMemo(() => {
    if (images.length === 0) return null;
    return images.find((img) => img.is_main) || images[0];
  }, [images]);

  return {
    images,
    mainImage,
    isLoading: isLoading && images.length === 0, // Only true if we're actually fetching initial data
  };
};
