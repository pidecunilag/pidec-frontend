import type { ApiResponse, StudentListParams, SuspendUserRequest, User } from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from '../client';

export const studentsApi = {
  listStudents(params?: StudentListParams) {
    return apiClient
      .get<ApiResponse<User[]>>('/admin/students', { params })
      .then(unwrapWithMeta);
  },

  suspendStudent(userId: string, data: SuspendUserRequest) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/students/${userId}/suspend`, data)
      .then(unwrap);
  },

  unsuspendStudent(userId: string) {
    return apiClient
      .post<ApiResponse<null>>(`/admin/users/${userId}/unsuspend`)
      .then(unwrap);
  },
};
