'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  overviewApi,
  verificationsApi,
  studentsApi,
  teamsAdminApi,
  submissionsAdminApi,
  tokensApi,
  judgesAdminApi,
  feedbackAdminApi,
  settingsApi,
  sponsorsApi,
  partnersApi,
  faqsApi,
  exportsApi,
  downloadBlob,
} from '@/lib/api/admin';
import { extractApiError } from '@/lib/api/client';
import { qk } from '@/lib/api/query-keys';
import type {
  VerificationQueueParams,
  VerificationDecisionRequest,
  StudentListParams,
  SuspendUserRequest,
  TeamListParams,
  TeamActionRequest,
  TokenListParams,
  GenerateTokenRequest,
  JudgeListParams,
  CreateJudgeRequest,
  SubmissionListParams,
  PublishFeedbackRequest,
  UpdateEditionRequest,
  SetActiveStageRequest,
  ToggleRequest,
  LandingAssetRequest,
  LandingFaqRequest,
} from '@/lib/types';

// Convention: every mutation uses the qk prefix arrays for invalidation, never literal strings.
// Prefix matching in TanStack v5 means qk.admin.verifications (a function) cannot be used directly
// for "invalidate ALL verification queries" — we pass the prefix tuple manually but built from qk
// to keep a single source of truth.
const PREFIX = {
  verifications: ['admin', 'verifications'] as const,
  students: ['admin', 'students'] as const,
  teams: ['admin', 'teams'] as const,
  tokens: ['admin', 'tokens'] as const,
  judges: ['admin', 'judges'] as const,
  submissions: ['admin', 'submissions'] as const,
};

// ─── Overview ───────────────────────────────────────────────────────────────
export function useAdminOverview() {
  return useQuery({
    queryKey: qk.admin.overview,
    queryFn: overviewApi.getOverview,
    staleTime: 30_000,
  });
}

// ─── Edition (toggle source of truth) ───────────────────────────────────────
export function useAdminEdition() {
  return useQuery({
    queryKey: qk.admin.edition,
    queryFn: settingsApi.getEdition,
    staleTime: 30_000,
  });
}

// ─── Verifications ──────────────────────────────────────────────────────────
export function useAdminVerifications(params?: VerificationQueueParams) {
  return useQuery({
    queryKey: qk.admin.verifications(params as Record<string, unknown>),
    queryFn: () => verificationsApi.getVerificationQueue(params),
  });
}

export function useVerificationDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: VerificationDecisionRequest }) =>
      verificationsApi.applyDecision(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.verifications });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Verification decision applied.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Students ───────────────────────────────────────────────────────────────
export function useAdminStudents(params?: StudentListParams) {
  return useQuery({
    queryKey: qk.admin.students(params as Record<string, unknown>),
    queryFn: () => studentsApi.listStudents(params),
  });
}

export function useSuspendStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: SuspendUserRequest }) =>
      studentsApi.suspendStudent(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.students });
      toast.success('Student suspended.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useUnsuspendStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => studentsApi.unsuspendStudent(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.students });
      toast.success('Student unsuspended.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Teams ──────────────────────────────────────────────────────────────────
export function useAdminTeams(params?: TeamListParams) {
  return useQuery({
    queryKey: qk.admin.teams(params as Record<string, unknown>),
    queryFn: () => teamsAdminApi.listTeams(params),
  });
}

export function useTeamAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: TeamActionRequest }) =>
      teamsAdminApi.applyTeamAction(teamId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.teams });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Team action applied.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Tokens ─────────────────────────────────────────────────────────────────
export function useAdminTokens(params?: TokenListParams) {
  return useQuery({
    queryKey: qk.admin.tokens(params as Record<string, unknown>),
    queryFn: () => tokensApi.listTokens(params),
  });
}

