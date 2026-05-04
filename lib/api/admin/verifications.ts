import type {
  ApiResponse,
  VerificationDecisionRequest,
  VerificationQueueItem,
  VerificationQueueParams,
} from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from '../client';

export const verificationsApi = {
  getFlaggedQueue(params?: VerificationQueueParams) {
    return apiClient
      .get<ApiResponse<VerificationQueueItem[]>>('/admin/verifications/flagged', { params })
      .then(unwrapWithMeta);
  },

  getVerificationQueue(params?: VerificationQueueParams) {
    return apiClient
      .get<ApiResponse<VerificationQueueItem[]>>('/admin/verification-queue', { params })
      .then(unwrapWithMeta);
  },

  applyDecision(userId: string, data: VerificationDecisionRequest) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/verifications/${userId}`, data)
      .then(unwrap);
  },
};
