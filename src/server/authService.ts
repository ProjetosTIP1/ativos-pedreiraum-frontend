import apiClient from './apiClient';
import { type User, UserSchema } from '../schemas/entities';

const authService = {
    async login(credentials: Record<string, string>): Promise<User> {
        const response = await apiClient.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        return UserSchema.parse(response.data.user);
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    async me(): Promise<User> {
        const response = await apiClient.get('/users/me');
        return UserSchema.parse(response.data.user);
    }
};

export default authService;
