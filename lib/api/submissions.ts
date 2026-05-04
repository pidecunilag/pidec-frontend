import type {
  ApiResponse,
  Feedback,
  Stage1SubmissionRequest,
  Stage2SubmissionRequest,
  Stage3SubmissionRequest,
  Submission,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export const submissionsApi = {
  getMySubmissions() {
    return apiClient.get<ApiResponse<Submission[]>>('/submissions/me').then(unwrap);
  },

  submitStage1(data: Stage1SubmissionRequest) {
    return apiClient.post<ApiResponse<Submission>>('/submissions/stage-1', data).then(unwrap);
  },

  submitStage2(data: Stage2SubmissionRequest) {
    return apiClient.post<ApiResponse<Submission>>('/submissions/stage-2', data).then(unwrap);
  },

  submitStage3(data: Stage3SubmissionRequest) {
    return apiClient.post<ApiResponse<Submission>>('/submissions/stage-3', data).then(unwrap);
  },

  getSubmissionFeedback(submissionId: string) {
    return apiClient
      .get<ApiResponse<Feedback>>(`/submissions/${submissionId}/feedback`)
      .then(unwrap);
  },
};
