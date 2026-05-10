import { z } from 'zod';

function requiredText(field: string) {
  return z.string().min(1, `${field} is required`);
}

// Stage 1: Proposal document
export const stage1Schema = z.object({
  token: z.string().min(1, 'Department token is required'),
  formData: z.object({
    submission_type: z.literal('document_upload'),
  }),
  fileIds: z.array(z.string()).min(1, 'Upload your Stage 1 proposal document').max(1),
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
