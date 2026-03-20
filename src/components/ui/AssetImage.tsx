import React, { useState, useEffect } from "react";

/**
 * Props for the AssetImage component.
 * Extends the standard HTML <img> attributes for maximum compatibility.
 */
interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The source of the image. Can be a full URL, a public path, or a filename from the backend.
   */
  src?: string;
  /**
   * An optional fallback image path if the main image fails to load.
   * Defaults to '/images/image-placeholder.png'.
   */
  fallback?: string;
}

const PLACEHOLDER_PATH = "/images/image-placeholder.png";
const API_IMAGES_ENDPOINT = "/api/v1/images";

/**
 * AssetImage Component
 *
 * Responsibilities:
 * 1. Handles dynamic construction of asset URLs pointing to the backend API.
 * 2. Gracefully falls back to a placeholder image if the source is missing or broken.
 * 3. Handles extraction of filenames from paths to ensure compatibility with backend endpoints.
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  fallback = PLACEHOLDER_PATH,
  className,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state for new source
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasError(false);

    if (!src) {
      setCurrentSrc(fallback);
      return;
    }

    // Determine the final source URL
    let finalSrc = src;

    // Logic for constructing backend URLs:
    // If the src is NOT an external URL, a data URI, or already a public folder path,
    // we assume it is a backend filename or path and route it through the API.
    const isExternal = src.startsWith("http") || src.startsWith("data:");
    const isPublicPath = src.startsWith("/images/") || src.startsWith("/assets/") || src.includes(".svg");

    if (!isExternal && !isPublicPath) {
      // Extract filename only (handles /uploads/abc.jpg or just abc.jpg)
      const filename = src.split("/").pop();
      if (filename) {
        finalSrc = `${API_IMAGES_ENDPOINT}/${filename}`;
      } else {
        finalSrc = fallback;
      }
    }

    setCurrentSrc(finalSrc);
  }, [src, fallback]);

  /**
   * Handle image load errors by switching to the fallback image.
   * We only attempt to fallback once to avoid infinite loops if the fallback is also broken.
   */
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || "Imagem do ativo"}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
