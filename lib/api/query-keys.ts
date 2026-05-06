/**
 * Single source of truth for React Query cache keys.
 * Both devs MUST reference these — never inline literal keys.
 * Reason: invalidation correctness depends on key equality. Drift here = silent stale-cache bugs.
 */
export const qk = {
  me: ['me'] as const,

  team: {
    mine: ['team', 'mine'] as const,
    invites: ['team', 'invites'] as const,
    search: (query: string) => ['team', 'search', query] as const,
  },

  submissions: {
    mine: ['submissions', 'mine'] as const,
    feedback: (submissionId: string) =>
      ['submissions', 'feedback', submissionId] as const,
  },

  notifications: {
    list: ['notifications'] as const,
  },

  feedback: {
    mine: ['feedback', 'mine'] as const,
    bySubmission: (submissionId: string) =>
      ['feedback', 'submission', submissionId] as const,
  },

  verification: {
    status: ['verification', 'status'] as const,
  },
} as const;
