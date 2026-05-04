import type {
  ApiResponse,
  SetActiveStageRequest,
  ToggleRequest,
  UpdateEditionRequest,
  Edition,
} from '@/lib/types';

import { apiClient, unwrap } from '../client';

export const settingsApi = {
  updateEdition(data: UpdateEditionRequest) {
    return apiClient
      .patch<ApiResponse<Edition>>('/admin/settings/edition', data)
      .then(unwrap);
  },

  setActiveStage(data: SetActiveStageRequest) {
    return apiClient.post<ApiResponse<null>>('/admin/stage', data).then(unwrap);
  },

  toggleSignup(data: ToggleRequest) {
    return apiClient.post<ApiResponse<null>>('/admin/signup', data).then(unwrap);
  },

  toggleSubmissionWindow(data: ToggleRequest) {
    return apiClient.post<ApiResponse<null>>('/admin/submission-window', data).then(unwrap);
  },

  toggleTeamLock(data: ToggleRequest) {
    return apiClient.post<ApiResponse<null>>('/admin/team-lock', data).then(unwrap);
  },
};
