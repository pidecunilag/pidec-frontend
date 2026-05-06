'use client';

import { useQuery } from '@tanstack/react-query';

import { feedbackApi } from '@/lib/api/feedback';
import { qk } from '@/lib/api/query-keys';

export function useFeedback() {
  const query = useQuery({
    queryKey: qk.feedback.mine,
    queryFn: feedbackApi.getMyFeedback,
  });

  return {
    feedback: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useSubmissionFeedback(submissionId: string | undefined) {
  const query = useQuery({
    queryKey: submissionId
      ? qk.feedback.bySubmission(submissionId)
      : ['feedback', 'submission', 'noop'],
    queryFn: () => feedbackApi.getFeedback(submissionId!),
    enabled: !!submissionId,
  });

  return {
    feedback: query.data,
    isLoading: query.isPending && !!submissionId,
    error: query.error,
  };
}
