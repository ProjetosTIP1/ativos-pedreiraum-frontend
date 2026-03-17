import apiClient from "./apiClient";
import { type ImageMetadata } from "../schemas/entities";

const imageService = {
  async fetchAnImage(filename: string): Promise<Blob | undefined> {
    try {
      // Validate filename parameter (defensive programming)
      if (!filename || typeof filename !== "string") {
        throw new Error("Invalid filename provided");
      }

      // Sanitize filename to prevent path traversal attacks
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
      if (sanitizedFilename !== filename) {
        console.warn(
          `Filename was sanitized: ${filename} -> ${sanitizedFilename}`,
        );
      }

      // Make request to correct backend endpoint
      const response = await apiClient.get<Blob>(
        `/images/${sanitizedFilename}`,
        {
          responseType: "blob",
        },
      );

      console.log(`Successfully fetched image: ${sanitizedFilename}`);
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
    token?: string,
  ): Promise<ImageMetadata | undefined> {
    try {
      // Validate file parameter (defensive programming)
      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file provided for upload");
      }

      // Validate file type (matching backend validation)
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          `Unsupported file type: ${
            file.type
          }. Allowed types: ${allowedTypes.join(", ")}`,
        );
      }

      // Validate file size (10MB limit matching backend)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(
          `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
        );
      }

      // Validate filename exists
      if (!file.name) {
        throw new Error("File must have a name");
      }

      console.log(
        `Uploading image: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`,
      );

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("file", file);

      // Make request to backend endpoint with Bearer token
      const response = await apiClient.post<ImageMetadata>(
        "/images/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - let the browser set it with boundary
          },
        },
      );

      console.log(
        `Successfully uploaded image: ${file.name} -> ${response.data}`,
      );

      // The backend returns ImageMetadata with backend property names,
      // but our frontend expects different property names, so we map them correctly
      const imageMetadata: ImageMetadata = {
        id: response.data.id,
        url: response.data.url,
        name: response.data.name,
        alt_text: response.data.alt_text, // Map backend's alt_text to frontend's altText
        is_main: response.data.is_main, // Map backend's is_main to frontend's isMain
      };

      return imageMetadata;
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
};

export default imageService;
