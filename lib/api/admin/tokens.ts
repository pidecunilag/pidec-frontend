import type {
  ApiResponse,
  GenerateTokenRequest,
  PaginationMeta,
  Token,
  TokenListParams,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

type TokensEnvelope = {
  tokens: Token[];
  pagination?: PaginationMeta;
};

export const tokensApi = {
  listTokens(params?: TokenListParams) {
    return apiClient
      .get<ApiResponse<TokensEnvelope>>('/admin/tokens', { params })
      .then(unwrap)
      .then(({ tokens, pagination }) => ({ data: tokens, meta: pagination }));
  },

  generateToken(data: GenerateTokenRequest) {
    return apiClient.post<ApiResponse<Token>>('/admin/tokens', data).then(unwrap);
  },

  regenerateToken(data: GenerateTokenRequest) {
    return apiClient.post<ApiResponse<Token>>('/admin/tokens/regenerate', data).then(unwrap);
  },
};
