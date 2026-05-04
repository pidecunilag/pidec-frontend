export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  matricNumber: string;
  department: string;
  level: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
