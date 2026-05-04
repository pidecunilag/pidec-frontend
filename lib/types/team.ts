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

export interface Team {
  id: string;
  name: string;
  department: string;
  leaderId: string;
  editionId: string;
  currentStage: number;
  status: TeamStatus;
  disqualifiedAtStage?: number;
  disqualifiedAt?: string;
  members: TeamMember[];
  createdAt: string;
  deletedAt?: string;
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
