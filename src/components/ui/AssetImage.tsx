import React, { useState, useEffect, useCallback } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
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
  fallback 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const fetchImageByUrl = useAssetStore((state) => state.fetchImageByUrl);

  const loadImage = useCallback(async () => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // If it's already a full URL or data URI, we could potentially just use it,
    // but the user specifically asked to "use this functions to fetch it".
    // Also, backend images might need authentication headers which the store's fetch provides.
    
    try {
      setIsLoading(true);
      setError(false);
      
      // Attempt to fetch as blob (handles auth/custom logic in store)
      const blob = await fetchImageByUrl(src);
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err) {
      console.error("Failed to load image from store:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [src, fetchImageByUrl]);

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
