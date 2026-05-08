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

// Compact joins: admin list endpoints embed a stripped-down team and submitter alongside
// each submission. Both are optional because student-facing endpoints don't include them.
export interface SubmissionTeamPreview {
  id: string;
  name: string;
  status: string;
  department: string;
}

export interface SubmissionUserPreview {
  id: string;
  name: string;
  email: string;
}

// Discriminated union — switch on `stage` to narrow `formData` exhaustively.
interface SubmissionBase {
  id: string;
  teamId: string;
  editionId: string;
  files: SubmissionFile[];
  videoLink?: string | null;
  submittedAt: string;
  submittedBy?: string;
  status: SubmissionStatus;
  isLocked: boolean;
  tokenId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  // Joined records on admin list responses.
  teams?: SubmissionTeamPreview;
  users?: SubmissionUserPreview;
}

export interface Stage1Submission extends SubmissionBase {
  stage: 1;
  formData: Stage1FormData;
}

export interface Stage2Submission extends SubmissionBase {
  stage: 2;
  formData: Stage2FormData;
}

export interface Stage3Submission extends SubmissionBase {
  stage: 3;
  formData: Stage3FormData;
}

export type Submission = Stage1Submission | Stage2Submission | Stage3Submission;
