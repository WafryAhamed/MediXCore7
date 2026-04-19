import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, LoginResponse, ApiResponse } from '../types';
import { apiClient, setTokens, clearTokens } from '../lib/api/client';
import { API_URLS } from '../lib/constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  hydrateTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post(API_URLS.AUTH.LOGIN, credentials);
          const data = (response as unknown as ApiResponse<LoginResponse>).data;
          
          // Store tokens in memory via api client
          setTokens(data.accessToken, data.refreshToken);
          
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.post(API_URLS.AUTH.LOGOUT);
        } catch {
          // Ignore logout API errors
        } finally {
          clearTokens();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await apiClient.post(API_URLS.AUTH.REFRESH, {
            token: refreshToken,
          });
          const data = (response as unknown as ApiResponse<{ accessToken: string }>).data;
          setTokens(data.accessToken, refreshToken);
          set({ accessToken: data.accessToken });
        } catch {
          clearTokens();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user: User) => set({ user }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      hydrateTokens: (access: string, refresh: string) => {
        setTokens(access, refresh);
        set({ accessToken: access, refreshToken: refresh });
      },
    }),
    {
      name: 'hc-auth-storage',
      // Only persist user object (not tokens) for security
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
