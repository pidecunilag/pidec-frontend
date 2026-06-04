import type {
  ApiResponse,
  Edition,
  Judge,
  JudgeScore,
  Stage1RepresentativeRequest,
  Stage1ScoreRequest,
  Stage2ScoreRequest,
  Submission,
} from '@/lib/types';

import { apiClient, unwrap } from './client';

export type JudgeProfile = {
  edition: Edition;
  judge: Judge;
};

export const judgeApi = {
  getProfile() {
    return apiClient
      .get<ApiResponse<JudgeProfile>>('/judge/me')
      .then(unwrap);
  },

  getSubmissions(stage?: number) {
    return apiClient
      .get<ApiResponse<{ submissions: Submission[] }>>('/judge/submissions', {
        params: stage ? { stage } : undefined,
      })
      .then((response) => unwrap(response).submissions);
  },

  getSubmissionFileDownload(submissionId: string, fileId: string) {
    return apiClient
      .get<ApiResponse<{ download: { url: string; filename: string; expiresInSeconds: number } }>>(
        `/judge/submissions/${submissionId}/files/${encodeURIComponent(fileId)}/download`,
      )
      .then((response) => unwrap(response).download);
  },

  pickRepresentative(data: Stage1RepresentativeRequest) {
    return apiClient
      .post<ApiResponse<null>>('/judge/stage-1/representative', data)
      .then(unwrap);
  },

  submitStage1Score(data: Stage1ScoreRequest) {
    return apiClient
      .post<ApiResponse<{ score: JudgeScore }>>('/judge/stage-1/score', {
        submissionId: data.submissionId,
        scores: {
          problem_statement_clarity: data.scores.problemStatementClarity,
          proposed_solution_quality: data.scores.proposedSolutionQuality,
          theme_alignment: data.scores.themeAlignment,
          feasibility_assessment: data.scores.feasibilityAssessment,
          departmental_relevance: data.scores.departmentalRelevance,
        },
        comments: {
          problem_statement_clarity: data.comments?.problemStatementClarity,
          proposed_solution_quality: data.comments?.proposedSolutionQuality,
          theme_alignment: data.comments?.themeAlignment,
          feasibility_assessment: data.comments?.feasibilityAssessment,
          departmental_relevance: data.comments?.departmentalRelevance,
          overall: data.comments?.overall,
        },
      })
      .then((response) => unwrap(response).score);
  },

  submitScore(submissionId: string, data: Stage2ScoreRequest) {
    return apiClient
      .post<ApiResponse<null>>(`/judge/scores/${submissionId}`, data)
      .then(unwrap);
  },

  selectDeptRepresentative(deptId: string, data: Stage1RepresentativeRequest) {
    return apiClient
      .post<ApiResponse<null>>(`/judge/selections/${deptId}`, data)
      .then(unwrap);
  },
};
