import type {
  ApiResponse,
  Edition,
  FinaleRegistrationConfirmation,
  FinaleRegistrationRequest,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export interface LandingData {
  edition: Edition;
  announcementBanner?: string | null;
}

export const publicApi = {
  getLandingData() {
    return apiClient
      .get<ApiResponse<LandingData>>('/public/landing-data')
      .then(unwrap);
  },
  registerForFinale(data: FinaleRegistrationRequest) {
    return apiClient
      .post<ApiResponse<FinaleRegistrationConfirmation>>('/public/finale/registrations', data)
      .then(unwrap);
  },
};
