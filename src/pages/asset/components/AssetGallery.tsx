import React from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { AssetImage } from "../../../components/ui/AssetImage";
import style from "../AssetDetails.module.css";

interface AssetGalleryProps {
  galleryUrls: string[];
  activeImage: number;
  onSetActiveImage: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  assetName: string;
  condition: string;
  status: string;
  hasMultipleImages: boolean;
}

/**
 * Image gallery component with thumbnails and navigation
 * Displays main image with badges, navigation controls, and thumbnail grid
 */
export const AssetGallery: React.FC<AssetGalleryProps> = ({
  galleryUrls,
  activeImage,
  onSetActiveImage,
  onPrevImage,
  onNextImage,
  assetName,
  condition,
  status,
  hasMultipleImages,
}) => {
  return (
    <div className={style.galleryWrapper}>
      <div className={style.mainImageWrapper}>
        <AssetImage
          src={galleryUrls[activeImage]}
          alt={assetName}
          className={style.mainImage}
        />
        <div className={style.badgesWrapper}>
          <Badge variant="orange">{condition}</Badge>
          <Badge variant="default">{status}</Badge>
        </div>

        {hasMultipleImages && (
          <>
            <button
              onClick={onPrevImage}
              className={`${style.galleryNav} ${style.galleryNavPrev}`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNextImage}
              className={`${style.galleryNav} ${style.galleryNavNext}`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        <div className={style.zoomIndicator}>
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Thumbnails */}
      <div className={style.thumbnailsGrid}>
        {galleryUrls.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSetActiveImage(idx)}
            className={`${style.thumbnailButton} ${activeImage === idx ? style.thumbnailButtonActive : style.thumbnailButtonInactive}`}
          >
            <AssetImage
              src={img}
              alt={`${assetName} thumb ${idx}`}
              className={style.thumbnailImage}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
