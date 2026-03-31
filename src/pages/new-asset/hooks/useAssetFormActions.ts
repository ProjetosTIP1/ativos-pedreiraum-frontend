import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetStore } from "../../../stores/useAssetStore";
import imageService from "../../../server/imageService";
import {
  type CreateAssetRequest,
  type UpdateAssetRequest,
} from "../../../schemas/entities";
import type { PositionedFile } from "./useImageManagement";

/**
 * Custom hook to handle Asset form actions (submit, delete)
 * Encapsulates business logic for CRUD operations and image uploads
 */
export const useAssetFormActions = (assetId?: string) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    formData: CreateAssetRequest | UpdateAssetRequest,
    positionedFiles: PositionedFile[],
    onSuccess?: () => void,
  ) => {
    setIsSubmitting(true);
    let createdAssetId: string | null = null;

    try {
      // 1. Create or Update asset
      if (!assetId) {
        console.log("Creating new asset...");
        // Initial creation with basic data
        const newAsset = await useAssetStore
          .getState()
          .createAsset(formData as CreateAssetRequest);
        createdAssetId = newAsset.id;
        console.log("Asset created with ID:", createdAssetId);
      } else {
        console.log("Updating existing asset:", assetId);
        await useAssetStore
          .getState()
          .updateAsset(assetId, formData as UpdateAssetRequest);
        createdAssetId = assetId;
        console.log("Asset updated successfully");
      }

      // 2. Upload new images sequentially — avoids overwhelming the backend
      // with concurrent multipart requests (race conditions / connection pool exhaustion).
      const filesToUpload = positionedFiles.filter((pf) => pf.file);
      console.log(`Uploading ${filesToUpload.length} images sequentially...`);

      type UploadResult =
        | { status: "fulfilled"; file: PositionedFile }
        | { status: "rejected"; file: PositionedFile; reason: unknown };

      const uploadResults: UploadResult[] = [];

      for (const pf of filesToUpload) {
        try {
          await imageService.uploadAnImage(
            pf.file!,
            createdAssetId!,
            pf.position,
            pf.isMain ?? false,
          );
          uploadResults.push({ status: "fulfilled", file: pf });
          console.log(`✅ Uploaded: ${pf.file?.name}`);
        } catch (err) {
          uploadResults.push({ status: "rejected", file: pf, reason: err });
          console.warn(`⚠️ Failed to upload: ${pf.file?.name}`, err);
        }
      }

      // Separate successes from failures
      const failedUploads = uploadResults.filter(
        (r): r is Extract<UploadResult, { status: "rejected" }> =>
          r.status === "rejected",
      );

      if (failedUploads.length > 0) {
        const failedNames = failedUploads
          .map(({ file }) => file.file?.name ?? "desconhecido")
          .join(", ");
        console.warn(`⚠️ ${failedUploads.length} imagem(ns) não foram salvas: ${failedNames}`);
        // Warn but do NOT block — the asset was persisted successfully
        alert(
          `Ativo salvo com sucesso!\n\n⚠️ Atenção: ${failedUploads.length} imagem(ns) não puderam ser carregadas (${failedNames}).\n\nVocê pode adicioná-las novamente editando o ativo.`,
        );
      } else {
        console.log("All images uploaded successfully");
        alert("Ativo salvo com sucesso!");
      }

      // 3. Update main flag for existing images if changed
      // If a position has no NEW file but is marked as isMain,
      // and it HAS existingMetadata, we should call the new set_main endpoint.
      const existingMain = positionedFiles.find(
        (pf) => pf.isMain && pf.existingMetadata && !pf.file,
      );

      if (existingMain && existingMain.existingMetadata) {
        try {
          console.log(
            `Updating main flag for existing image: ${existingMain.existingMetadata.id}`,
          );
          await imageService.setMainImage(
            createdAssetId!,
            existingMain.existingMetadata.id,
          );
          console.log("✅ Main flag updated for existing image");
        } catch (err) {
          console.warn("⚠️ Failed to update main flag for existing image", err);
          // Don't block the whole process if this fails, but warn the user
        }
      }

      // 4. Handle image deletions
      const deletedImages = positionedFiles.filter(
        (pf) => pf.existingMetadata && !pf.previewUrl && !pf.file,
      );

      if (deletedImages.length > 0) {
        console.log(`Deleting ${deletedImages.length} images from backend...`);
        for (const pf of deletedImages) {
          try {
            await imageService.deleteImage(pf.existingMetadata!.id);
            console.log(`✅ Deleted image: ${pf.existingMetadata!.id}`);
          } catch (err) {
            console.warn(
              `⚠️ Failed to delete image: ${pf.existingMetadata!.id}`,
              err,
            );
          }
        }
      }

      // 5. Finalize — navigate regardless of image upload/delete failures
      if (onSuccess) {
        onSuccess();
      }
      navigate("/admin");
    } catch (error: unknown) {
      console.error("Error saving asset:", error);

      // Build detailed error message
      const apiError = error as { message?: string; status?: number };
      const errorMessage = apiError?.message || "Erro desconhecido";
      const errorStatus = apiError?.status || "N/A";
      console.error(
        `❌ Operation failed: ${errorMessage} (Status: ${errorStatus})`,
      );

      // Attempt simple "rollback" for new assets if creation succeeded but images failed
      // This is a basic "all or nothing" approach from the frontend perspective
      if (!assetId && createdAssetId) {
        try {
          console.warn("Attempting rollback...");
          await useAssetStore.getState().deleteAsset(createdAssetId);
          console.warn(
            "Rollback: Deleted incomplete asset after image upload failure",
          );
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      }

      alert(
        `Erro ao salvar ativo: ${errorMessage}\n\nStatus: ${errorStatus}\n\nA operação foi cancelada para garantir a integridade dos dados.`,
      );
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
