import apiClient from "./apiClient";
import { type ImageMetadata } from "../schemas/entities";

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
        `/images/assets/${assetId}`
      );

      return response.data;
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
    position: string = "OTHERS",
    isMain: boolean = false
  ): Promise<ImageMetadata> {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file provided for upload");
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}.`);
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size: 10MB");
      }

      const formData = new FormData();
      formData.append("file", file);
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
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error uploading image "${file?.name || "unknown"}":`, error);
      throw new Error(
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  async delete(url: string): Promise<void> {
    await apiClient.delete("/media", { data: { url } });
  },
};

export default imageService;
