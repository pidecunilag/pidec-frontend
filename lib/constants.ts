import type { ActiveStage } from '@/lib/types';

export const DEPARTMENTS = [
  'Chemical Engineering',
  'Civil and Environmental Engineering',
  'Computer Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Metallurgical and Materials Engineering',
  'Petroleum and Gas Engineering',
  'Surveying and Geoinformatics',
  'Systems Engineering',
  'Biomedical Engineering',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const LEVELS = [100, 200, 300, 400, 500] as const;

export type Level = (typeof LEVELS)[number];

export const STAGE_LABELS: Record<ActiveStage, string> = {
  0: 'Pre-Competition',
  1: 'Stage 1: Proposals',
  2: 'Stage 2: Prototypes',
  3: 'Grand Finale',
};

export const VERIFICATION_STATUSES = [
  'pending',
  'verified',
  'rejected',
  'flagged',
  'suspended',
] as const;

export const TEAM_STATUSES = [
  'active',
  'disqualified',
  'under_review',
] as const;

export const SUBMISSION_STATUSES = [
  'not_submitted',
  'submitted',
  'under_review',
  'feedback_available',
] as const;

// Stage 1 word limits per PRD Section 6.2
export const WORD_LIMITS = {
  problem_statement: 300,
  proposed_solution: 500,
  theme_alignment: 250,
  feasibility: 400,
  departmental_relevance: 150,
} as const;

export const INVITE_EXPIRY_HOURS = 48;

export const AUTOSAVE_INTERVAL_MS = 30_000;

export const NOTIFICATION_POLL_INTERVAL_MS = 60_000;

export const MAX_VERIFICATION_ATTEMPTS = 3;

export const VERIFICATION_COOLDOWN_MINUTES = 10;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
