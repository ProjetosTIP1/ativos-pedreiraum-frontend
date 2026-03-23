import React, { useState, useEffect, useCallback, useRef } from "react";
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
  // Ref tracks the object URL so we can revoke it without adding imageUrl to deps
  const objectUrlRef = useRef<string | null>(null);

  const loadImage = useCallback(async () => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // If it's already a full URL, blob/data URI — set directly, no backend fetch needed
    const isFullUrl =
      src.startsWith("http") ||
      src.startsWith("blob:") ||
      src.startsWith("data:") ||
      src.startsWith("/");

    if (isFullUrl) {
      setImageUrl(src);
      setIsLoading(false);
      setError(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      const blob = await fetchImageBlob(src);
      const objectUrl = URL.createObjectURL(blob);

      // Revoke the previous object URL before storing the new one
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = objectUrl;
      setImageUrl(objectUrl);
    } catch (err) {
      console.error(`Failed to load image "${src}" from store:`, err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [src, fetchImageBlob]);

  useEffect(() => {
    setImageUrl(null);
    setError(false);
    setIsLoading(true);
    loadImage();

    return () => {
      // Cleanup blob URL on src change or unmount
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [loadImage]); // imageUrl intentionally NOT in deps — it was the loop trigger

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
