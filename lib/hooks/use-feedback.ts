'use client';

import { useCallback, useEffect, useState } from 'react';

import { feedbackApi } from '@/lib/api/feedback';
import { extractApiError } from '@/lib/api/client';
import type { Feedback } from '@/lib/types';

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await feedbackApi.getMyFeedback();
        if (!cancelled) setFeedback(data);
      } catch {
        if (!cancelled) setFeedback([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const getSubmissionFeedback = useCallback(async (submissionId: string) => {
    try {
      return await feedbackApi.getFeedback(submissionId);
    } catch (error) {
      throw extractApiError(error);
    }
  }, []);

  return {
    feedback,
    isLoading,
    getSubmissionFeedback,
  };
}
