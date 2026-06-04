'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Filter,
  Rocket,
  Search,
  Send,
} from 'lucide-react';

import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DEPARTMENTS } from '@/lib/constants';
import {
  useAdminSubmissions,
  usePublishBulkFeedback,
  usePublishFeedback,
  useTeamAction,
} from '@/lib/hooks/use-admin';
import type { Submission, SubmissionJudgeScorePreview } from '@/lib/types';

const PUBLISHED_STATUS = 'feedback_published';

type ConfirmAction =
  | { type: 'publish'; submission: Submission }
  | { type: 'promote'; submission: Submission }
  | { type: 'promote_publish'; submission: Submission }
  | null;

export default function FeedbackPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [stage, setStage] = useState('all');
  const [statusFilter, setStatusFilter] = useState('unpublished');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [promotionFilter, setPromotionFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [reviewSubmission, setReviewSubmission] = useState<Submission | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const params = {
    limit: 100,
    ...(search && { q: search }),
    ...(department !== 'all' && { department }),
    ...(stage !== 'all' && { stage: Number(stage) }),
    ...(statusFilter !== 'all' &&
      statusFilter !== 'unpublished' && {
        status: statusFilter as 'submitted' | 'under_review' | 'feedback_published',
      }),
  };

  const { data: submissionsData, isPending: submissionsLoading } = useAdminSubmissions(params);
  const publish = usePublishFeedback();
  const publishBulk = usePublishBulkFeedback();
  const teamAction = useTeamAction();

  const visible = useMemo(() => {
    const submissions = submissionsData?.data ?? [];
    return submissions.filter((submission) => {
      const isPublished = isPublishedSubmission(submission);
      const hasScores = hasJudgeScores(submission);
      const isPromoted = isPromotedSubmission(submission);

      if (statusFilter === 'unpublished' && isPublished) return false;
      if (scoreFilter === 'scored' && !hasScores) return false;
      if (scoreFilter === 'unscored' && hasScores) return false;
      if (promotionFilter === 'advanced' && !isPromoted) return false;
      if (promotionFilter === 'not_advanced' && isPromoted) return false;

      return true;
    });
  }, [promotionFilter, scoreFilter, statusFilter, submissionsData?.data]);

  const stats = useMemo(() => {
    return {
      total: visible.length,
      scored: visible.filter(hasJudgeScores).length,
      promoted: visible.filter(isPromotedSubmission).length,
      published: visible.filter(isPublishedSubmission).length,
    };
  }, [visible]);

  const eligibleIds = visible.filter(canPublishSubmission).map((submission) => submission.id);
  const allEligibleSelected =
    eligibleIds.length > 0 && eligibleIds.every((id) => selected.has(id));

  function toggleAll() {
    setSelected(allEligibleSelected ? new Set() : new Set(eligibleIds));
  }

  function toggleOne(submission: Submission) {
    if (!canPublishSubmission(submission)) return;
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(submission.id)) next.delete(submission.id);
      else next.add(submission.id);
      return next;
    });
  }

  function handleBulkPublish() {
    publishBulk.mutate(
      { submissionIds: Array.from(selected) },
      {
        onSettled: () => {
          setSelected(new Set());
          setBulkOpen(false);
        },
      },
    );
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    const { type, submission } = confirmAction;

    if (type === 'promote' || type === 'promote_publish') {
      if (!submission.teams?.id) return;
      await teamAction.mutateAsync({
        teamId: submission.teams.id,
        data: { action: 'advance' },
      });
    }

    if (type === 'publish' || type === 'promote_publish') {
      await publish.mutateAsync(submission.id);
      setSelected((current) => {
        const next = new Set(current);
        next.delete(submission.id);
        return next;
      });
    }

    setConfirmAction(null);
  }

  const confirmCopy = getConfirmCopy(confirmAction);
  const actionPending = publish.isPending || publishBulk.isPending || teamAction.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-orange)]">
            Feedback control
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Judge Feedback Review</h2>
          <p className="text-muted-foreground">
            Review judge scores, promote teams, and publish feedback to participants.
          </p>
        </div>
        {selected.size > 0 ? (
          <Button onClick={() => setBulkOpen(true)} disabled={publishBulk.isPending}>
            <Send className="mr-2 h-4 w-4" />
            Publish {selected.size} selected
          </Button>
        ) : null}
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Visible" value={stats.total} />
        <MetricCard label="Scored" value={stats.scored} />
        <MetricCard label="Promoted" value={stats.promoted} />
        <MetricCard label="Published" value={stats.published} />
      </section>

      <section className="rounded-2xl border bg-white/88 p-4 shadow-[0_18px_44px_rgba(42,0,59,0.05)]">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--brand-plum)]">
          <Filter className="h-4 w-4 text-[var(--brand-purple)]" />
          Filters
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by team or video link"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {DEPARTMENTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger>
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              <SelectItem value="1">Stage 1</SelectItem>
              <SelectItem value="2">Stage 2</SelectItem>
              <SelectItem value="3">Stage 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpublished">Unpublished</SelectItem>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under review</SelectItem>
              <SelectItem value="feedback_published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Scores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scores</SelectItem>
              <SelectItem value="scored">Scored</SelectItem>
              <SelectItem value="unscored">Unscored</SelectItem>
            </SelectContent>
          </Select>
          <Select value={promotionFilter} onValueChange={setPromotionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All progress</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="not_advanced">Not advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {submissionsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border bg-white/88 p-12 text-center">
          <p className="text-sm text-muted-foreground">No submissions match these filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white/88 shadow-[0_18px_44px_rgba(42,0,59,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="w-10 px-4 py-3 text-left font-medium">
                    <Checkbox
                      checked={allEligibleSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all publishable submissions"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Team</th>
                  <th className="px-4 py-3 text-left font-medium">Department</th>
                  <th className="px-4 py-3 text-left font-medium">Stage</th>
                  <th className="px-4 py-3 text-left font-medium">Judge score</th>
                  <th className="px-4 py-3 text-left font-medium">Progress</th>
                  <th className="px-4 py-3 text-left font-medium">Feedback</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((submission) => {
                  const isPublished = isPublishedSubmission(submission);
                  const isPromoted = isPromotedSubmission(submission);
                  const publishable = canPublishSubmission(submission);
                  const highestScore = getPrimaryScore(submission);

                  return (
                    <tr key={submission.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selected.has(submission.id)}
                          onCheckedChange={() => toggleOne(submission)}
                          disabled={!publishable}
                          aria-label="Select submission"
                        />
                      </td>
                      <td className="max-w-[220px] px-4 py-4">
                        <p className="break-words font-semibold text-[var(--brand-plum)]">
                          {submission.teams?.name ?? 'Unnamed team'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Lead: {submission.users?.name ?? 'Unavailable'}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {submission.teams?.department ?? '-'}
                      </td>
                      <td className="px-4 py-4">Stage {submission.stage}</td>
                      <td className="px-4 py-4">
                        {highestScore ? (
                          <div>
                            <p className="font-semibold text-[var(--brand-plum)]">
                              {typeof highestScore.totalScore === 'number'
                                ? `${highestScore.totalScore}/100`
                                : 'Scored'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {submission.judgeScores?.length ?? 0} judge{' '}
                              {(submission.judgeScores?.length ?? 0) === 1 ? 'entry' : 'entries'}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">No score</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={isPromoted ? 'default' : 'secondary'}>
                          {isPromoted ? 'Advanced' : 'Not advanced'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={isPublished ? 'default' : 'secondary'}>
                          {isPublished ? 'Published' : 'Unpublished'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReviewSubmission(submission)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!canPromoteSubmission(submission) || teamAction.isPending}
                            onClick={() => setConfirmAction({ type: 'promote', submission })}
                          >
                            <Rocket className="mr-1.5 h-3.5 w-3.5" />
                            Promote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!publishable || publish.isPending}
                            onClick={() => setConfirmAction({ type: 'publish', submission })}
                          >
                            Publish
                          </Button>
                          <Button
                            size="sm"
                            disabled={
                              !canPromoteSubmission(submission) ||
                              !hasJudgeScores(submission) ||
                              isPublished ||
                              publish.isPending ||
                              teamAction.isPending
                            }
                            onClick={() =>
                              setConfirmAction({ type: 'promote_publish', submission })
                            }
                          >
                            Promote & publish
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ReviewDialog
        submission={reviewSubmission}
        onOpenChange={(open) => !open && setReviewSubmission(null)}
      />

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmCopy.title}
        description={confirmCopy.description}
        confirmLabel={confirmCopy.confirmLabel}
        onConfirm={handleConfirmAction}
        isLoading={actionPending}
      />

      <ConfirmationDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title={`Publish feedback for ${selected.size} teams`}
        description="Each selected team will be notified by email and see the judge scores on their dashboard."
        confirmLabel="Publish selected"
        onConfirm={handleBulkPublish}
        isLoading={publishBulk.isPending}
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white/88 p-4 shadow-[0_18px_44px_rgba(42,0,59,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[var(--brand-plum)]">{value}</p>
    </div>
  );
}

function ReviewDialog({
  submission,
  onOpenChange,
}: {
  submission: Submission | null;
  onOpenChange: (open: boolean) => void;
}) {
  const judgeScores = submission?.judgeScores ?? [];
  const feedback = submission?.feedbackRecord;

  return (
    <Dialog open={Boolean(submission)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {submission?.teams?.name ?? 'Submission'} judge feedback
          </DialogTitle>
          <DialogDescription>
            Full judge score breakdown, comments, and publication state.
          </DialogDescription>
        </DialogHeader>

        {submission ? (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 md:grid-cols-4">
              <ReviewMeta label="Department" value={submission.teams?.department ?? '-'} />
              <ReviewMeta label="Stage" value={`Stage ${submission.stage}`} />
              <ReviewMeta
                label="Progress"
                value={isPromotedSubmission(submission) ? 'Advanced' : 'Not advanced'}
              />
              <ReviewMeta
                label="Feedback"
                value={isPublishedSubmission(submission) ? 'Published' : 'Unpublished'}
              />
            </div>

            {feedback ? (
              <section className="rounded-2xl border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-purple)]" />
                  <h3 className="font-semibold text-[var(--brand-plum)]">Feedback record</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <ReviewMeta label="Evaluator" value={feedback.evaluatorName ?? '-'} />
                  <ReviewMeta
                    label="Total"
                    value={
                      typeof feedback.totalScore === 'number'
                        ? `${feedback.totalScore}/100`
                        : '-'
                    }
                  />
                  <ReviewMeta label="Outcome" value={feedback.outcome ?? '-'} />
                  <ReviewMeta
                    label="Published"
                    value={feedback.published ? formatDateTime(feedback.publishedAt) : 'No'}
                  />
                </div>
              </section>
            ) : null}

            {judgeScores.length === 0 ? (
              <div className="rounded-2xl border p-6 text-center text-sm text-muted-foreground">
                No judge scores have been submitted for this submission yet.
              </div>
            ) : (
              <div className="space-y-4">
                {judgeScores.map((score, index) => (
                  <JudgeScoreCard key={score.id} score={score} index={index} />
                ))}
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function JudgeScoreCard({
  score,
  index,
}: {
  score: SubmissionJudgeScorePreview;
  index: number;
}) {
  const scoreEntries = Object.entries(score.scores ?? {});
  const commentEntries = Object.entries(score.comments ?? {}).filter(([, value]) =>
    Boolean(value?.trim()),
  );

  return (
    <section className="rounded-2xl border p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-[var(--brand-plum)]">
            {score.judges?.name ?? `Judge ${index + 1}`}
          </h3>
          <p className="text-xs text-muted-foreground">
            {score.judges?.email ?? 'No judge email'} - {formatDateTime(score.submittedAt)}
          </p>
        </div>
        <Badge variant="secondary">
          {typeof score.totalScore === 'number' ? `${score.totalScore}/100` : 'Scored'}
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-muted/35 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Scores
          </p>
          {scoreEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No score breakdown.</p>
          ) : (
            <div className="space-y-2">
              {scoreEntries.map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{formatKey(key)}</span>
                  <span className="font-semibold text-[var(--brand-plum)]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-muted/35 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Comments
          </p>
          {commentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments entered.</p>
          ) : (
            <div className="space-y-3">
              {commentEntries.map(([key, value]) => (
                <div key={key} className="text-sm">
                  <p className="font-semibold text-[var(--brand-plum)]">{formatKey(key)}</p>
                  <p className="mt-1 leading-6 text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words font-medium text-[var(--brand-plum)]">{value}</p>
    </div>
  );
}

function getConfirmCopy(action: ConfirmAction) {
  if (action?.type === 'promote') {
    return {
      title: 'Promote team',
      description: `${action.submission.teams?.name ?? 'This team'} will move to the next stage. Members may receive advancement notifications.`,
      confirmLabel: 'Promote',
    };
  }

  if (action?.type === 'promote_publish') {
    return {
      title: 'Promote and publish',
      description: `${action.submission.teams?.name ?? 'This team'} will be promoted, then judge feedback will be published to the team.`,
      confirmLabel: 'Promote & publish',
    };
  }

  if (action?.type === 'publish') {
    return {
      title: 'Publish feedback',
      description: `${action.submission.teams?.name ?? 'This team'} will see the judge score and comments on their dashboard.`,
      confirmLabel: 'Publish',
    };
  }

  return {
    title: 'Confirm action',
    description: 'Confirm this action.',
    confirmLabel: 'Confirm',
  };
}

function hasJudgeScores(submission: Submission) {
  return (submission.judgeScores?.length ?? 0) > 0 || Boolean(submission.feedbackRecord);
}

function canPublishSubmission(submission: Submission) {
  return !isPublishedSubmission(submission) && hasJudgeScores(submission);
}

function canPromoteSubmission(submission: Submission) {
  const currentStage = submission.teams?.currentStage;
  return Boolean(submission.teams?.id && submission.stage < 3 && (!currentStage || currentStage <= submission.stage));
}

function isPromotedSubmission(submission: Submission) {
  const currentStage = submission.teams?.currentStage;
  if (currentStage && currentStage > submission.stage) return true;
  return submission.feedbackRecord?.outcome === 'advanced';
}

function isPublishedSubmission(submission: Submission) {
  return submission.status === PUBLISHED_STATUS || Boolean(submission.feedbackRecord?.published);
}

function getPrimaryScore(submission: Submission) {
  const scores = submission.judgeScores ?? [];
  if (scores.length === 0) return null;
  return [...scores].sort((a, b) => (b.totalScore ?? -1) - (a.totalScore ?? -1))[0];
}

function formatKey(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos',
  }).format(date);
}
