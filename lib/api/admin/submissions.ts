import type { ApiResponse, Submission, SubmissionListParams } from '@/lib/types';

import { apiClient, unwrapWithMeta } from '../client';

export const submissionsAdminApi = {
  listSubmissions(params?: SubmissionListParams) {
    return apiClient
      .get<ApiResponse<Submission[]>>('/admin/submissions', { params })
      .then(unwrapWithMeta);
  },
};
