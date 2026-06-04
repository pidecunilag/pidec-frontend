'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  ChevronDown,
  CheckCircle2,
  Download,
  FileText,
  MessageSquareText,
  PencilLine,
  Send,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { judgeApi } from '@/lib/api/judge';
import { extractApiError } from '@/lib/api/client';
import {
  useJudgeProfile,
  useJudgeSubmissions,
  useSubmitJudgeScore,
  useSubmitStage1Score,
} from '@/lib/hooks/use-judge';
import type { Stage1Submission, Stage2Submission, Submission, SubmissionFile } from '@/lib/types';
import { toast } from 'sonner';

const STAGE_1_GUIDE_PDF_URL = '/stage-1-judging-guide.pdf';

const STAGE_1_RUBRIC = [
  {
    key: 'problemStatementClarity',
    label: 'Problem Statement Clarity',
    max: 20,
    description:
      'How clearly the team defines the problem, who is affected, why it matters, and what happens if it remains unsolved.',
  },
  {
    key: 'proposedSolutionQuality',
    label: 'Proposed Solution Quality',
    max: 30,
    description:
      'How strong, technically grounded, appropriate, original, and valuable the proposed engineering solution is.',
  },
  {
    key: 'themeAlignment',
    label: 'Theme Alignment',
    max: 20,
    description:
      'How clearly the proposal connects to Engineering for Impact: Building Inclusive Solutions for a Sustainable Future.',
  },
  {
    key: 'feasibilityAssessment',
    label: 'Feasibility Assessment',
    max: 20,
    description:
      'How realistic it is to build, simulate, prototype, or implement the solution within stated constraints.',
  },
  {
    key: 'departmentalRelevance',
    label: 'Departmental Relevance',
    max: 10,
    description:
      'How meaningfully the proposal applies engineering principles from the team department.',
  },
] as const;

const STAGE_1_GUIDE_SECTIONS = [
  {
    title: 'Purpose of Stage 1',
    body: [
      'Stage 1 is a selection stage. Each department will be represented in Stage 2 by one team.',
      'The goal is to identify the strongest proposal from each department based on clear thinking, sound engineering logic, and alignment with the PIDEC theme.',
    ],
  },
  {
    title: 'Judge Responsibility',
    body: [
      'Review assigned submissions independently and enter the official weighted rubric score for each proposal.',
      'Judges do not pick representative teams on the portal. Scores and optional feedback go to admin, and admin confirms the department representatives.',
    ],
  },
  {
    title: 'Stage 1 Scoring Rubric',
    body: STAGE_1_RUBRIC.map((criterion) => `${criterion.label}: 0-${criterion.max} points. ${criterion.description}`),
  },
  {
    title: 'Comments and Feedback',
    body: [
      'Criterion comments are optional.',
      'Overall comments are optional.',
      'When provided, comments should be concise, constructive, and focused on the proposal rather than the people who wrote it.',
    ],
  },
  {
    title: 'Confidentiality and Conduct',
    body: [
      'Review submissions independently and declare any conflict of interest.',
      'Keep scores, rankings, and deliberations confidential until official results are published.',
      'Report any attempt by a team to lobby, influence, or improperly contact you.',
    ],
  },
] as const;

type Stage1CriterionKey = (typeof STAGE_1_RUBRIC)[number]['key'];
type Stage1ScoreValues = Record<Stage1CriterionKey, number | ''>;
type Stage1ScoreComments = Partial<Record<Stage1CriterionKey | 'overall', string>>;

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

