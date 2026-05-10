import type {
  ApiResponse,
  Feedback,
  Stage1SubmissionRequest,
  Stage2SubmissionRequest,
  Stage3SubmissionRequest,
  Submission,
  UploadedSubmissionFile,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export const submissionsApi = {
  getMySubmissions() {
    return apiClient
      .get<ApiResponse<{ submissions: Submission[] }>>('/submissions/me')
      .then((response) => unwrap(response).submissions);
  },

  uploadFile(file: File, stage: 1 | 2 | 3) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('stage', String(stage));

    return apiClient
      .post<ApiResponse<{ file: UploadedSubmissionFile }>>('/submissions/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => unwrap(response).file);
  },

  submitStage1(data: Stage1SubmissionRequest) {
    return apiClient
      .post<ApiResponse<{ submission: Submission; duplicated: boolean }>>('/submissions/stage-1', data)
      .then((response) => unwrap(response).submission);
  },

  submitStage2(data: Stage2SubmissionRequest) {
    return apiClient
      .post<ApiResponse<{ submission: Submission; duplicated: boolean }>>('/submissions/stage-2', data)
      .then((response) => unwrap(response).submission);
  },

  submitStage3(data: Stage3SubmissionRequest) {
    return apiClient
      .post<ApiResponse<{ submission: Submission; duplicated: boolean }>>('/submissions/stage-3', data)
      .then((response) => unwrap(response).submission);
  },

  getSubmissionFeedback(submissionId: string) {
    return apiClient
      .get<ApiResponse<{ feedback: Feedback | null }>>(`/submissions/${submissionId}/feedback`)
      .then((response) => unwrap(response).feedback);
  },
};
