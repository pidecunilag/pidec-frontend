import type { ApiResponse, Feedback } from '@/lib/types';

import { apiClient, unwrap } from './client';

export const feedbackApi = {
  getMyFeedback() {
    return apiClient.get<ApiResponse<Feedback[]>>('/feedback/me').then(unwrap);
  },

  getFeedback(submissionId: string) {
    return apiClient.get<ApiResponse<Feedback>>(`/feedback/${submissionId}`).then(unwrap);
  },
};
