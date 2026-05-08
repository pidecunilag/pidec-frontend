export type TeamStatus = 'active' | 'disqualified' | 'under_review';

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: number;
  role: 'leader' | 'member';
  verificationStatus: string;
}

// Compact join: list endpoints embed a stripped-down leader record alongside the team.
export interface TeamLeaderPreview {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leaderId: string;
  editionId: string;
  currentStage: number;
  status: TeamStatus;
  disqualifiedAtStage?: number | null;
  disqualifiedAt?: string | null;
  disqualifiedReason?: string | null;
  isStage2Representative?: boolean;
  // Optional: list endpoints return `leader` (compact) + `memberCount`; detail endpoints
  // return `members` (full TeamMember[]). Treat both as optional and read what's there.
  leader?: TeamLeaderPreview;
  memberCount?: number;
  members?: TeamMember[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName?: string;
  inviteeId: string;
  inviteeName?: string;
  invitedBy: string;
  inviterName?: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
}

export interface CreateTeamRequest {
  name: string;
}

export interface SendInviteRequest {
  inviteeId: string;
}

export interface RespondInviteRequest {
  inviteId: string;
  status: 'accepted' | 'declined';
}

export interface RemoveMemberRequest {
  userId: string;
}

export interface EligibleTeammate {
  id: string;
  name: string;
  matricNumber: string;
  level: number;
}
