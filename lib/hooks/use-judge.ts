'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { extractApiError } from '@/lib/api/client';
import { judgeApi } from '@/lib/api/judge';
import { qk } from '@/lib/api/query-keys';
import type { Stage1RepresentativeRequest, Stage2ScoreRequest } from '@/lib/types';

export function useJudgeProfile() {
  return useQuery({
    queryKey: qk.judge.profile,
    queryFn: judgeApi.getProfile,
    staleTime: 30_000,
  });
}

export function useJudgeSubmissions(stage?: number) {
  return useQuery({
    queryKey: qk.judge.submissions(stage),
    queryFn: () => judgeApi.getSubmissions(stage),
    enabled: stage === 1 || stage === 2,
  });
}

export function usePickRepresentative() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      department,
      data,
    }: {
      department: string;
      data: Stage1RepresentativeRequest;
    }) => judgeApi.selectDeptRepresentative(department, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['judge', 'submissions'] });
      toast.success('Representative selection saved.');
    },
    onError: (error) => toast.error(extractApiError(error).message),
  });
}

export function useSubmitJudgeScore() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: Stage2ScoreRequest;
    }) => judgeApi.submitScore(submissionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['judge', 'submissions'] });
      toast.success('Score saved.');
    },
    onError: (error) => toast.error(extractApiError(error).message),
  });
}
