import apiClient from './apiClient';
import { type User, UserSchema } from '../schemas/entities';

const authService = {
    async login(credentials: Record<string, string>): Promise<User> {
        const response = await apiClient.post('/auth/login', credentials);
        return UserSchema.parse(response.data);
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    async me(): Promise<User> {
        const response = await apiClient.get('/auth/me');
        return UserSchema.parse(response.data);
    }
};

export default authService;
