import { useState, useEffect } from "react";
import type { ImageMetadata } from "../../../schemas/entities";
import imageService from "../../../server/imageService";

export const REQUIRED_POVS = [
  "FRENTE",
  "TRÁS",
  "LADO_ESQUERDO",
  "LADO_DIREITO",
  "INTERIOR",
  "MOTOR",
  "PNEU",
  "PAINEL",
  "OUTROS",
];

export interface PositionedFile {
  file?: File;
  previewUrl?: string;
  position: string;
  existingMetadata?: ImageMetadata;
  isMain?: boolean;
}

/**
 * Custom hook to manage image uploads with position-based organization
 * Handles file selection, preview generation, and existing image fetching
 */
export const useImageManagement = (assetId?: string) => {
  const [positionedFiles, setPositionedFiles] = useState<PositionedFile[]>(
    REQUIRED_POVS.map((pos) => ({ position: pos, isMain: false })),
  );
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch existing images for the asset when editing
  useEffect(() => {
    const loadExistingImages = async () => {
      if (!assetId) {
        // Reset to empty state for new assets
        setPositionedFiles(
          REQUIRED_POVS.map((pos) => ({ position: pos, isMain: false })),
        );
        return;
      }

      setIsLoadingImages(true);
      try {
        console.log(`Fetching images for asset ${assetId}...`);
        const imageMetadata = await imageService.getAssetImages(assetId);
        console.log(`Loaded ${imageMetadata.length} images for asset ${assetId}`);

        // Map metadata to positioned files
        const newPositionedFiles = REQUIRED_POVS.map((pos) => {
          const existing = imageMetadata.find(
            (img) => img.position === pos,
          );
          return {
            position: pos,
            existingMetadata: existing,
            previewUrl: imageService.getImageUrl(existing?.url),
            isMain: existing?.is_main || false,
          };
        });
        setPositionedFiles(newPositionedFiles);
      } catch (error) {
        console.error("Error loading asset images:", error);
        // Keep empty state on error
        setPositionedFiles(
          REQUIRED_POVS.map((pos) => ({ position: pos, isMain: false })),
        );
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadExistingImages();
  }, [assetId]);

  const handleFileSelect = (position: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPositionedFiles((prev) => {
      // If no image is set as main yet, set this one as main
      const hasMain = prev.some((p) => p.isMain && p.previewUrl);
      return prev.map((p) => {
        if (p.position === position) {
          // If this slot was already 'main', it stays 'main' after replacement.
          // Otherwise, it becomes 'main' only if no other 'main' exists.
          const shouldBeMain = p.isMain || !hasMain;
          return { ...p, file, previewUrl, isMain: shouldBeMain };
        }
        return p;
      });
    });
  };

  const toggleMain = (position: string) => {
    setPositionedFiles((prev) =>
      prev.map((p) => ({
        ...p,
        isMain: p.position === position,
      })),
    );
  };

  const removeFile = (position: string) => {
    setPositionedFiles((prev) =>
      prev.map((p) =>
        p.position === position
          ? {
              ...p,
              file: undefined,
              previewUrl: undefined,
              isMain: false,
              // We keep the existingMetadata here so we know what to delete
              // on the backend when the user submits the form.
            }
          : p,
      ),
    );
  };

  return {
    positionedFiles,
    setPositionedFiles,
    handleFileSelect,
    toggleMain,
    removeFile,
    isLoadingImages,
  };
};
