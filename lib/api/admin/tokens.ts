import type { ApiResponse, GenerateTokenRequest, Token, TokenListParams } from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from '../client';

export const tokensApi = {
  listTokens(params?: TokenListParams) {
    return apiClient
      .get<ApiResponse<Token[]>>('/admin/tokens', { params })
      .then(unwrapWithMeta);
  },

  generateToken(data: GenerateTokenRequest) {
    return apiClient.post<ApiResponse<Token>>('/admin/tokens', data).then(unwrap);
  },

  regenerateToken(data: GenerateTokenRequest) {
    return apiClient.post<ApiResponse<Token>>('/admin/tokens/regenerate', data).then(unwrap);
  },
};
