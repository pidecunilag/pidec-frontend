import type { ApiResponse, UpdateProfileRequest, User } from '@/lib/types';

import { apiClient, unwrap } from './client';

export const usersApi = {
  getProfile() {
    return apiClient.get<ApiResponse<User>>('/users/me').then(unwrap);
  },

  updateProfile(data: UpdateProfileRequest) {
    return apiClient.patch<ApiResponse<User>>('/users/me', data).then(unwrap);
  },
};
