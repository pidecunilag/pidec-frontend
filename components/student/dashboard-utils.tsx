import { AlertCircle, CheckCircle2, Clock3, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ActiveStage, Submission, SubmissionStatus, Team, TeamInvite, User } from '@/lib/types';

export const STAGE_META = {
  1: {
    label: 'Stage 1',
    title: 'Concept Proposal',
    shortTitle: 'Proposal',
  },
  2: {
    label: 'Stage 2',
    title: 'Prototype Development',
    shortTitle: 'Prototype',
  },
  3: {
    label: 'Stage 3',
    title: 'Grand Finale',
    shortTitle: 'Finale',
  },
} as const;

export function PageHero({
  title,
  description,
  children,
}: {
  kicker?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,220,255,0.78)_56%,rgba(196,240,255,0.58)_100%)] p-6 shadow-[0_24px_70px_rgba(42,0,59,0.08)] sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StudentPanel({
  title,
  description,
  children,
  action,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-2xl border bg-white/88 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]', className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-12 text-center">
      <FileText className="mx-auto h-10 w-10 text-[var(--brand-purple)]" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: SubmissionStatus | Team['status'] | User['verificationStatus'] }) {
  const labels: Record<string, string> = {
    not_submitted: 'Not submitted',
    submitted: 'Submitted',
    under_review: 'Under review',
    feedback_available: 'Feedback ready',
    active: 'Active',
    disqualified: 'Disqualified',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    flagged: 'Flagged',
    suspended: 'Suspended',
  };
  const tone = ['verified', 'active', 'submitted', 'feedback_available'].includes(status)
    ? 'bg-[rgba(18,183,234,0.12)] text-[#0b6f91]'
    : ['disqualified', 'rejected', 'suspended'].includes(status)
      ? 'bg-[rgba(214,64,69,0.12)] text-[#b91c1c]'
      : 'bg-[rgba(142,77,255,0.13)] text-[var(--brand-plum)]';

  return <Badge className={cn('border-0', tone)}>{labels[status] ?? status}</Badge>;
}

export function StageStepper({ activeStage }: { activeStage: ActiveStage | null | undefined }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[1, 2, 3].map((stage) => {
        const isActive = activeStage === stage;
        const isComplete = typeof activeStage === 'number' && activeStage > stage;
        const meta = STAGE_META[stage as 1 | 2 | 3];

        return (
          <div
            key={stage}
            className={cn(
              'rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-1',
              isActive
                ? 'border-[rgba(255,85,0,0.28)] bg-[linear-gradient(135deg,rgba(255,85,0,0.1),rgba(142,77,255,0.08))]'
                : 'bg-white/78',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-plum-soft)]/65">
                {meta.label}
              </span>
              {isComplete ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)]" />
              ) : isActive ? (
                <Clock3 className="h-4 w-4 text-[var(--brand-orange)]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-[var(--brand-purple)]/50" />
              )}
            </div>
            <p className="mt-2 font-heading text-lg font-semibold text-[var(--brand-plum)]">
              {meta.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isComplete ? 'Completed' : isActive ? 'Current stage' : 'Upcoming'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function getStageSubmission(submissions: Submission[], stage: 1 | 2 | 3) {
  return submissions.find((submission) => submission.stage === stage) ?? null;
}

export function isTeamLeader(team: Team | null, user: User | null | undefined) {
  return Boolean(team && user && team.leaderId === user.id);
}

export function isInviteExpired(invite: TeamInvite) {
  return new Date(invite.expiresAt).getTime() <= Date.now();
}

export function formatDateTime(value?: string | null) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
