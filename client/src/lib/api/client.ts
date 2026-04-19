import axios from 'axios';
import type { ApiResponse } from '../../types';
import { API_BASE } from '../constants';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory tokens (not persisted to localStorage for security)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const getAccessToken = () => accessToken;

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap Spring Boot response & handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      try {
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_BASE}/auth/refresh`,
          { token: refreshToken }
        );

        const newToken = response.data.data.accessToken;
        accessToken = newToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (_refreshError) {
        clearTokens();
        localStorage.removeItem('hc-auth-storage');
        window.location.href = '/login';
        return Promise.reject(_refreshError);
      }
    }

    return Promise.reject(error);
  }
);
