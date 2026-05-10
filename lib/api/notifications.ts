import type { ApiResponse, Notification, PaginationParams } from '@/lib/types';

import { apiClient, unwrap } from './client';

export const notificationsApi = {
  getNotifications(params?: PaginationParams) {
    return apiClient
      .get<
        ApiResponse<{
          items: Notification[];
          hasMore: boolean;
          nextCursor?: string | null;
        }>
      >('/notifications', { params })
      .then((response) => {
        const payload = unwrap(response);
        return {
          data: payload.items,
          meta: {
            limit: params?.limit ?? 20,
            hasMore: payload.hasMore,
            cursor: payload.nextCursor ?? undefined,
          },
        };
      });
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
