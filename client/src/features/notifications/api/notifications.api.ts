import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type { ApiResponse, PaginatedResponse, AppNotification, PaginationParams } from '../../../types';

export const notificationsApi = {
  getAll: (params: PaginationParams = {}) =>
    apiClient.get<PaginatedResponse<AppNotification>>(API_URLS.NOTIFICATIONS, { params }) as unknown as Promise<PaginatedResponse<AppNotification>>,

  markRead: (id: string) =>
    apiClient.patch<ApiResponse<AppNotification>>(`${API_URLS.NOTIFICATIONS}/${id}/read`) as unknown as Promise<ApiResponse<AppNotification>>,

  markAllRead: () =>
    apiClient.patch<ApiResponse<void>>(`${API_URLS.NOTIFICATIONS}/read-all`) as unknown as Promise<ApiResponse<void>>,

  getUnreadCount: () =>
    apiClient.get<ApiResponse<number>>(`${API_URLS.NOTIFICATIONS}/unread-count`) as unknown as Promise<ApiResponse<number>>,
};
