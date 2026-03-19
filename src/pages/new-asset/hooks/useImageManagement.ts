import { useState, useEffect } from "react";
import type { ImageMetadata } from "../../../schemas/entities";
import imageService from "../../../server/imageService";

export const REQUIRED_POVS = [
  "Frente",
  "Traseira",
  "Lateral Direita",
  "Lateral Esquerda",
  "Interior / Cabine",
  "Motor",
  "Chassi / Serial",
];

export interface PositionedFile {
  file?: File;
  previewUrl?: string;
  position: string;
  existingMetadata?: ImageMetadata;
}

/**
 * Custom hook to manage image uploads with position-based organization
 * Handles file selection, preview generation, and existing image fetching
 */
export const useImageManagement = (assetId?: string) => {
  const [positionedFiles, setPositionedFiles] = useState<PositionedFile[]>(
    REQUIRED_POVS.map((pos) => ({ position: pos })),
  );
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch existing images for the asset when editing
  useEffect(() => {
    const loadExistingImages = async () => {
      if (!assetId) {
        // Reset to empty state for new assets
        setPositionedFiles(REQUIRED_POVS.map((pos) => ({ position: pos })));
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
            previewUrl: existing?.url,
          };
        });
        setPositionedFiles(newPositionedFiles);
      } catch (error) {
        console.error("Error loading asset images:", error);
        // Keep empty state on error
        setPositionedFiles(REQUIRED_POVS.map((pos) => ({ position: pos })));
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadExistingImages();
  }, [assetId]);

  const handleFileSelect = (position: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPositionedFiles((prev) =>
      prev.map((p) =>
        p.position === position ? { ...p, file, previewUrl } : p,
      ),
    );
  };

  const removeFile = (position: string) => {
    setPositionedFiles((prev) =>
      prev.map((p) =>
        p.position === position
          ? { ...p, file: undefined, previewUrl: p.existingMetadata?.url }
          : p,
      ),
    );
  };

  return {
    positionedFiles,
    setPositionedFiles,
    handleFileSelect,
    removeFile,
    isLoadingImages,
  };
};
