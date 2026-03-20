import apiClient from "./apiClient";
import {
  type Asset,
  AssetSchema,
  type ImageMetadata,
} from "../schemas/entities";

const assetService = {
  async getAll(
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/", { params });
    return response.data;
  },

  async getAssetImagesMetadata(assetId: string): Promise<ImageMetadata[]> {
    const response = await apiClient.get<ImageMetadata[]>(
      `/images/asset/${assetId}`,
      {
        params: {
          asset_id: assetId,
        },
      },
    );
    return response.data;
  },

  async getHighlights(): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/highlights");
    return response.data;
  },

  async getById(id: string): Promise<Asset> {
    const response = await apiClient.get(`/assets/${id}`);
    return AssetSchema.parse(response.data);
  },

  async create(asset: Partial<Asset>): Promise<Asset> {
    console.log("Creating asset with data:", asset);
    const response = await apiClient.post("/admin/assets/", asset);
    console.log("API Response for Create:", response.data);
    return AssetSchema.parse(response.data);
  },

  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    console.log(`Updating asset ${id} with data:`, asset);
    const response = await apiClient.patch(`/admin/assets/${id}`, asset);
    console.log("API Response for Update:", response.data);
    return AssetSchema.parse(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  },
};

export default assetService;
