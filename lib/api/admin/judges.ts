import type { ApiResponse, CreateJudgeRequest, Judge, JudgeListParams } from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from '../client';

export const judgesAdminApi = {
  listJudges(params?: JudgeListParams) {
    return apiClient
      .get<ApiResponse<Judge[]>>('/admin/judges', { params })
      .then(unwrapWithMeta);
  },

  createJudge(data: CreateJudgeRequest) {
    return apiClient.post<ApiResponse<Judge>>('/admin/judges', data).then(unwrap);
  },

  deactivateJudge(judgeId: string) {
    return apiClient
      .post<ApiResponse<null>>(`/admin/judges/${judgeId}/deactivate`)
      .then(unwrap);
  },
};
