import type { AdminOverview, ApiResponse } from '@/lib/types';

import { apiClient, unwrap } from '../client';

export const overviewApi = {
  getOverview() {
    return apiClient.get<ApiResponse<AdminOverview>>('/admin/overview').then(unwrap);
  },
};
