export type SubmissionStatus =
  | 'not_submitted'
  | 'submitted'
  | 'under_review'
  | 'feedback_available';

export type Stage = 1 | 2 | 3;

export interface SubmissionFile {
  url: string;
  filename: string;
  sizeBytes: number;
  mimetype: string;
  uploadedAt: string;
}

export interface Submission {
  id: string;
  teamId: string;
  editionId: string;
  stage: Stage;
  formData: Record<string, unknown>;
  files: SubmissionFile[];
  videoLink?: string;
  submittedAt: string;
  submittedBy?: string;
  status: SubmissionStatus;
  isLocked: boolean;
  deletedAt?: string;
}

// Stage 1: Proposal submission
export interface Stage1FormData {
  problem_statement: string;
  proposed_solution: string;
  theme_alignment: string;
  feasibility: string;
  departmental_relevance: string;
  declarations: Record<string, true>;
}

export interface Stage1SubmissionRequest {
  token: string;
  formData: Stage1FormData;
}

// Stage 2: Prototype + video
export interface Stage2FormData {
  design_summary: string;
  engineering_decisions: string;
  constraints_addressed: string;
  testing_results: string;
}

export interface Stage2SubmissionRequest {
  videoLink: string;
  formData: Stage2FormData;
  fileIds?: string[];
}

// Stage 3: Pre-Finale documentation
export interface Stage3FormData {
  final_documentation_summary: string;
  team_ready: true;
}

export interface Stage3SubmissionRequest {
  formData: Stage3FormData;
  fileIds: string[];
}
