import apiClient from "./apiClient";
import { type ImageMetadata, ImageMetadataSchema } from "../schemas/entities";

/**
 * Normalizes a raw File through the Canvas API.
 *
 * Why: Browsers derive `file.type` from the file extension, not binary content.
 * A HEIC renamed to .jpg, or a PNG with a wrong extension, will pass the type
 * check but be rejected by the backend's magic-byte inspection.
 *
 * This function draws the image into a Canvas and re-exports it as a real
 * image/jpeg Blob, guaranteeing the binary content matches the MIME type.
 *
 * It also enforces a maximum dimension (2048px) to keep uploads reasonable.
 */
async function normalizeImage(file: File, maxDimension = 2048): Promise<File> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Scale down if the image exceeds maxDimension on either axis
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas 2D context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob returned null"));
            return;
          }
          // Return a new File with the same base name but guaranteed .jpg
          const normalizedName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          resolve(new File([blob], normalizedName, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92, // Quality: 0.92 is visually lossless and accepted by all backends
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          `Image could not be decoded: "${file.name}". ` +
            "It may be corrupted or an unsupported format (e.g. HEIC).",
        ),
      );
    };

    img.src = objectUrl;
  });
}

const imageService = {
  /**
   * Fetch image metadata for a specific asset
   * @param assetId - The ID of the asset
   * @returns Array of image metadata
   */
  async getAssetImages(assetId: string): Promise<ImageMetadata[]> {
    try {
      if (!assetId) {
        throw new Error("Asset ID is required");
      }

      const response = await apiClient.get<ImageMetadata[]>(
        `/images/asset/${assetId}`,
      );

      return response.data.map((img) => ImageMetadataSchema.parse(img));
    } catch (error) {
      console.error(`Error fetching images for asset "${assetId}":`, error);
      throw new Error(
        `Failed to fetch asset images: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  /**
   * Fetch image file by filename
   * @param filename - The filename of the image
   * @returns Image blob
   */
  async fetchAnImage(filename: string): Promise<Blob | undefined> {
    try {
      if (!filename || typeof filename !== "string") {
        throw new Error("Invalid filename provided");
      }

      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");

      const response = await apiClient.get<Blob>(
        `/images/${sanitizedFilename}`,
        {
          responseType: "blob",
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching image "${filename}":`, error);
      throw new Error(
        `Failed to fetch image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  async uploadAnImage(
    file: File,
    assetId?: string,
    position: string = "OUTROS",
    isMain: boolean = false,
  ): Promise<ImageMetadata> {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file provided for upload");
      }

      // Normalize: re-encodes through Canvas → guarantees image/jpeg binary content.
      // Fixes cases where browser reports wrong MIME (HEIC as jpeg, renamed files, etc.)
      const normalizedFile = await normalizeImage(file);

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (normalizedFile.size > maxSize) {
        throw new Error(
          "File too large after normalization. Maximum size: 10MB",
        );
      }

      const formData = new FormData();
      formData.append("file", normalizedFile);
      if (assetId) {
        formData.append("asset_id", assetId);
      }
      formData.append("position", position);
      formData.append("is_main", String(isMain));

      const response = await apiClient.post<ImageMetadata>(
        "/images/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return ImageMetadataSchema.parse(response.data);
    } catch (error) {
      console.error(
        `Error uploading image "${file?.name || "unknown"}":`,
        error,
      );
      throw new Error(
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  async delete(url: string): Promise<void> {
    await apiClient.delete("/media", { data: { url } });
  },

  /**
   * Sets a specific image as the main image for an asset.
   * This is used when switching 'main' status among existing images.
   *
   * @param assetId - The ID of the asset
   * @param imageMetadataId - The ID of the image metadata
   */
  async setMainImage(assetId: string, imageMetadataId: string): Promise<void> {
    try {
      if (!assetId || !imageMetadataId) {
        throw new Error("Asset ID and Image Metadata ID are required");
      }

      await apiClient.patch(`/images/set_main/${imageMetadataId}`, null, {
        params: {
          asset_id: assetId,
        },
      });
    } catch (error) {
      console.error(`Error setting main image for asset "${assetId}":`, error);
      throw new Error(
        `Failed to set main image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
};

export default imageService;
