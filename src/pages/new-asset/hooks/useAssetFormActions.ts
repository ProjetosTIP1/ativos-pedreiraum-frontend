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
      let currentAssetId = assetId;

      // 1. Create or Update asset first to ensure we have a valid asset state
      if (!currentAssetId) {
        // Initial creation with basic data
        const initialData = {
          ...formData,
          main_image: "",
          gallery: [],
        };
        const newAsset = await useAssetStore.getState().createAsset(initialData);
        currentAssetId = newAsset.id;
      } else {
        // Update existing asset metadata
        await useAssetStore.getState().updateAsset(currentAssetId, formData);
      }

      // 2. Upload new images
      // They will automatically sync with the assets table via SQLImageRepository
      const uploadPromises = positionedFiles
        .filter((pf) => pf.file)
        .map(async (pf) => {
          const isMainImage = pf.position === "FRONT"; // Example logic
          return await imageService.uploadAnImage(
            currentAssetId!,
            pf.file!,
            pf.position,
            isMainImage
          );
        });

      await Promise.all(uploadPromises);

      // Navigate to admin
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
