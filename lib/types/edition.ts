export type ActiveStage = 0 | 1 | 2 | 3;

export interface Edition {
  id: string;
  name: string;
  theme: string;
  activeStage: ActiveStage;
  signupOpen: boolean;
  teamManagementLocked: boolean;
  submissionWindowOpen: boolean;
  announcementBanner?: string | null;
  createdAt: string;
  deletedAt?: string;
}

export interface UpdateEditionRequest {
  name?: string;
  theme?: string;
  announcementBanner?: string | null;
}

export interface SetActiveStageRequest {
  stage: ActiveStage;
}

export interface ToggleRequest {
  open: boolean;
}
