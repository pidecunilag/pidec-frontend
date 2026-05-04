export type UserRole = 'student' | 'admin' | 'judge';

export type VerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'flagged'
  | 'suspended';

export type VerificationMethod = 'groq' | 'gemini' | 'manual';

export interface User {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: number;
  role: UserRole;
  verificationStatus: VerificationStatus;
  verificationMethod?: VerificationMethod;
  verificationTimestamp?: string;
  isSuspended: boolean;
  suspendedAt?: string;
  teamId?: string;
  createdAt: string;
  deletedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  level?: number;
}
