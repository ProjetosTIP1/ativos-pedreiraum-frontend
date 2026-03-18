import { useState, useEffect } from "react";
import type { Asset, ImageMetadata } from "../../../schemas/entities";

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
 * Handles file selection, preview generation, and existing image mapping
 */
export const useImageManagement = (existingAsset?: Partial<Asset>) => {
  const [positionedFiles, setPositionedFiles] = useState<PositionedFile[]>(
    REQUIRED_POVS.map((pos) => ({ position: pos })),
  );

  // Map existing images to POVs when editing - derived from props
  useEffect(() => {
    if (existingAsset?.images && existingAsset.images.length > 0) {
      const hasExistingImages = positionedFiles.some((pf) => pf.existingMetadata);
      // Only update if we haven't already loaded the images
      if (!hasExistingImages) {
        const newPositionedFiles = REQUIRED_POVS.map((pos) => {
          const existing = existingAsset.images?.find(
            (img) => img.position === pos,
          );
          return {
            position: pos,
            existingMetadata: existing,
            previewUrl: existing?.url,
          };
        });
        setPositionedFiles(newPositionedFiles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAsset?.images?.length]);

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
    handleFileSelect,
    removeFile,
  };
};
