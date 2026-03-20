import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetDetails } from "./hooks/useAssetDetails";
import { useImageGallery } from "./hooks/useImageGallery";
import { useWhatsAppContact } from "./hooks/useWhatsAppContact";
import { AssetDetailsHeader } from "./components/AssetDetailsHeader";
import { AssetGallery } from "./components/AssetGallery";
import { AssetInfoHeader } from "./components/AssetInfoHeader";
import { AssetPriceAction } from "./components/AssetPriceAction";
import { AssetSpecs } from "./components/AssetSpecs";
import { AssetDescription } from "./components/AssetDescription";
import { BottomDecorator } from "./components/BottomDecorator";
import { AssetLoadingState, AssetErrorState } from "./components/AssetStates";
import style from "./AssetDetails.module.css";

/**
 * AssetDetails - Main component for displaying asset details
 *
 * This component orchestrates the asset detail view by composing:
 * - Custom hooks for business logic (data fetching, gallery, WhatsApp)
 * - Smaller UI components for each section (header, gallery, specs, etc.)
 *
 * Follows Clean Architecture: presentation is separated from business logic
 */
export const AssetDetails: React.FC = () => {
  const navigate = useNavigate();

  // Custom hooks for business logic
  const { asset, isLoading, error } = useAssetDetails();
  const {
    activeImage,
    setActiveImage,
    galleryUrls,
    nextImage,
    prevImage,
    hasMultipleImages,
  } = useImageGallery(asset ?? undefined);
  const { openWhatsApp } = useWhatsAppContact();

  const handleBack = () => navigate("/ativos");

  // Handle loading state
  if (isLoading && !asset) {
    return <AssetLoadingState />;
  }

  // Handle error/not found state
  if (error || !asset) {
    return <AssetErrorState error={error ?? undefined} onBack={handleBack} />;
  }

  return (
    <div className={style.container}>
      <AssetDetailsHeader onBack={handleBack} />

      <div className={style.mainGrid}>
        <AssetGallery
          galleryUrls={galleryUrls}
          activeImage={activeImage}
          onSetActiveImage={setActiveImage}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          assetName={asset.name}
          condition={asset.condition}
          status={asset.status}
          hasMultipleImages={hasMultipleImages}
        />

        <div className={style.infoWrapper}>
          <AssetInfoHeader asset={asset} />
          <AssetPriceAction
            asset={asset}
            onContact={() => openWhatsApp(asset)}
          />
          <AssetSpecs asset={asset} />
          <AssetDescription description={asset.description} />
        </div>
      </div>

      <BottomDecorator />
    </div>
  );
};
