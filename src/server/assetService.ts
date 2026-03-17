import apiClient from "./apiClient";
import { type Asset, AssetSchema } from "../schemas/entities";

const assetService = {
  async getAll(
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/", { params });
    return response.data;
  },

  async getHighlights(): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/highlights");
    console.log("API Response for Highlights:", response.data);
    return response.data;
  },

  async getBySlug(slug: string): Promise<Asset> {
    const response = await apiClient.get(`/assets/${slug}`);
    return AssetSchema.parse(response.data);
  },

  async create(asset: Partial<Asset>): Promise<Asset> {
    console.log("Creating asset with data:", asset);
    const response = await apiClient.post("/assets/", asset);
    console.log("API Response for Create:", response.data);
    return AssetSchema.parse(response.data);
  },

  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    const response = await apiClient.put(`/assets/${id}`, asset);
    return AssetSchema.parse(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  },
};

export default assetService;
