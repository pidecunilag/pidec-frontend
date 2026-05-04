import type { ApiResponse, Team, TeamActionRequest, TeamListParams } from '@/lib/types';

import { apiClient, unwrap, unwrapWithMeta } from '../client';

export const teamsAdminApi = {
  listTeams(params?: TeamListParams) {
    return apiClient
      .get<ApiResponse<Team[]>>('/admin/teams', { params })
      .then(unwrapWithMeta);
  },

  applyTeamAction(teamId: string, data: TeamActionRequest) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/teams/${teamId}/stage`, data)
      .then(unwrap);
  },
};
