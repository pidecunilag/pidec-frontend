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

  public: {
    landingData: ['public', 'landing-data'] as const,
  },

  admin: {
    overview: ['admin', 'overview'] as const,
    verifications: (params?: Record<string, unknown>) =>
      ['admin', 'verifications', params] as const,
    students: (params?: Record<string, unknown>) =>
      ['admin', 'students', params] as const,
    teams: (params?: Record<string, unknown>) =>
      ['admin', 'teams', params] as const,
    tokens: (params?: Record<string, unknown>) =>
      ['admin', 'tokens', params] as const,
    judges: (params?: Record<string, unknown>) =>
      ['admin', 'judges', params] as const,
    submissions: (params?: Record<string, unknown>) =>
      ['admin', 'submissions', params] as const,
    edition: ['admin', 'edition'] as const,
    sponsors: ['admin', 'sponsors'] as const,
    partners: ['admin', 'partners'] as const,
    faqs: ['admin', 'faqs'] as const,
  },
} as const;
