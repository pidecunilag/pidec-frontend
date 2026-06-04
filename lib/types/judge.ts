export type StageScope = 'stage_1' | 'stage_2';

export interface Judge {
  id: string;
  name: string;
  email: string;
  stageScope: StageScope;
  assignedDepartments: string[];
  editionId: string;
  isActive: boolean;
  createdAt: string;
  deactivatedAt?: string;
}

export interface CreateJudgeRequest {
  name: string;
  email: string;
  stageScope: StageScope;
  assignedDepartments: string[];
}

export interface Stage1RepresentativeRequest {
  submissionId: string;
  comments?: string;
}

export interface Stage1ScoreRequest {
  submissionId: string;
  scores: {
    problemStatementClarity: number;
    proposedSolutionQuality: number;
    themeAlignment: number;
    feasibilityAssessment: number;
    departmentalRelevance: number;
  };
  comments?: Partial<
    Record<
      | 'problemStatementClarity'
      | 'proposedSolutionQuality'
      | 'themeAlignment'
      | 'feasibilityAssessment'
      | 'departmentalRelevance'
      | 'overall',
      string
    >
  >;
}

export interface Stage2ScoreRequest {
  scores: Record<string, number>;
  comments: Record<string, string>;
}

export interface JudgeScore {
  id: string;
  submissionId: string;
  judgeId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number | null;
  isRepresentativePick: boolean;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
