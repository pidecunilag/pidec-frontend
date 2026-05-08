import type {
  ApiResponse,
  PaginationMeta,
  StudentListParams,
  SuspendUserRequest,
  User,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

// Backend wraps the student list under `users` (admin-perspective: User records),
// not the resource-named `students`.
type StudentsEnvelope = {
  users: User[];
  pagination?: PaginationMeta;
};

export const studentsApi = {
  listStudents(params?: StudentListParams) {
    return apiClient
      .get<ApiResponse<StudentsEnvelope>>('/admin/students', { params })
      .then(unwrap)
      .then(({ users, pagination }) => ({ data: users, meta: pagination }));
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
