import type {
  ApiResponse,
  FinaleRegistration,
  FinaleRegistrationsParams,
  FinaleRegistrationsResponse,
} from '@/lib/types';
import { apiClient, unwrap } from '../client';

export const finaleAdminApi = {
  list(params?: FinaleRegistrationsParams) {
    return apiClient
      .get<ApiResponse<FinaleRegistrationsResponse>>('/admin/finale/registrations', { params })
      .then(unwrap);
  },
  setAdmission(registrationId: string, admitted: boolean) {
    return apiClient
      .patch<ApiResponse<FinaleRegistration>>(
        `/admin/finale/registrations/${registrationId}/admission`,
        { admitted },
      )
      .then(unwrap);
  },
  export() {
    return apiClient
      .get('/admin/finale/registrations/export', { responseType: 'blob' })
      .then((response) => response.data as Blob);
  },
};
