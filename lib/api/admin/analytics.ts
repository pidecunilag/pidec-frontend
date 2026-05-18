import type { AdminAnalytics, AdminAnalyticsParams, ApiResponse } from '@/lib/types';

import { apiClient, unwrap } from '../client';

export const analyticsApi = {
  getAnalytics(params?: AdminAnalyticsParams) {
    return apiClient
      .get<ApiResponse<AdminAnalytics>>('/admin/analytics', { params })
      .then(unwrap);
  },
};
