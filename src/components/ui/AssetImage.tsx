import React, { useState, useEffect, useCallback } from "react";
import { useImageStore } from "../../stores/useImageStore";
import styles from "./AssetImage.module.css";
import imagesPlaceholder from "../../assets/images/image-placeholder.png";

interface AssetImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className,
  fallback,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const fetchImageBlob = useImageStore((state) => state.fetchImageBlob);

  const loadImage = useCallback(async () => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // Check if src is already a full URL, blob URL, or data URI
    const isFullUrl =
      src.startsWith("http") ||
      src.startsWith("blob:") ||
      src.startsWith("data:") ||
      src.startsWith("/"); // Assuming root-relative paths are final

    if (isFullUrl) {
      setImageUrl(src);
      setIsLoading(false);
      setError(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      // Attempt to fetch as blob from backend (src is likely just a filename)
      const blob = await fetchImageBlob(src);
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err) {
      console.error(`Failed to load image "${src}" from store:`, err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [src, fetchImageBlob]);

  useEffect(() => {
    loadImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [loadImage, imageUrl]);

  // Handle case where src changes - cleanup is handled by the useEffect return
  
  if (error || !src) {
    return (
      <div className={`${styles.container} ${className}`}>
        {fallback ? (
          <img src={fallback} alt={alt} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <img src={imagesPlaceholder} alt={alt} className={styles.image} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {isLoading && <div className={styles.loadingOverlay} />}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={`${styles.image} ${!isLoading ? styles.imageLoaded : ""}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};
