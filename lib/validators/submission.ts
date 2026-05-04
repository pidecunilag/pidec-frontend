import { z } from 'zod';

import { WORD_LIMITS } from '@/lib/constants';

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function maxWords(limit: number) {
  return z.string().refine((val) => wordCount(val) <= limit, {
    message: `Must not exceed ${limit} words`,
  });
}

function requiredText(field: string) {
  return z.string().min(1, `${field} is required`);
}

// Stage 1: Proposal
export const stage1Schema = z.object({
  token: z.string().min(1, 'Department token is required'),
  formData: z.object({
    problem_statement: requiredText('Problem statement').pipe(
      maxWords(WORD_LIMITS.problem_statement),
    ),
    proposed_solution: requiredText('Proposed solution').pipe(
      maxWords(WORD_LIMITS.proposed_solution),
    ),
    theme_alignment: requiredText('Theme alignment').pipe(
      maxWords(WORD_LIMITS.theme_alignment),
    ),
    feasibility: requiredText('Feasibility').pipe(
      maxWords(WORD_LIMITS.feasibility),
    ),
    departmental_relevance: requiredText('Departmental relevance').pipe(
      maxWords(WORD_LIMITS.departmental_relevance),
    ),
    declarations: z.record(z.string(), z.literal(true)).refine(
      (val) => Object.keys(val).length > 0,
      { message: 'All declarations must be accepted' },
    ),
  }),
});

// Stage 2: Prototype + video
export const stage2Schema = z.object({
  videoLink: z.string().url('Enter a valid video URL'),
  formData: z.object({
    design_summary: requiredText('Design summary'),
    engineering_decisions: requiredText('Engineering decisions'),
    constraints_addressed: requiredText('Constraints addressed'),
    testing_results: requiredText('Testing results'),
  }),
  fileIds: z.array(z.string()).optional(),
});

// Stage 3: Pre-Finale documentation
export const stage3Schema = z.object({
  formData: z.object({
    final_documentation_summary: requiredText('Final documentation summary'),
    team_ready: z.literal(true, {
      message: 'You must confirm team readiness',
    }),
  }),
  fileIds: z
    .array(z.string())
    .min(1, 'At least one file must be uploaded'),
});

export type Stage1FormValues = z.infer<typeof stage1Schema>;
export type Stage2FormValues = z.infer<typeof stage2Schema>;
export type Stage3FormValues = z.infer<typeof stage3Schema>;
