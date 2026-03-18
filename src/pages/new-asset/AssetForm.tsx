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
  const { formData, handleChange, handlePriceChange } =
    useAssetFormData(id);

  const { positionedFiles, handleFileSelect, removeFile } =
    useImageManagement(formData);

  const { isSubmitting, handleSubmit, handleDelete, handleCancel } =
    useAssetFormActions(id);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData, positionedFiles);
  };

  return (
    <div className={style.container}>
      <AssetFormHeader
        isEdit={!!id}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onSubmit={onSubmit}
      />

      <form onSubmit={onSubmit} className={style.formGrid}>
        {/* Left Column: Main Info */}
        <div className={style.mainColumn}>
          <AssetGeneralInfo formData={formData} onChange={handleChange} />
          <AssetImageManager
            positionedFiles={positionedFiles}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
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
      </form>
    </div>
  );
};
