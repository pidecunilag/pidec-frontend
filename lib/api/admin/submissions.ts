import type {
  ApiResponse,
  PaginationMeta,
  Submission,
  SubmissionListParams,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

type SubmissionsEnvelope = {
  submissions: Submission[];
  pagination?: PaginationMeta;
};

export const submissionsAdminApi = {
  listSubmissions(params?: SubmissionListParams) {
    return apiClient
      .get<ApiResponse<SubmissionsEnvelope>>('/admin/submissions', { params })
      .then(unwrap)
      .then(({ submissions, pagination }) => ({ data: submissions, meta: pagination }));
  },
};
