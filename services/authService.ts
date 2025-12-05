import api from './api';
import { StorageService } from './storageService';
import { User } from '../types';

interface LoginResponse {
    access: string;
    refresh: string;
}

interface UserResponse {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export const AuthService = {
    login: async (email: string, password: string): Promise<User> => {
        // 1. Get JWT Token
        const response = await api.post<LoginResponse>('/auth/jwt/create/', {
            email: email, // Djoser configured with LOGIN_FIELD = 'email' expects 'email' field
            password,
        });

        const { access, refresh } = response.data;

        // 2. Get User Details
        // We need to set the token in StorageService temporarily or manually attach header for this request
        // But api.ts interceptor reads from StorageService.getUser().token.
        // So we construct a temporary user object with the token.

        const tempUser: User = {
            id: 'temp',
            email: email,
            name: 'Loading...',
            token: access
        };
        StorageService.saveUser(tempUser);

        try {
            const userResponse = await api.get<UserResponse>('/auth/users/me/');

            const user: User = {
                id: userResponse.data.id.toString(),
                email: userResponse.data.email,
                name: userResponse.data.first_name || userResponse.data.username || userResponse.data.email.split('@')[0],
                token: access,
            };

            StorageService.saveUser(user);
            return user;
        } catch (error) {
            StorageService.clearUser();
            throw error;
        }
    },

    register: async (email: string, password: string, name: string): Promise<void> => {
        await api.post('/auth/users/', {
            email,
            password,
            first_name: name, // Store name in first_name field instead of username
            // username will be auto-generated from email on backend
        });
    },

    logout: () => {
        StorageService.clearUser();
    }
};
