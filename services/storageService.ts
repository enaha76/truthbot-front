import { User } from '../types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'veritas_auth_token',
  USER_DATA: 'veritas_user_data',
};

export const StorageService = {
  // Auth Helpers
  saveUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, user.token);
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userStr ? JSON.parse(userStr) : null;
  },
};