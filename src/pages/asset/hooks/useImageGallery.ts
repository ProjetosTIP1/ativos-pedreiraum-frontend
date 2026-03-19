import { useState, useEffect } from "react";
import type { Asset, ImageMetadata } from "../../../schemas/entities";
import imageService from "../../../server/imageService";

/**
 * Custom hook to manage image gallery navigation and state
 * Handles active image index and prev/next navigation
 */
export const useImageGallery = (asset?: Asset) => {
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch images for the asset
  useEffect(() => {
    const fetchImages = async () => {
      if (!asset?.id) {
        setImages([]);
        return;
      }

      setIsLoadingImages(true);
      try {
        const imageMetadata = await imageService.getAssetImages(asset.id);
        setImages(imageMetadata);
      } catch (error) {
        console.error("Error loading gallery images:", error);
        setImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [asset?.id]);

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
    isLoadingImages,
    mainImageUrl,
    nextImage,
    prevImage,
    hasMultipleImages: galleryUrls.length > 1,
  };
};
