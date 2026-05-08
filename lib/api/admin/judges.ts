import type {
  ApiResponse,
  CreateJudgeRequest,
  Judge,
  JudgeListParams,
  PaginationMeta,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

type JudgesEnvelope = {
  judges: Judge[];
  pagination?: PaginationMeta;
};

export const judgesAdminApi = {
  listJudges(params?: JudgeListParams) {
    return apiClient
      .get<ApiResponse<JudgesEnvelope>>('/admin/judges', { params })
      .then(unwrap)
      .then(({ judges, pagination }) => ({ data: judges, meta: pagination }));
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
