import type {
  ApiResponse,
  CreateTeamRequest,
  EligibleTeammate,
  SendInviteRequest,
  Team,
  TeamInvite,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

type RawEligibleTeammate = Omit<EligibleTeammate, 'matricNumber' | 'level'> & {
  matricNumber?: string | null;
  matric_number?: string | null;
  level?: number | string | null;
  verification_status?: string | null;
};

const normalizeEligibleTeammate = (student: RawEligibleTeammate): EligibleTeammate => ({
  ...student,
  matricNumber: student.matricNumber ?? student.matric_number ?? '',
  level: Number(student.level ?? 0),
  verificationStatus: student.verificationStatus ?? student.verification_status ?? undefined,
});

export const teamsApi = {
  getMyTeam() {
    return apiClient
      .get<ApiResponse<{ team: Team | null; members: Team['members'] }>>('/teams/me')
      .then((response) => {
        const payload = unwrap(response);
        return payload.team ? { ...payload.team, members: payload.members ?? [] } : null;
      });
  },

  createTeam(data: CreateTeamRequest) {
    return apiClient
      .post<ApiResponse<{ team: Team }>>('/teams', data)
      .then((response) => unwrap(response).team);
  },

  dissolveTeam(teamId?: string) {
    if (teamId) {
      return apiClient.delete<ApiResponse<null>>(`/teams/${teamId}`).then(unwrap);
    }
    return apiClient.delete<ApiResponse<null>>('/teams').then(unwrap);
  },

  searchTeammates(query: string) {
    return apiClient
      .get<ApiResponse<{ results: RawEligibleTeammate[] }>>('/teams/search', { params: { query } })
      .then((response) => unwrap(response).results.map(normalizeEligibleTeammate));
  },

  getInvites() {
    return apiClient
      .get<
        ApiResponse<{
          invites: Array<
            TeamInvite & {
              teams?: { name?: string | null };
              users?: { name?: string | null };
            }
          >;
        }>
      >('/teams/invites')
      .then((response) =>
        unwrap(response).invites
          .filter((invite) => invite.status === 'pending')
          .map((invite) => ({
            ...invite,
            teamName: invite.teamName ?? invite.teams?.name ?? undefined,
            inviterName: invite.inviterName ?? invite.users?.name ?? undefined,
          })),
      );
  },

  sendInvite(data: SendInviteRequest) {
    return apiClient
      .post<ApiResponse<{ invite: TeamInvite }>>('/teams/invites', data)
      .then((response) => unwrap(response).invite);
  },

  acceptInvite(inviteId: string) {
    return apiClient.post<ApiResponse<null>>(`/teams/invites/${inviteId}/accept`).then(unwrap);
  },

  declineInvite(inviteId: string) {
    return apiClient.post<ApiResponse<null>>(`/teams/invites/${inviteId}/decline`).then(unwrap);
  },

  removeMember(userId: string) {
    return apiClient.delete<ApiResponse<null>>(`/teams/members/${userId}`).then(unwrap);
  },
};
