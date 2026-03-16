import apiClient from './apiClient';

const imageService = {
    async upload(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiClient.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    },

    async delete(url: string): Promise<void> {
        await apiClient.delete('/media', { data: { url } });
    }
};

export default imageService;
