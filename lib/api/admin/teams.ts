import type {
  ApiResponse,
  PaginationMeta,
  Team,
  TeamActionRequest,
  TeamListParams,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

type TeamsEnvelope = {
  teams: Team[];
  pagination?: PaginationMeta;
};

export const teamsAdminApi = {
  listTeams(params?: TeamListParams) {
    return apiClient
      .get<ApiResponse<TeamsEnvelope>>('/admin/teams', { params })
      .then(unwrap)
      .then(({ teams, pagination }) => ({ data: teams, meta: pagination }));
  },

  applyTeamAction(teamId: string, data: TeamActionRequest) {
    return apiClient
      .patch<ApiResponse<null>>(`/admin/teams/${teamId}/stage`, data)
      .then(unwrap);
  },
};
