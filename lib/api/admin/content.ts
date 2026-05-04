import type {
  ApiResponse,
  LandingAsset,
  LandingAssetRequest,
  LandingFaq,
  LandingFaqRequest,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

// Sponsors
export const sponsorsApi = {
  list() {
    return apiClient.get<ApiResponse<LandingAsset[]>>('/admin/content/sponsors').then(unwrap);
  },

  create(data: LandingAssetRequest) {
    return apiClient.post<ApiResponse<LandingAsset>>('/admin/content/sponsors', data).then(unwrap);
  },

  update(sponsorId: string, data: LandingAssetRequest) {
    return apiClient
      .patch<ApiResponse<LandingAsset>>(`/admin/content/sponsors/${sponsorId}`, data)
      .then(unwrap);
  },

  remove(sponsorId: string) {
    return apiClient.delete<ApiResponse<null>>(`/admin/content/sponsors/${sponsorId}`).then(unwrap);
  },
};

// Partners
export const partnersApi = {
  list() {
    return apiClient.get<ApiResponse<LandingAsset[]>>('/admin/content/partners').then(unwrap);
  },

  create(data: LandingAssetRequest) {
    return apiClient.post<ApiResponse<LandingAsset>>('/admin/content/partners', data).then(unwrap);
  },

  update(partnerId: string, data: LandingAssetRequest) {
    return apiClient
      .patch<ApiResponse<LandingAsset>>(`/admin/content/partners/${partnerId}`, data)
      .then(unwrap);
  },

  remove(partnerId: string) {
    return apiClient.delete<ApiResponse<null>>(`/admin/content/partners/${partnerId}`).then(unwrap);
  },
};

// FAQs
export const faqsApi = {
  list() {
    return apiClient.get<ApiResponse<LandingFaq[]>>('/admin/content/faqs').then(unwrap);
  },

  create(data: LandingFaqRequest) {
    return apiClient.post<ApiResponse<LandingFaq>>('/admin/content/faqs', data).then(unwrap);
  },

  update(faqId: string, data: LandingFaqRequest) {
    return apiClient
      .patch<ApiResponse<LandingFaq>>(`/admin/content/faqs/${faqId}`, data)
      .then(unwrap);
  },

  remove(faqId: string) {
    return apiClient.delete<ApiResponse<null>>(`/admin/content/faqs/${faqId}`).then(unwrap);
  },
};
