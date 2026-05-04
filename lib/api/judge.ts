import type {
  ApiResponse,
  Judge,
  Stage1RepresentativeRequest,
  Stage2ScoreRequest,
  Submission,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export const judgeApi = {
  getProfile() {
    return apiClient.get<ApiResponse<Judge>>('/judge/me').then(unwrap);
  },

  getSubmissions(stage?: number) {
    return apiClient
      .get<ApiResponse<Submission[]>>('/judge/submissions', {
        params: stage ? { stage } : undefined,
      })
      .then(unwrap);
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
