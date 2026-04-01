import React, { useState } from "react";
import imageService from "../../server/imageService";
import styles from "./AssetImage.module.css";
import imagesPlaceholder from "../../assets/images/image-placeholder.png";

interface AssetImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}

/**
 * Optimized image component that handles both local preview URLs
 * and backend static filenames via the new StaticFiles endpoint.
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className,
  fallback,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [prevSrc, setPrevSrc] = useState<string | undefined>(src);

  // If src changes, reset state synchronously during render
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(true);
    setError(false);
  }

  // Resolve the URL: if it's a filename, getImageUrl prefixes it with /images/
  const resolvedUrl = imageService.getImageUrl(src);

  if (error || !resolvedUrl) {
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
      <img
        src={resolvedUrl}
        alt={alt}
        className={`${styles.image} ${!isLoading ? styles.imageLoaded : ""}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
    </div>
  );
};
