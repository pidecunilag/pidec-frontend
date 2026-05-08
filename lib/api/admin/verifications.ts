import type {
  ApiResponse,
  PaginationMeta,
  VerificationDecisionRequest,
  VerificationQueueItem,
  VerificationQueueParams,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

// Backend wraps the queue under `queue` and pagination under `pagination`.
type QueueEnvelope = {
  queue: VerificationQueueItem[];
  pagination?: PaginationMeta;
};

export const verificationsApi = {
  getFlaggedQueue(params?: VerificationQueueParams) {
    return apiClient
      .get<ApiResponse<QueueEnvelope>>('/admin/verifications/flagged', { params })
      .then(unwrap)
      .then(({ queue, pagination }) => ({ data: queue, meta: pagination }));
  },

  getVerificationQueue(params?: VerificationQueueParams) {
    return apiClient
      .get<ApiResponse<QueueEnvelope>>('/admin/verification-queue', { params })
      .then(unwrap)
      .then(({ queue, pagination }) => ({ data: queue, meta: pagination }));
  },

  applyDecision(userId: string, data: VerificationDecisionRequest) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/verifications/${userId}`, data)
      .then(unwrap);
  },
};