const emptyStage1Scores = (): Stage1ScoreValues => ({
  problemStatementClarity: '',
  proposedSolutionQuality: '',
  themeAlignment: '',
  feasibilityAssessment: '',
  departmentalRelevance: '',
});

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
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 sm:space-y-8">
      <section
        id="overview"
        className="relative min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,220,255,0.78)_56%,rgba(196,240,255,0.58)_100%)] p-5 shadow-[0_24px_70px_rgba(42,0,59,0.08)] sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-orange)]">
          PIDEC Judge Desk
        </p>
        <div className="mt-3 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-3xl font-semibold tracking-normal text-[var(--brand-plum)]">
              {scopeStage === 1 ? 'Stage 1 Proposal Scoring' : 'Prototype Scoring'}
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--brand-plum-soft)]/72">
              {scopeStage === 1
                ? 'Review assigned Stage 1 proposals, enter weighted rubric scores, and send them to admin for final selection.'
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

      <section id="assignments" className="grid min-w-0 scroll-mt-24 gap-4 md:grid-cols-3">
        <JudgeMetric label="Assigned Departments" value={profile?.judge.assignedDepartments.length ?? 0} />
        <JudgeMetric label="Visible Submissions" value={submissions.length} />
        <JudgeMetric label="Active Stage" value={`Stage ${profile?.edition.activeStage ?? '-'}`} />
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
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

        <div className="min-w-0 rounded-3xl border border-[rgba(255,90,0,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(255,245,235,0.92)_52%,rgba(241,231,255,0.78)_100%)] p-5 shadow-[0_18px_44px_rgba(255,90,0,0.08)] sm:p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[var(--brand-orange)]" />
            <h3 className="text-xl font-semibold text-[var(--brand-plum)]">Visibility rule</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--brand-plum-soft)]/74">
            Scores and feedback stay hidden from teams until admin reviews and publishes them.
          </p>
        </div>
      </section>

      <section
        id="guidelines"
        className="min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6"
      >
        <div className="flex items-center gap-3">
          <BookOpenCheck className="h-5 w-5 text-[var(--brand-orange)]" />
          <h3 className="text-xl font-semibold text-[var(--brand-plum)]">Judging guidance</h3>
        </div>
        {scopeStage === 1 ? (
          <Stage1GuideAccordion />
        ) : (
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
            <GuidelineCard
              title="Review complete demos"
              body="Use each team video, documentation, and prototype notes before scoring."
            />
            <GuidelineCard
              title="Score with comments"
              body="Enter criterion scores and written comments so feedback is useful after publishing."
            />
            <GuidelineCard
              title="Admin confirms"
              body="Your scores go to admin review before teams see any result."
            />
          </div>
        )}
      </section>

      <section id="queue" className="min-w-0 scroll-mt-24">
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
    <div className="min-w-0 rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
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
    <div className="min-w-0 rounded-2xl border border-[rgba(42,0,59,0.08)] bg-[rgba(248,244,251,0.82)] p-4">
      <p className="font-semibold text-[var(--brand-plum)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--brand-plum-soft)]/72">{body}</p>
    </div>
  );
}

