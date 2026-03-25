import { z } from "zod";
import React from "react";
import { useParams } from "react-router-dom";
import { useAssetFormData } from "./hooks/useAssetFormData";
import { useImageManagement } from "./hooks/useImageManagement";
import { useAssetFormActions } from "./hooks/useAssetFormActions";
import { AssetFormHeader } from "./components/AssetFormHeader";
import { AssetGeneralInfo } from "./components/AssetGeneralInfo";
import { AssetImageManager } from "./components/AssetImageManager";
import { AssetStatusPanel } from "./components/AssetStatusPanel";
import { AssetCommercialPanel } from "./components/AssetCommercialPanel";
import { AssetDangerZone } from "./components/AssetDangerZone";
import {
  CreateAssetRequestSchema,
  UpdateAssetRequestSchema,
} from "../../schemas/entities";
import style from "./AssetForm.module.css";

/**
 * AssetForm - Main form component for creating/editing assets
 *
 * This component orchestrates the Asset form by composing:
 * - Custom hooks for business logic (form state, image handling, actions)
 * - Smaller UI components for each section (header, info, images, status, etc.)
 *
 * Follows Clean Architecture: presentation is separated from business logic
 */
export const AssetForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  // Custom hooks for business logic
  const { formData, setFormData, handleChange, handlePriceChange } =
    useAssetFormData(id);

  const {
    positionedFiles,
    setPositionedFiles,
    handleFileSelect,
    removeFile,
    toggleMain,
    isLoadingImages,
  } = useImageManagement(id);

  const { isSubmitting, handleSubmit, handleDelete, handleCancel } =
    useAssetFormActions(id);

  const resetForm = () => {
    // Reset data to defaults (from useAssetFormData)
    setFormData({
      name: "",
      category: "OUTROS",
      subcategory: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      serial_number: "",
      location: "",
      condition: "BOM",
      status: "PENDENTE",
      price: undefined,
      description: "",
      highlighted: false,
    });

    // Clear image previews and files
    import("./hooks/useImageManagement").then(({ REQUIRED_POVS }) => {
      setPositionedFiles(REQUIRED_POVS.map((pos) => ({ position: pos })));
    });
  };

  const onSubmit = async () => {
    const schema = id ? UpdateAssetRequestSchema : CreateAssetRequestSchema;
    if (!formData.serial_number) {
      formData.serial_number = "00.00.0000";
    }

    if (!formData.subcategory) {
      formData.subcategory = "Outros";
    }
    try {
      schema.parse(formData);
      await handleSubmit(formData, positionedFiles, resetForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.issues.map((issue) => issue.message).join(", "));
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        alert(`Erro ao atualizar RCI: ${errorMessage}`);
      }
    }
  };

  return (
    <div className={style.container}>
      <AssetFormHeader
        isEdit={!!id}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onSubmit={onSubmit}
      />

      <div className={style.formGrid}>
        {/* Left Column: Main Info */}
        <div className={style.mainColumn}>
          <AssetGeneralInfo formData={formData} onChange={handleChange} />
          <AssetImageManager
            positionedFiles={positionedFiles}
            isLoadingImages={isLoadingImages}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            onToggleMain={toggleMain}
          />
        </div>

        {/* Right Column: Status & Price */}
        <div className={style.sideColumn}>
          <AssetStatusPanel formData={formData} onChange={handleChange} />
          <AssetCommercialPanel
            formData={formData}
            onPriceChange={handlePriceChange}
          />
          {id && <AssetDangerZone onDelete={handleDelete} />}
        </div>
      </div>
    </div>
  );
};
