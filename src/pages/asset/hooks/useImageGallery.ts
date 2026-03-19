import { useState } from "react";
import type { Asset, ImageMetadata } from "../../../schemas/entities";

/**
 * Custom hook to manage image gallery navigation and state
 * Handles active image index and prev/next navigation
 */
export const useImageGallery = (asset?: Asset) => {
  const [activeImage, setActiveImage] = useState(0);

  // Build gallery URLs from asset images
  const images: ImageMetadata[] =
    asset?.images && asset.images.length > 0
      ? asset.images
      : asset?.main_image
        ? [
            {
              url: asset.main_image,
              is_main: true,
              id: "main",
              name: "Main",
              position: "FRONT",
            },
          ]
        : [];

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
    mainImageUrl,
    nextImage,
    prevImage,
    hasMultipleImages: galleryUrls.length > 1,
  };
};
