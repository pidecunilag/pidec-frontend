import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      'Team name can only contain letters, numbers, and spaces',
    )
    .trim(),
});

export const inviteSchema = z.object({
  inviteeId: z.string().uuid('Invalid user ID'),
});

export type CreateTeamFormValues = z.infer<typeof createTeamSchema>;