function Stage1GuideAccordion() {
  const [openSection, setOpenSection] = useState<string>(STAGE_1_GUIDE_SECTIONS[0].title);

  return (
    <div className="mt-5 min-w-0 space-y-4">
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[rgba(18,183,234,0.18)] bg-[rgba(18,183,234,0.06)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--brand-plum)]">Stage 1 guide</p>
          <p className="mt-1 text-sm leading-6 text-[var(--brand-plum-soft)]/72">
            Use the rubric below while scoring. Representative selection is handled by admin after review.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
          <a href={STAGE_1_GUIDE_PDF_URL} download className="justify-center">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      <div className="min-w-0 divide-y divide-[rgba(42,0,59,0.08)] overflow-hidden rounded-2xl border border-[rgba(42,0,59,0.08)] bg-white">
        {STAGE_1_GUIDE_SECTIONS.map((section) => {
          const isOpen = openSection === section.title;

          return (
            <div key={section.title}>
              <button
                type="button"
                className="flex w-full min-w-0 items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[rgba(42,0,59,0.03)]"
                aria-expanded={isOpen}
                onClick={() => setOpenSection(isOpen ? '' : section.title)}
              >
                <span className="min-w-0 break-words font-semibold text-[var(--brand-plum)]">
                  {section.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--brand-plum-soft)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen ? (
                <div className="min-w-0 space-y-3 px-4 pb-5 text-sm leading-6 text-[var(--brand-plum-soft)]/78">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
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
  const submitStage1Score = useSubmitStage1Score();
  const [selected, setSelected] = useState<{
    department: string;
    submission: Stage1Submission;
  } | null>(null);
  const [scores, setScores] = useState<Stage1ScoreValues>(emptyStage1Scores);
  const [comments, setComments] = useState<Stage1ScoreComments>({});

  const totalScore = STAGE_1_RUBRIC.reduce((sum, criterion) => {
    const value = scores[criterion.key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);

  function openScoreModal(department: string, submission: Stage1Submission) {
    const existingScores = submission.judgeScore?.scores as Partial<Record<Stage1CriterionKey, number>> | undefined;
    const existingComments = submission.judgeScore?.comments as Stage1ScoreComments | undefined;

    setSelected({ department, submission });
    setScores({
      ...emptyStage1Scores(),
      ...existingScores,
    });
    setComments(existingComments ?? {});
  }

  function updateScore(key: Stage1CriterionKey, value: string) {
    setScores((current) => ({
      ...current,
      [key]: value === '' ? '' : Number(value),
    }));
  }

  function submitScore() {
    if (!selected) return;

    const missing = STAGE_1_RUBRIC.filter((criterion) => typeof scores[criterion.key] !== 'number');
    if (missing.length > 0) {
      toast.error(`Missing scores: ${missing.map((criterion) => criterion.label).join(', ')}`);
      return;
    }

    const outOfRange = STAGE_1_RUBRIC.find((criterion) => {
      const value = scores[criterion.key];
      return typeof value !== 'number' || value < 0 || value > criterion.max;
    });
    if (outOfRange) {
      toast.error(`${outOfRange.label} must be between 0 and ${outOfRange.max}.`);
      return;
    }

    const cleanedComments = Object.fromEntries(
      Object.entries(comments).filter(([, value]) => value?.trim()),
    ) as Stage1ScoreComments;

    submitStage1Score.mutate(
      {
        submissionId: selected.submission.id,
        scores: scores as Record<Stage1CriterionKey, number>,
        comments: cleanedComments,
      },
      { onSuccess: () => setSelected(null) },
    );
  }

  return (
    <>
      <div className="min-w-0 space-y-6">
        {Object.entries(groupedByDepartment).map(([department, submissions]) => (
          <section key={department} className="min-w-0 rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-4 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
            <div className="mb-5 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-2xl font-semibold text-[var(--brand-plum)]">{department}</h3>
                <p className="text-sm text-[var(--brand-plum-soft)]/70">
                  Score each proposal. Admin will review scores and confirm the representative team.
                </p>
              </div>
              <Badge variant="secondary" className="w-fit shrink-0">
                {submissions.length} proposal{submissions.length === 1 ? '' : 's'}
              </Badge>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(42,0,59,0.08)] bg-white">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow className="bg-[rgba(42,0,59,0.03)] hover:bg-[rgba(42,0,59,0.03)]">
                    <TableHead className="px-4 py-3 text-[var(--brand-plum)]">Team</TableHead>
                    <TableHead className="px-4 py-3 text-[var(--brand-plum)]">Submitted</TableHead>
                    <TableHead className="px-4 py-3 text-[var(--brand-plum)]">Document</TableHead>
                    <TableHead className="px-4 py-3 text-[var(--brand-plum)]">Score</TableHead>
                    <TableHead className="px-4 py-3 text-[var(--brand-plum)]">Status</TableHead>
                    <TableHead className="px-4 py-3 text-right text-[var(--brand-plum)]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(submissions as Stage1Submission[]).map((submission) => {
                    const total = submission.judgeScore?.totalScore;

                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="max-w-[14rem] whitespace-normal px-4 py-4">
                          <p className="break-words font-semibold text-[var(--brand-plum)]">
                            {submission.teams?.name ?? 'Unnamed team'}
                          </p>
                          <p className="mt-1 break-words text-xs text-[var(--brand-plum-soft)]/70">
                            Lead: {submission.users?.name ?? 'Team leader unavailable'}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-normal px-4 py-4 text-[var(--brand-plum-soft)]/78">
                          {formatDateTime(submission.submittedAt)}
                        </TableCell>
                        <TableCell className="max-w-[14rem] whitespace-normal px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {submission.files?.length ? (
                              submission.files.map((file) => (
                                <SubmissionFileDownloadButton key={file.id ?? file.url} submissionId={submission.id} file={file} />
                              ))
                            ) : (
                              <Badge variant="secondary">No file</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-normal px-4 py-4 font-semibold text-[var(--brand-plum)]">
                          {typeof total === 'number' ? `${total}/100` : 'Not scored'}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <Badge
                            variant="secondary"
                            className={
                              typeof total === 'number'
                                ? 'bg-[rgba(18,183,234,0.12)] text-[#0b6f91]'
                                : 'bg-[rgba(255,90,0,0.12)] text-[var(--brand-orange)]'
                            }
                          >
                            {typeof total === 'number' ? 'Scored' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right">
                          <Button size="sm" onClick={() => openScoreModal(department, submission)}>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Score
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        ))}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-3xl border border-[rgba(42,0,59,0.12)] bg-white p-4 shadow-[0_30px_90px_rgba(42,0,59,0.22)] sm:max-w-4xl sm:p-6">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="font-heading text-2xl font-semibold tracking-normal text-[var(--brand-plum)]">
              Score {selected?.submission.teams?.name ?? 'submission'}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-[var(--brand-plum-soft)]/74">
              Enter the direct weighted scores. Criterion comments and overall comments are optional.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-[rgba(18,183,234,0.18)] bg-[rgba(18,183,234,0.06)] p-4 text-sm leading-6 text-[var(--brand-plum-soft)]/78">
            <div className="flex items-start gap-2">
              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-[#0b6f91]" />
              <p>
                Scores go to admin for review. Judges are not selecting representative teams on the portal.
              </p>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            {STAGE_1_RUBRIC.map((criterion) => (
              <div key={criterion.key} className="min-w-0 rounded-2xl border border-[rgba(42,0,59,0.08)] bg-[rgba(248,244,251,0.74)] p-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <label
                      className="font-semibold text-[var(--brand-plum)]"
                      htmlFor={`stage-1-${criterion.key}`}
                    >
                      {criterion.label}
                    </label>
                    <p className="mt-1 break-words text-sm leading-6 text-[var(--brand-plum-soft)]/72">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="w-full shrink-0 sm:w-28">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-plum-soft)]/60">
                      / {criterion.max}
                    </span>
                    <Input
                      id={`stage-1-${criterion.key}`}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={criterion.max}
                      value={scores[criterion.key]}
                      onChange={(event) => updateScore(criterion.key, event.target.value)}
                    />
                  </div>
                </div>
                <Textarea
                  value={comments[criterion.key] ?? ''}
                  onChange={(event) =>
                    setComments((current) => ({
                      ...current,
                      [criterion.key]: event.target.value,
                    }))
                  }
                  placeholder="Optional criterion comment"
                  className="mt-3 min-h-20 bg-white"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--brand-plum)]" htmlFor="stage-1-overall-comment">
              Overall comment
            </label>
            <Textarea
              id="stage-1-overall-comment"
              value={comments.overall ?? ''}
              onChange={(event) =>
                setComments((current) => ({
                  ...current,
                  overall: event.target.value,
                }))
              }
              placeholder="Optional overall comment for admin"
              className="min-h-24"
            />
          </div>

          <DialogFooter className="gap-3 sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-[var(--brand-plum)]">Total: {totalScore}/100</p>
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setSelected(null)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="button" onClick={submitScore} disabled={submitStage1Score.isPending} className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                {submitStage1Score.isPending ? 'Saving score...' : 'Save score'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
    <div className="grid min-w-0 gap-5">
      {submissions.map((submission) => (
        <article key={submission.id} className="min-w-0 rounded-3xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)] sm:p-6">
          <SubmissionHeader submission={submission} />
          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
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
              <SubmissionFileDownloadButton key={file.id ?? file.url} submissionId={submission.id} file={file} />
            ))}
          </div>

          {activeSubmissionId === submission.id ? (
            <div className="mt-5 min-w-0 rounded-2xl border border-[rgba(142,77,255,0.16)] bg-[rgba(142,77,255,0.05)] p-4">
              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                {STAGE_2_RUBRIC.map((criterion) => (
                  <div key={criterion.key} className="min-w-0 space-y-2 rounded-xl bg-white/80 p-4">
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

function SubmissionFileDownloadButton({
  submissionId,
  file,
}: {
  submissionId: string;
  file: SubmissionFile;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const fileId = file.id ?? file.url;

  async function downloadFile() {
    try {
      setIsDownloading(true);
      const download = await judgeApi.getSubmissionFileDownload(submissionId, fileId);
      const link = document.createElement('a');
      link.href = download.url;
      link.download = download.filename;
      link.rel = 'noreferrer';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={downloadFile}
      disabled={isDownloading}
      className="max-w-full justify-start"
    >
      {isDownloading ? (
        <Download className="mr-2 h-4 w-4 animate-pulse" />
      ) : (
        <FileText className="mr-2 h-4 w-4" />
      )}
      <span className="min-w-0 truncate">{isDownloading ? 'Preparing...' : file.filename}</span>
    </Button>
  );
}

function SubmissionHeader({ submission }: { submission: Submission }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h4 className="break-words text-xl font-semibold text-[var(--brand-plum)]">
          {submission.teams?.name ?? 'Unnamed team'}
        </h4>
        <p className="break-words text-sm text-[var(--brand-plum-soft)]/70">
          {submission.teams?.department ?? 'Department unavailable'}
        </p>
        <p className="break-words text-sm text-[var(--brand-plum-soft)]/70">
          Submitted by {submission.users?.name ?? 'team leader'}
        </p>
      </div>
      <Badge className="w-fit shrink-0 rounded-full bg-[rgba(18,183,234,0.12)] text-[#0b6f91]">
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Submitted
      </Badge>
    </div>
  );
}

function FieldPreview({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[rgba(42,0,59,0.08)] bg-white/76 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]/60">
        {label}
      </p>
      <p className="mt-2 line-clamp-6 break-words text-sm leading-6 text-[var(--brand-plum-soft)]/82">
        {value?.trim() || 'No response provided.'}
      </p>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos',
  }).format(date);
}
