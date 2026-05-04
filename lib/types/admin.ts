// Admin overview metrics (shape may be refined once we hit the live API)
export interface AdminOverview {
  totalStudents: number;
  verifiedStudents: number;
  pendingVerifications: number;
  flaggedVerifications: number;
  totalTeams: number;
  activeTeams: number;
  disqualifiedTeams: number;
  totalSubmissions: number;
  activeJudges: number;
}

// Verification queue
export interface VerificationQueueItem {
  userId: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: number;
  verificationStatus: string;
  aiExtractedName?: string;
  aiExtractedMatric?: string;
  aiExtractedDepartment?: string;
  confidenceScore?: number;
  verificationMethod?: string;
  submittedAt: string;
  attemptCount: number;
}

export type VerificationDecision = 'approve' | 'reject' | 'request_resubmission';

export type VerificationDecisionRequest =
  | { decision: 'approve'; note?: string }
  | { decision: 'reject'; reason: string }
  | { decision: 'request_resubmission'; note?: string };

// User suspension
export interface SuspendUserRequest {
  reason: string;
}

// Team actions
export type TeamAction = 'advance' | 'disqualify' | 'unlock_submission';

export type TeamActionRequest =
  | { action: 'advance' }
  | { action: 'disqualify'; reason: string; atStage: 1 | 2 | 3 }
  | { action: 'unlock_submission' };

// Submission tokens
export interface Token {
  id: string;
  department: string;
  tokenString: string;
  editionId: string;
  expiresAt?: string;
  useCount: number;
  lastUsedAt?: string;
  deletedAt?: string;
}

export interface GenerateTokenRequest {
  department: string;
  expiresAt?: string;
}

// Checkpoints
export interface Checkpoint {
  id: string;
  title: string;
  description?: string | null;
  dueAt?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface CreateCheckpointRequest {
  title: string;
  description?: string | null;
  dueAt?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCheckpointRequest {
  title?: string;
  description?: string | null;
  dueAt?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

// Landing page content
export interface LandingAsset {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface LandingAssetRequest {
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface LandingFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LandingFaqRequest {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Admin audit log (read-only, append-only per PRD)
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeValue?: Record<string, unknown>;
  afterValue?: Record<string, unknown>;
  timestamp: string;
}

// Admin list filters
export interface StudentListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  q?: string;
  department?: string;
  verificationStatus?: string;
  hasTeam?: boolean;
  isSuspended?: boolean;
}

export interface TeamListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  q?: string;
  department?: string;
  status?: 'active' | 'disqualified' | 'under_review';
  currentStage?: number;
}

export interface SubmissionListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  q?: string;
  department?: string;
  stage?: number;
  teamId?: string;
  status?: 'submitted' | 'under_review' | 'feedback_published';
}

export interface JudgeListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  stageScope?: 'stage_1' | 'stage_2';
  isActive?: boolean;
}

export interface TokenListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  department?: string;
  includeRetired?: boolean;
}

export interface UserListParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  q?: string;
  department?: string;
  role?: 'student' | 'admin' | 'judge';
  verificationStatus?: string;
  hasTeam?: boolean;
  isSuspended?: boolean;
}

export interface VerificationQueueParams {
  cursor?: string;
  limit?: number;
  offset?: number;
  q?: string;
  department?: string;
  status?: 'pending' | 'flagged';
}
