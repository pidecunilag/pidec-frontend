import type {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export const authApi = {
  register(data: RegisterRequest) {
    return apiClient.post<ApiResponse<User>>('/auth/register', data).then(unwrap);
  },

  login(data: LoginRequest) {
    return apiClient.post<ApiResponse<User>>('/auth/login', data).then(unwrap);
  },

  logout() {
    return apiClient.post<ApiResponse<null>>('/auth/logout').then(unwrap);
  },

  refresh() {
    return apiClient.post<ApiResponse<null>>('/auth/refresh').then(unwrap);
  },

  getMe() {
    return apiClient.get<ApiResponse<User>>('/auth/me').then(unwrap);
  },

  verifyEmail(data: VerifyEmailRequest) {
    return apiClient.post<ApiResponse<null>>('/auth/verify-email', data).then(unwrap);
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return apiClient.post<ApiResponse<null>>('/auth/forgot-password', data).then(unwrap);
  },

  resetPassword(data: ResetPasswordRequest) {
    return apiClient.post<ApiResponse<null>>('/auth/reset-password', data).then(unwrap);
  },

  uploadVerificationDoc(file: File, unauthData?: { email: string; matricNumber: string }) {
    const formData = new FormData();
    formData.append('document', file);
    if (unauthData) {
      formData.append('email', unauthData.email);
      formData.append('matricNumber', unauthData.matricNumber);
    }

    return apiClient
      .post<ApiResponse<null>>('/auth/verification-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap);
  },

  reuploadVerificationDoc(file: File) {
    const formData = new FormData();
    formData.append('document', file);

    return apiClient
      .post<ApiResponse<null>>('/auth/reupload-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap);
  },

  getVerificationStatus() {
    return apiClient
      .get<ApiResponse<{ status: string; attemptCount?: number; cooldownEndsAt?: string }>>('/auth/verification-status')
      .then(unwrap);
  },
};
