import type {
  ApiResponse,
  Edition,
  Judge,
  Stage1RepresentativeRequest,
  Stage2ScoreRequest,
  Submission,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export type JudgeProfile = {
  edition: Edition;
  judge: Judge;
};

export const judgeApi = {
  getProfile() {
    return apiClient
      .get<ApiResponse<JudgeProfile>>('/judge/me')
      .then(unwrap);
  },

  getSubmissions(stage?: number) {
    return apiClient
      .get<ApiResponse<{ submissions: Submission[] }>>('/judge/submissions', {
        params: stage ? { stage } : undefined,
      })
      .then((response) => unwrap(response).submissions);
  },

  getSubmissionFileDownload(submissionId: string, fileId: string) {
    return apiClient
      .get<ApiResponse<{ download: { url: string; filename: string; expiresInSeconds: number } }>>(
        `/judge/submissions/${submissionId}/files/${encodeURIComponent(fileId)}/download`,
      )
      .then((response) => unwrap(response).download);
  },

  pickRepresentative(data: Stage1RepresentativeRequest) {
    return apiClient
      .post<ApiResponse<null>>('/judge/stage-1/representative', data)
      .then(unwrap);
  },

  submitScore(submissionId: string, data: Stage2ScoreRequest) {
    return apiClient
      .post<ApiResponse<null>>(`/judge/scores/${submissionId}`, data)
      .then(unwrap);
  },

  selectDeptRepresentative(deptId: string, data: Stage1RepresentativeRequest) {
    return apiClient
      .post<ApiResponse<null>>(`/judge/selections/${deptId}`, data)
      .then(unwrap);
  },
};
