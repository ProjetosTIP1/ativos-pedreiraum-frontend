import apiClient from './apiClient';
import { type Asset, AssetSchema } from '../schemas/entities';
import { z } from 'zod';

const assetService = {
    async getAll(params?: Record<string, string | number | boolean | undefined>): Promise<Asset[]> {
        const response = await apiClient.get('/assets/', { params });
        return z.array(AssetSchema).parse(response.data);
    },

    async getHighlights(): Promise<Asset[]> {
        const response = await apiClient.get('/assets/highlights');
        return z.array(AssetSchema).parse(response.data);
    },

    async getBySlug(slug: string): Promise<Asset> {
        const response = await apiClient.get(`/assets/${slug}`);
        return AssetSchema.parse(response.data);
    },

    async create(asset: Partial<Asset>): Promise<Asset> {
        const response = await apiClient.post('/assets', asset);
        return AssetSchema.parse(response.data);
    },

    async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
        const response = await apiClient.put(`/assets/${id}`, asset);
        return AssetSchema.parse(response.data);
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/assets/${id}`);
    }
};

export default assetService;
