'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Send,
  ShieldCheck,
  Trophy,
  UsersRound,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useJudgeProfile, useJudgeSubmissions, usePickRepresentative, useSubmitJudgeScore } from '@/lib/hooks/use-judge';
import type { Stage1Submission, Stage2Submission, Submission } from '@/lib/types';

const STAGE_2_RUBRIC = [
  { key: 'innovation', label: 'Innovation' },
  { key: 'technical_execution', label: 'Technical execution' },
  { key: 'impact', label: 'Impact' },
  { key: 'feasibility', label: 'Feasibility' },
] as const;

type ScoreValues = Record<(typeof STAGE_2_RUBRIC)[number]['key'], number>;
type ScoreComments = Record<(typeof STAGE_2_RUBRIC)[number]['key'], string>;

const emptyScores: ScoreValues = {
  innovation: 0,
  technical_execution: 0,
  impact: 0,
  feasibility: 0,
};

const emptyComments: ScoreComments = {
  innovation: '',
  technical_execution: '',
  impact: '',
  feasibility: '',
};

const EMPTY_SUBMISSIONS: Submission[] = [];

export default function JudgePage() {
  const profileQuery = useJudgeProfile();
  const profile = profileQuery.data;
  const scopeStage = profile?.judge.stageScope === 'stage_1' ? 1 : 2;
  const canLoadQueue = Boolean(
    profile?.judge.isActive && profile.edition.activeStage >= scopeStage,
  );
  const submissionsQuery = useJudgeSubmissions(canLoadQueue ? scopeStage : undefined);
  const submissions = submissionsQuery.data ?? EMPTY_SUBMISSIONS;

  const loading = profileQuery.isPending || submissionsQuery.isPending;
  const groupedByDepartment = useMemo(() => {
    return submissions.reduce<Record<string, Submission[]>>((acc, submission) => {
      const department = submission.teams?.department ?? 'Unassigned department';
      acc[department] = [...(acc[department] ?? []), submission];
      return acc;
    }, {});
  }, [submissions]);

  if (profileQuery.isPending) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section
        id="overview"
        className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,220,255,0.78)_56%,rgba(196,240,255,0.58)_100%)] p-6 shadow-[0_24px_70px_rgba(42,0,59,0.08)] sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-orange)]">
          PIDEC Judge Desk
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal text-[var(--brand-plum)]">
              {scopeStage === 1 ? 'Representative Selection' : 'Prototype Scoring'}
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--brand-plum-soft)]/72">
              {scopeStage === 1
                ? 'Review Stage 1 proposals and select one representative per assigned department.'
                : 'Review Stage 2 prototype submissions and submit rubric scores for each assigned team.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-[var(--brand-plum)] px-3 py-1 text-white">
              {profile?.judge.stageScope === 'stage_1' ? 'Stage 1 Judge' : 'Stage 2 Judge'}
            </Badge>
            <Badge variant={profile?.judge.isActive ? 'default' : 'destructive'}>
              {profile?.judge.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </section>

      <section id="assignments" className="grid scroll-mt-24 gap-4 md:grid-cols-3">
        <JudgeMetric label="Assigned Departments" value={profile?.judge.assignedDepartments.length ?? 0} />
        <JudgeMetric label="Visible Submissions" value={submissions.length} />
        <JudgeMetric label="Active Stage" value={`Stage ${profile?.edition.activeStage ?? '-'}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-[var(--brand-orange)]" />
            <h3 className="text-xl font-semibold text-[var(--brand-plum)]">Department scope</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(profile?.judge.assignedDepartments ?? []).map((department) => (
              <Badge
                key={department}
                variant="secondary"
                className="rounded-full border border-[rgba(42,0,59,0.08)] bg-[rgba(42,0,59,0.04)] px-3 py-1 text-[var(--brand-plum)]"
              >
                {department}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(42,0,59,0.96),rgba(82,18,109,0.92))] p-5 text-white shadow-[0_18px_44px_rgba(42,0,59,0.12)] sm:p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[var(--brand-orange)]" />
            <h3 className="text-xl font-semibold">Visibility rule</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/72">
            Scores and feedback stay hidden from teams until admin reviews and publishes them.
          </p>
        </div>
      </section>

      <section
        id="guidelines"
        className="scroll-mt-24 rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6"
      >
        <div className="flex items-center gap-3">
          <BookOpenCheck className="h-5 w-5 text-[var(--brand-orange)]" />
          <h3 className="text-xl font-semibold text-[var(--brand-plum)]">Judging guidance</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <GuidelineCard
            title={scopeStage === 1 ? 'Read independently' : 'Review complete demos'}
            body={
              scopeStage === 1
                ? 'Stage 1 judging is discretionary. The rubric is a guide, not a forced score sheet.'
                : 'Use each team video, documentation, and prototype notes before scoring.'
            }
          />
          <GuidelineCard
            title={scopeStage === 1 ? 'Pick one representative' : 'Score with comments'}
            body={
              scopeStage === 1
                ? 'Select the strongest proposal for each assigned department.'
                : 'Enter criterion scores and written comments so feedback is useful after publishing.'
            }
          />
          <GuidelineCard
            title="Admin confirms"
            body="Your selections and scores go to admin review before teams see any result."
          />
        </div>
      </section>

      <section id="queue" className="scroll-mt-24">
        {!profile?.judge.isActive ? (
          <JudgeEmptyState
            title="Judge account inactive"
            description="Your judge access is currently inactive. Contact the PIDEC admin team if this looks wrong."
          />
        ) : !canLoadQueue ? (
          <JudgeEmptyState
            title="Queue not open yet"
            description={`This judge account is scoped to Stage ${scopeStage}, but the competition is currently at Stage ${profile?.edition.activeStage}.`}
          />
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : submissionsQuery.error ? (
          <JudgeEmptyState
            title="Could not load submissions"
            description="Please refresh the page. If the issue continues, contact the PIDEC admin team."
          />
        ) : submissions.length === 0 ? (
          <JudgeEmptyState
            title="No submissions available"
            description="Submissions from your assigned departments will appear here once teams submit."
          />
        ) : scopeStage === 1 ? (
          <Stage1Queue groupedByDepartment={groupedByDepartment} />
        ) : (
          <Stage2Queue submissions={submissions as Stage2Submission[]} />
        )}
      </section>
    </div>
  );
}

function JudgeMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-plum-soft)]/62">
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl font-semibold tracking-normal text-[var(--brand-plum)]">
        {value}
      </p>
    </div>
  );
}

function GuidelineCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(42,0,59,0.08)] bg-[rgba(248,244,251,0.82)] p-4">
      <p className="font-semibold text-[var(--brand-plum)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--brand-plum-soft)]/72">{body}</p>
    </div>
  );
}

function JudgeEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-10 text-center shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
      <AlertCircle className="mx-auto h-10 w-10 text-[var(--brand-orange)]" />
      <h3 className="mt-4 text-xl font-semibold text-[var(--brand-plum)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--brand-plum-soft)]/72">
        {description}
      </p>
    </div>
  );
}

function Stage1Queue({ groupedByDepartment }: { groupedByDepartment: Record<string, Submission[]> }) {
  const pickRepresentative = usePickRepresentative();
  const [comments, setComments] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDepartment).map(([department, submissions]) => (
        <section key={department} className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-[var(--brand-plum)]">{department}</h3>
              <p className="text-sm text-[var(--brand-plum-soft)]/70">
                Select one team to represent this department in Stage 2.
              </p>
            </div>
            <Badge variant="secondary">{submissions.length} proposal{submissions.length === 1 ? '' : 's'}</Badge>
          </div>

          <div className="grid gap-4">
            {(submissions as Stage1Submission[]).map((submission) => (
              <article key={submission.id} className="rounded-2xl border border-[rgba(42,0,59,0.08)] bg-white p-4">
                <SubmissionHeader submission={submission} />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <FieldPreview label="Problem" value={submission.formData.problem_statement} />
                  <FieldPreview label="Solution" value={submission.formData.proposed_solution} />
                  <FieldPreview label="Theme alignment" value={submission.formData.theme_alignment} />
                  <FieldPreview label="Feasibility" value={submission.formData.feasibility} />
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-semibold text-[var(--brand-plum)]" htmlFor={`comments-${submission.id}`}>
                    Selection note
                  </label>
                  <Textarea
                    id={`comments-${submission.id}`}
                    value={comments[submission.id] ?? ''}
                    onChange={(event) =>
                      setComments((current) => ({ ...current, [submission.id]: event.target.value }))
                    }
                    placeholder="Optional note for the admin team"
                    className="min-h-20"
                  />
                </div>
                <Button
                  className="mt-4"
                  disabled={pickRepresentative.isPending}
                  onClick={() =>
                    pickRepresentative.mutate({
                      department,
                      data: {
                        submissionId: submission.id,
                        comments: comments[submission.id]?.trim() || undefined,
                      },
                    })
                  }
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Select as representative
                </Button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Stage2Queue({ submissions }: { submissions: Stage2Submission[] }) {
  const submitScore = useSubmitJudgeScore();
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreValues>(emptyScores);
  const [comments, setComments] = useState<ScoreComments>(emptyComments);

  function openScoreForm(submissionId: string) {
    setActiveSubmissionId(submissionId);
    setScores(emptyScores);
    setComments(emptyComments);
  }

  function submitActiveScore(submissionId: string) {
    const hasInvalidScore = Object.values(scores).some((score) => Number.isNaN(score) || score < 0 || score > 100);
    if (hasInvalidScore) return;

    submitScore.mutate(
      { submissionId, data: { scores, comments } },
      { onSuccess: () => setActiveSubmissionId(null) },
    );
  }

  return (
    <div className="grid gap-5">
      {submissions.map((submission) => (
        <article key={submission.id} className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
          <SubmissionHeader submission={submission} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <FieldPreview label="Design summary" value={submission.formData.design_summary} />
            <FieldPreview label="Engineering decisions" value={submission.formData.engineering_decisions} />
            <FieldPreview label="Constraints addressed" value={submission.formData.constraints_addressed} />
            <FieldPreview label="Testing results" value={submission.formData.testing_results} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {submission.videoLink ? (
              <Button asChild variant="outline" size="sm">
                <a href={submission.videoLink} target="_blank" rel="noreferrer">
                  View video
                </a>
              </Button>
            ) : null}
            {submission.files?.map((file) => (
              <Button key={file.url} asChild variant="outline" size="sm">
                <a href={file.url} target="_blank" rel="noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  {file.filename}
                </a>
              </Button>
            ))}
          </div>

          {activeSubmissionId === submission.id ? (
            <div className="mt-5 rounded-2xl border border-[rgba(142,77,255,0.16)] bg-[rgba(142,77,255,0.05)] p-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {STAGE_2_RUBRIC.map((criterion) => (
                  <div key={criterion.key} className="space-y-2 rounded-xl bg-white/80 p-4">
                    <label className="text-sm font-semibold text-[var(--brand-plum)]" htmlFor={`${submission.id}-${criterion.key}`}>
                      {criterion.label}
                    </label>
                    <Input
                      id={`${submission.id}-${criterion.key}`}
                      type="number"
                      min={0}
                      max={100}
                      value={scores[criterion.key]}
                      onChange={(event) =>
                        setScores((current) => ({
                          ...current,
                          [criterion.key]: Number(event.target.value),
                        }))
                      }
                    />
                    <Textarea
                      value={comments[criterion.key]}
                      onChange={(event) =>
                        setComments((current) => ({
                          ...current,
                          [criterion.key]: event.target.value,
                        }))
                      }
                      placeholder="Short comment"
                      className="min-h-20"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button disabled={submitScore.isPending} onClick={() => submitActiveScore(submission.id)}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitScore.isPending ? 'Saving score...' : 'Submit score'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveSubmissionId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button className="mt-5" onClick={() => openScoreForm(submission.id)}>
              Score submission
            </Button>
          )}
        </article>
      ))}
    </div>
  );
}

function SubmissionHeader({ submission }: { submission: Submission }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h4 className="text-xl font-semibold text-[var(--brand-plum)]">
          {submission.teams?.name ?? 'Unnamed team'}
        </h4>
        <p className="text-sm text-[var(--brand-plum-soft)]/70">
          {submission.teams?.department ?? 'Department unavailable'}
        </p>
        <p className="text-sm text-[var(--brand-plum-soft)]/70">
          Submitted by {submission.users?.name ?? 'team leader'}
        </p>
      </div>
      <Badge className="w-fit rounded-full bg-[rgba(18,183,234,0.12)] text-[#0b6f91]">
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Submitted
      </Badge>
    </div>
  );
}

function FieldPreview({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-[rgba(42,0,59,0.08)] bg-white/76 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]/60">
        {label}
      </p>
      <p className="mt-2 line-clamp-6 text-sm leading-6 text-[var(--brand-plum-soft)]/82">
        {value?.trim() || 'No response provided.'}
      </p>
    </div>
  );
}
