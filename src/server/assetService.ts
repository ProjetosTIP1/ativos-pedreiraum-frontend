import apiClient from "./apiClient";
import {
  type Asset,
  AssetSchema,
  type CreateAssetRequest,
  type UpdateAssetRequest,
} from "../schemas/entities";

const assetService = {
  async getAll(
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/", { params });
    return response.data.map((asset) => AssetSchema.parse(asset));
  },

  async getHighlights(): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets/highlights");
    return response.data.map((asset) => AssetSchema.parse(asset));
  },

  async getById(id: string): Promise<Asset> {
    const response = await apiClient.get(`/assets/${id}`);
    return AssetSchema.parse(response.data);
  },

  async create(asset: CreateAssetRequest): Promise<Asset> {
    const response = await apiClient.post("/admin/assets/", asset);
    return AssetSchema.parse(response.data);
  },

  async updateAsset(id: string, asset: UpdateAssetRequest): Promise<Asset> {
    const response = await apiClient.patch(`/admin/assets/${id}`, asset);
    return AssetSchema.parse(response.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/assets/${id}`);
  },
};

export default assetService;
