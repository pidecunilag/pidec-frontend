import type {
  ApiResponse,
  CreateTeamRequest,
  EligibleTeammate,
  SendInviteRequest,
  Team,
  TeamInvite,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export const teamsApi = {
  getMyTeam() {
    return apiClient.get<ApiResponse<Team>>('/teams/me').then(unwrap);
  },

  createTeam(data: CreateTeamRequest) {
    return apiClient.post<ApiResponse<Team>>('/teams', data).then(unwrap);
  },

  dissolveTeam(teamId?: string) {
    if (teamId) {
      return apiClient.delete<ApiResponse<null>>(`/teams/${teamId}`).then(unwrap);
    }
    return apiClient.delete<ApiResponse<null>>('/teams').then(unwrap);
  },

  searchTeammates(query: string) {
    return apiClient
      .get<ApiResponse<EligibleTeammate[]>>('/teams/search', { params: { query } })
      .then(unwrap);
  },

  getInvites() {
    return apiClient.get<ApiResponse<TeamInvite[]>>('/teams/invites').then(unwrap);
  },

  sendInvite(data: SendInviteRequest) {
    return apiClient.post<ApiResponse<TeamInvite>>('/teams/invites', data).then(unwrap);
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
