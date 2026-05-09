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
import { clearTokens, getRefreshToken, setTokens } from '@/lib/auth/token-storage';

// Login/register return user + token pair. /auth/me only returns user.
type UserEnvelope = { user: User };
type AuthEnvelope = UserEnvelope & {
  accessToken: string;
  refreshToken: string;
};
type RefreshEnvelope = {
  accessToken: string;
  refreshToken: string;
};
type VerificationStatusEnvelope = {
  verification: {
    status: string;
    attempts?: number;
    attemptsRemaining?: number;
    cooldownEndsAt?: string;
    cooldownRemainingMs?: number;
    lastAttemptAt?: string;
    method?: string;
    timestamp?: string;
  };
};

function mapVerificationStatusResponse(
  payload:
    | VerificationStatusEnvelope
    | {
        status: string;
        attempts?: number;
        attemptsRemaining?: number;
        cooldownEndsAt?: string;
        cooldownRemainingMs?: number;
        lastAttemptAt?: string;
        method?: string;
        timestamp?: string;
      },
) {
  const verification =
    'verification' in payload
      ? payload.verification
      : payload;

  return {
    status: verification.status,
    attempts: verification.attempts,
    attemptsRemaining: verification.attemptsRemaining,
    cooldownEndsAt: verification.cooldownEndsAt,
    cooldownRemainingMs: verification.cooldownRemainingMs,
    lastAttemptAt: verification.lastAttemptAt,
    method: verification.method,
    timestamp: verification.timestamp,
  };
}

export const authApi = {
  register(data: RegisterRequest) {
    return apiClient
      .post<ApiResponse<AuthEnvelope>>('/auth/register', data)
      .then(unwrap)
      .then((d) => {
        setTokens(d.accessToken, d.refreshToken);
        return d.user;
      });
  },

  login(data: LoginRequest) {
    return apiClient
      .post<ApiResponse<AuthEnvelope>>('/auth/login', data)
      .then(unwrap)
      .then((d) => {
        setTokens(d.accessToken, d.refreshToken);
        return d.user;
      });
  },

  logout() {
    // Clear tokens regardless of server outcome — the user wanted out.
    return apiClient
      .post<ApiResponse<null>>('/auth/logout')
      .then(unwrap)
      .finally(() => clearTokens());
  },

  refresh() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token in storage'));
    }
    return apiClient
      .post<ApiResponse<RefreshEnvelope>>('/auth/refresh', { refreshToken })
      .then(unwrap)
      .then((d) => {
        setTokens(d.accessToken, d.refreshToken);
        return d;
      });
  },

  getMe() {
    return apiClient
      .get<ApiResponse<UserEnvelope>>('/auth/me')
      .then(unwrap)
      .then((d) => d.user);
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
      .get<ApiResponse<VerificationStatusEnvelope>>('/auth/verification-status')
      .then(unwrap)
      .then(mapVerificationStatusResponse);
  },
};
