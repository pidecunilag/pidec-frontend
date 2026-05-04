import type { ApiResponse, Notification, PaginationParams } from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from './client';

export const notificationsApi = {
  getNotifications(params?: PaginationParams) {
    return apiClient
      .get<ApiResponse<Notification[]>>('/notifications', { params })
      .then(unwrapWithMeta);
  },

  markRead(notificationId: string) {
    return apiClient
      .post<ApiResponse<null>>(`/notifications/${notificationId}/read`)
      .then(unwrap);
  },

  markAllRead() {
    return apiClient.post<ApiResponse<null>>('/notifications/read-all').then(unwrap);
  },
};
