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

type SubmissionFileDownload = {
  url: string;
  filename: string;
  expiresInSeconds: number;
};

export const submissionsAdminApi = {
  listSubmissions(params?: SubmissionListParams) {
    return apiClient
      .get<ApiResponse<SubmissionsEnvelope>>('/admin/submissions', { params })
      .then(unwrap)
      .then(({ submissions, pagination }) => ({ data: submissions, meta: pagination }));
  },
  getSubmissionFileDownload(submissionId: string, fileId: string) {
    return apiClient
      .get<ApiResponse<{ download: SubmissionFileDownload }>>(
        `/admin/submissions/${submissionId}/files/${encodeURIComponent(fileId)}/download`,
      )
      .then(unwrap)
      .then(({ download }) => download);
  },
};
