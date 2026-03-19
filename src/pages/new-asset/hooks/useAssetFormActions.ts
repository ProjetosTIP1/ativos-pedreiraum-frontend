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
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    let createdAssetId: string | null = null;

    try {
      // 1. Create or Update asset
      if (!assetId) {
        console.log("Creating new asset...");
        // Initial creation with basic data
        const initialData = {
          ...formData,
          main_image: "", // Will be updated by backend when images are uploaded
          gallery: [],
        };
        const newAsset = await useAssetStore.getState().createAsset(initialData);
        createdAssetId = newAsset.id;
        console.log("Asset created with ID:", createdAssetId);
      } else {
        console.log("Updating existing asset:", assetId);
        await useAssetStore.getState().updateAsset(assetId, formData);
        createdAssetId = assetId;
        console.log("Asset updated successfully");
      }

      // 2. Upload new images
      const filesToUpload = positionedFiles.filter((pf) => pf.file);
      console.log(`Uploading ${filesToUpload.length} images...`);
      
      const uploadPromises = filesToUpload.map(async (pf) => {
        // Determine if it should be main image (usually the Front view)
        const isMainImage = pf.position === "Frente"; 
        console.log(`Uploading image for position: ${pf.position}`);
        
        return await imageService.uploadAnImage(
          createdAssetId!,
          pf.file!,
          pf.position,
          isMainImage
        );
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      console.log("All images uploaded successfully");

      // 3. Finalize
      alert("Ativo salvo com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }

      // Navigate back to admin dashboard
      navigate("/admin");
    } catch (error: unknown) {
      console.error("Error saving asset:", error);
      
      // Build detailed error message
      const apiError = error as { message?: string; status?: number };
      const errorMessage = apiError?.message || "Erro desconhecido";
      const errorStatus = apiError?.status || "N/A";
      console.error(`❌ Operation failed: ${errorMessage} (Status: ${errorStatus})`);
      
      // Attempt simple "rollback" for new assets if creation succeeded but images failed
      // This is a basic "all or nothing" approach from the frontend perspective
      if (!assetId && createdAssetId) {
        try {
          console.warn("Attempting rollback...");
          await useAssetStore.getState().deleteAsset(createdAssetId);
          console.warn("Rollback: Deleted incomplete asset after image upload failure");
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      }
      
      alert(`Erro ao salvar ativo: ${errorMessage}\n\nStatus: ${errorStatus}\n\nA operação foi cancelada para garantir a integridade dos dados.`);
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
