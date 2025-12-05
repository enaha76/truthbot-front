import axios from 'axios';
import { StorageService } from './storageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const user = StorageService.getUser();
    if (user && user.token) {
      config.headers.Authorization = `JWT ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors (optional: token refresh)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login or refresh token)
      // For now, we might just clear the user and let the UI handle the redirect
      StorageService.clearUser();
      // window.location.href = '/#/login'; // Simple redirect if needed
    }
    return Promise.reject(error);
  }
);

export default api;
