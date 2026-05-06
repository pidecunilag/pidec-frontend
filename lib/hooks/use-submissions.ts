'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { submissionsApi } from '@/lib/api/submissions';
import { qk } from '@/lib/api/query-keys';
import type {
  Stage1SubmissionRequest,
  Stage2SubmissionRequest,
  Stage3SubmissionRequest,
} from '@/lib/types';

export function useSubmissions() {
  const qc = useQueryClient();

  const submissionsQuery = useQuery({
    queryKey: qk.submissions.mine,
    queryFn: submissionsApi.getMySubmissions,
  });

  // Stage submissions also alter team status (current_stage / submission status badge),
  // so both caches must invalidate on success.
  const invalidateAfterSubmit = () => {
    qc.invalidateQueries({ queryKey: qk.submissions.mine });
    qc.invalidateQueries({ queryKey: qk.team.mine });
  };

  const stage1Mutation = useMutation({
    mutationFn: (data: Stage1SubmissionRequest) => submissionsApi.submitStage1(data),
    onSuccess: invalidateAfterSubmit,
  });

  const stage2Mutation = useMutation({
    mutationFn: (data: Stage2SubmissionRequest) => submissionsApi.submitStage2(data),
    onSuccess: invalidateAfterSubmit,
  });

  const stage3Mutation = useMutation({
    mutationFn: (data: Stage3SubmissionRequest) => submissionsApi.submitStage3(data),
    onSuccess: invalidateAfterSubmit,
  });

  return {
    submissions: submissionsQuery.data ?? [],
    isLoading: submissionsQuery.isPending,
    error: submissionsQuery.error,

    submitStage1: stage1Mutation.mutateAsync,
    submitStage2: stage2Mutation.mutateAsync,
    submitStage3: stage3Mutation.mutateAsync,

    isSubmittingStage1: stage1Mutation.isPending,
    isSubmittingStage2: stage2Mutation.isPending,
    isSubmittingStage3: stage3Mutation.isPending,
  };
}
