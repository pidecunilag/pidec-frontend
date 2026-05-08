import type {
  ApiResponse,
  PaginationMeta,
  StudentListParams,
  SuspendUserRequest,
  User,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

type StudentsEnvelope = {
  students: User[];
  pagination?: PaginationMeta;
};

export const studentsApi = {
  listStudents(params?: StudentListParams) {
    return apiClient
      .get<ApiResponse<StudentsEnvelope>>('/admin/students', { params })
      .then(unwrap)
      .then(({ students, pagination }) => ({ data: students, meta: pagination }));
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
