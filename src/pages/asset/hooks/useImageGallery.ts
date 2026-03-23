import { useState, useEffect } from "react";
import type { Asset } from "../../../schemas/entities";
import { useImageStore } from "../../../stores/useImageStore";

/**
 * Custom hook to manage image gallery navigation and state
 * Handles active image index and prev/next navigation using the central ImageStore
 */
export const useImageGallery = (asset?: Asset) => {
  const [activeImage, setActiveImage] = useState(0);
  const { assetImages, isLoading, fetchAssetImages } = useImageStore();

  // Fetch images for the asset via the store
  useEffect(() => {
    if (asset?.id) {
      fetchAssetImages(asset.id);
    }
  }, [asset?.id, fetchAssetImages]);

  // Derived state from store
  const images = asset?.id ? assetImages[asset.id] || [] : [];
  const galleryUrls = images.map((img) => img.url);

  const mainImageUrl =
    images.find((img) => img.is_main)?.url ||
    images[0]?.url ||
    asset?.main_image;

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
