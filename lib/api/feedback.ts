import type { ApiResponse, Feedback } from '@/lib/types';

import { apiClient, unwrap } from './client';

export const feedbackApi = {
  getMyFeedback() {
    return apiClient
      .get<ApiResponse<{ feedback: Feedback[] }>>('/feedback/me')
      .then((response) => unwrap(response).feedback);
  },

  getFeedback(submissionId: string) {
    return apiClient
      .get<ApiResponse<{ feedback: Feedback | null }>>(`/feedback/${submissionId}`)
      .then((response) => unwrap(response).feedback);
  },
};
