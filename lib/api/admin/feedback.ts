import type {
  ApiResponse,
  EnterFeedbackRequest,
  Feedback,
  PublishFeedbackRequest,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

export const feedbackAdminApi = {
  enterFeedback(submissionId: string, data: EnterFeedbackRequest) {
    return apiClient
      .post<ApiResponse<Feedback>>(`/admin/feedback/${submissionId}`, data)
      .then(unwrap);
  },

  publishFeedback(submissionId: string) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/feedback/${submissionId}/publish`)
      .then(unwrap);
  },

  publishBulkFeedback(data: PublishFeedbackRequest) {
    return apiClient.post<ApiResponse<null>>('/admin/feedback/publish', data).then(unwrap);
  },
};