export function useGenerateToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateTokenRequest) => tokensApi.generateToken(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.tokens });
      toast.success('Token generated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useRegenerateToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateTokenRequest) => tokensApi.regenerateToken(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.tokens });
      toast.success('Token regenerated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Judges ─────────────────────────────────────────────────────────────────
export function useAdminJudges(params?: JudgeListParams) {
  return useQuery({
    queryKey: qk.admin.judges(params as Record<string, unknown>),
    queryFn: () => judgesAdminApi.listJudges(params),
  });
}

export function useCreateJudge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJudgeRequest) => judgesAdminApi.createJudge(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.judges });
      toast.success('Judge account created.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useDeactivateJudge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (judgeId: string) => judgesAdminApi.deactivateJudge(judgeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.judges });
      toast.success('Judge deactivated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Submissions ────────────────────────────────────────────────────────────
export function useAdminSubmissions(params?: SubmissionListParams) {
  return useQuery({
    queryKey: qk.admin.submissions(params as Record<string, unknown>),
    queryFn: () => submissionsAdminApi.listSubmissions(params),
  });
}

// ─── Feedback ───────────────────────────────────────────────────────────────
export function usePublishFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: string) => feedbackAdminApi.publishFeedback(submissionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.submissions });
      toast.success('Feedback published.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function usePublishBulkFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PublishFeedbackRequest) => feedbackAdminApi.publishBulkFeedback(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PREFIX.submissions });
      toast.success('Feedback published for all selected teams.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Settings ───────────────────────────────────────────────────────────────
export function useUpdateEdition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEditionRequest) => settingsApi.updateEdition(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.edition });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Edition updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useSetActiveStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SetActiveStageRequest) => settingsApi.setActiveStage(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.edition });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Active stage updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useToggleSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleRequest) => settingsApi.toggleSignup(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.edition });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Registration toggle updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useToggleSubmissionWindow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleRequest) => settingsApi.toggleSubmissionWindow(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.edition });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Submission window toggle updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useToggleTeamLock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleRequest) => settingsApi.toggleTeamLock(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.edition });
      qc.invalidateQueries({ queryKey: qk.admin.overview });
      toast.success('Team lock toggle updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Content (Sponsors / Partners / FAQs) ───────────────────────────────────
export function useAdminSponsors() {
  return useQuery({
    queryKey: qk.admin.sponsors,
    queryFn: () => sponsorsApi.list(),
  });
}

export function useCreateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LandingAssetRequest) => sponsorsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.sponsors });
      toast.success('Sponsor added.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useUpdateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LandingAssetRequest }) =>
      sponsorsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.sponsors });
      toast.success('Sponsor updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useDeleteSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sponsorsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.sponsors });
      toast.success('Sponsor removed.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useAdminPartners() {
  return useQuery({
    queryKey: qk.admin.partners,
    queryFn: () => partnersApi.list(),
  });
}

export function useCreatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LandingAssetRequest) => partnersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.partners });
      toast.success('Partner added.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useUpdatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LandingAssetRequest }) =>
      partnersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.partners });
      toast.success('Partner updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useDeletePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.partners });
      toast.success('Partner removed.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useAdminFaqs() {
  return useQuery({
    queryKey: qk.admin.faqs,
    queryFn: () => faqsApi.list(),
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LandingFaqRequest) => faqsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.faqs });
      toast.success('FAQ added.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LandingFaqRequest }) =>
      faqsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.faqs });
      toast.success('FAQ updated.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.faqs });
      toast.success('FAQ removed.');
    },
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

// ─── Exports ────────────────────────────────────────────────────────────────
export function useExportStudents() {
  return useMutation({
    mutationFn: () => exportsApi.exportStudents(),
    onSuccess: (blob) => downloadBlob(blob, `pidec-students-${Date.now()}.csv`),
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useExportTeams() {
  return useMutation({
    mutationFn: () => exportsApi.exportTeams(),
    onSuccess: (blob) => downloadBlob(blob, `pidec-teams-${Date.now()}.csv`),
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useExportSubmissions() {
  return useMutation({
    mutationFn: (stage?: number) => exportsApi.exportSubmissions(stage),
    onSuccess: (blob) => downloadBlob(blob, `pidec-submissions-${Date.now()}.zip`),
    onError: (err) => toast.error(extractApiError(err).message),
  });
}

export function useExportScores() {
  return useMutation({
    mutationFn: () => exportsApi.exportScores(),
    onSuccess: (blob) => downloadBlob(blob, `pidec-scores-${Date.now()}.csv`),
    onError: (err) => toast.error(extractApiError(err).message),
  });
}
