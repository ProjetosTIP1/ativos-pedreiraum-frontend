import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetStore } from "../../../stores/useAssetStore";
import imageService from "../../../server/imageService";
import type { Asset } from "../../../schemas/entities";
import type { PositionedFile } from "./useImageManagement";

/**
 * Custom hook to handle Asset form actions (submit, delete)
 * Encapsulates business logic for CRUD operations and image uploads
 */
export const useAssetFormActions = (assetId?: string) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    formData: Partial<Asset>,
    positionedFiles: PositionedFile[],
  ) => {
    setIsSubmitting(true);
    try {
      // 1. Upload new images
      const uploadPromises = positionedFiles
        .filter((pf) => pf.file)
        .map(async (pf) => {
          const metadata = await imageService.uploadAnImage(
            pf.file!,
            pf.position,
          );
          return metadata;
        });

      const newUploadedMetadata = await Promise.all(uploadPromises);

      // 2. Combine with existing metadata
      const finalImages = [
        ...(formData.images || []).filter(
          (img) =>
            !positionedFiles.some(
              (pf) => pf.file && pf.position === img.position,
            ),
        ),
        ...newUploadedMetadata,
      ];

      // Ensure one is main (e.g., the "Frente" one)
      if (finalImages.length > 0 && !finalImages.some((img) => img.is_main)) {
        const front =
          finalImages.find((img) => img.position === "Frente") ||
          finalImages[0];
        front.is_main = true;
      }

      const finalData = { ...formData, images: finalImages };

      if (assetId) {
        await useAssetStore.getState().updateAsset(assetId, finalData);
      } else {
        await useAssetStore.getState().createAsset(finalData);
      }
      navigate("/admin");
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Erro ao salvar ativo ou fazer upload das imagens.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!assetId) return;
    if (
      window.confirm(
        "Tem certeza que deseja excluir este ativo permanentemente?",
      )
    ) {
      try {
        await useAssetStore.getState().deleteAsset(assetId);
        navigate("/admin");
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return {
    isSubmitting,
    handleSubmit,
    handleDelete,
    handleCancel,
  };
};
