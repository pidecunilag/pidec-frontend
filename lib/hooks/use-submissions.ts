'use client';

import { useCallback, useEffect } from 'react';

import { submissionsApi } from '@/lib/api/submissions';
import { extractApiError } from '@/lib/api/client';
import { useSubmissionStore } from '@/lib/stores/submission-store';
import type {
  Stage1SubmissionRequest,
  Stage2SubmissionRequest,
  Stage3SubmissionRequest,
} from '@/lib/types';

export function useSubmissions() {
  const { submissions, activeSubmission, isLoading, setSubmissions, addSubmission, setLoading } =
    useSubmissionStore();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await submissionsApi.getMySubmissions();
        if (!cancelled) setSubmissions(data);
      } catch {
        if (!cancelled) setSubmissions([]);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [setSubmissions, setLoading]);

  const submitStage1 = useCallback(
    async (data: Stage1SubmissionRequest) => {
      try {
        const submission = await submissionsApi.submitStage1(data);
        addSubmission(submission);
        return submission;
      } catch (error) {
        throw extractApiError(error);
      }
    },
    [addSubmission],
  );

  const submitStage2 = useCallback(
    async (data: Stage2SubmissionRequest) => {
      try {
        const submission = await submissionsApi.submitStage2(data);
        addSubmission(submission);
        return submission;
      } catch (error) {
        throw extractApiError(error);
      }
    },
    [addSubmission],
  );

  const submitStage3 = useCallback(
    async (data: Stage3SubmissionRequest) => {
      try {
        const submission = await submissionsApi.submitStage3(data);
        addSubmission(submission);
        return submission;
      } catch (error) {
        throw extractApiError(error);
      }
    },
    [addSubmission],
  );

  const getFeedback = useCallback(async (submissionId: string) => {
    try {
      return await submissionsApi.getSubmissionFeedback(submissionId);
    } catch (error) {
      throw extractApiError(error);
    }
  }, []);

  return {
    submissions,
    activeSubmission,
    isLoading,
    submitStage1,
    submitStage2,
    submitStage3,
    getFeedback,
  };
}
