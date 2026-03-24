import { useState } from "react";
import type { Asset } from "../../../schemas/entities";
import { useImageStore } from "../../../stores/useImageStore";

/**
 * Custom hook to manage image gallery navigation and state.
 *
 * IMPORTANT: This hook is a CONSUMER of the ImageStore.
 * It does NOT trigger network requests. Fecthing is handled by the page-level
 * data orchestrator (useAssetDetails).
 */
export const useImageGallery = (asset?: Asset) => {
  const [activeImage, setActiveImage] = useState(0);

  // Use selective selectors for stability and performance
  const assetImages = useImageStore((state) => state.assetImages);
  const isLoading = useImageStore((state) => state.isLoading);

  // Derived state from store
  const images = asset?.id ? assetImages[asset.id] || [] : [];
  const galleryUrls = images.map((img) => img.url);

  const mainImageUrl =
    images.find((img) => img.is_main)?.url || images[0]?.url;

  const nextImage = () => {
    if (galleryUrls.length > 0) {
      setActiveImage((prev) => (prev + 1) % galleryUrls.length);
    }
  };

  const prevImage = () => {
    if (galleryUrls.length > 0) {
      setActiveImage(
        (prev) => (prev - 1 + galleryUrls.length) % galleryUrls.length,
      );
    }
  };

  return {
    activeImage,
    setActiveImage,
    galleryUrls,
    isLoadingImages: isLoading,
    mainImageUrl,
    nextImage,
    prevImage,
    hasMultipleImages: galleryUrls.length > 1,
  };
};
