'use client';

import Link from 'next/link';
import { Bell, FileCheck2, FileText, Trophy, Users2, X } from 'lucide-react';

import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  PageHero,
  StageStepper,
  StatusBadge,
  StudentPanel,
  formatDateTime,
  getStageSubmission,
  isTeamLeader,
} from '@/components/student/dashboard-utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEdition } from '@/lib/hooks/use-edition';
import { useFeedback } from '@/lib/hooks/use-feedback';
import { useLocalStorageState } from '@/lib/hooks/use-local-storage';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { useSubmissions } from '@/lib/hooks/use-submissions';
import { useTeam } from '@/lib/hooks/use-team';

const PLATFORM_GUIDE_EMBED_URL = 'https://www.loom.com/embed/8c2873e3177d48eb843a4a69d44d93dd';
const PLATFORM_GUIDE_DISMISSED_KEY = 'pidec_platform_guide_dismissed';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { edition, announcementBanner, isLoading: editionLoading } = useEdition();
  const { team, invites, isLoading: teamLoading } = useTeam();
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const { feedback } = useFeedback();
  const { unreadCount } = useNotifications();
  const [guideDismissed, setGuideDismissed] = useLocalStorageState(
    PLATFORM_GUIDE_DISMISSED_KEY,
    false,
  );
  const activeStage = edition?.activeStage === 1 || edition?.activeStage === 2 || edition?.activeStage === 3
    ? edition.activeStage
    : null;
  const activeSubmission = activeStage ? getStageSubmission(submissions, activeStage) : null;
  const leader = isTeamLeader(team, user);

  return (
    <div className="space-y-8">
      <PageHero
        title={`Welcome${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
        description="Track your team, stage progress, submissions, feedback, and PIDEC notifications from one place."
      >
        <Button asChild>
          <Link href={team ? '/dashboard/submissions' : '/dashboard/team'}>
            {team ? 'Open submissions' : 'Create or join team'}
          </Link>
        </Button>
      </PageHero>

      {announcementBanner ? (
        <div className="rounded-2xl border border-[rgba(255,85,0,0.22)] bg-[rgba(255,85,0,0.08)] p-4 text-sm font-medium text-[var(--brand-plum)]">
          {announcementBanner}
        </div>
      ) : null}

      {team?.status === 'disqualified' ? (
        <div className="rounded-2xl border border-[rgba(214,64,69,0.2)] bg-[rgba(214,64,69,0.1)] p-4 text-sm font-medium text-[#9f1d24]">
          Your team was disqualified at Stage {team.disqualifiedAtStage ?? team.currentStage}. You can still view eligible submissions and feedback.
        </div>
      ) : null}

      {!guideDismissed ? (
        <StudentPanel
          title="How to use the platform"
          description="Watch this quick guide before creating a team, accepting invites, or submitting your stage work."
          action={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Hide platform guide video"
              className="h-9 w-9 rounded-xl text-[var(--brand-plum-soft)] hover:bg-[rgba(42,0,59,0.06)] hover:text-[var(--brand-plum)]"
              onClick={() => setGuideDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="overflow-hidden rounded-2xl border border-[rgba(42,0,59,0.1)] bg-black shadow-[0_18px_44px_rgba(42,0,59,0.08)]">
            <iframe
              src={PLATFORM_GUIDE_EMBED_URL}
              title="How to use the PIDEC platform"
              className="aspect-video w-full"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </StudentPanel>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Team"
          value={team?.name ?? 'No team'}
          icon={Users2}
          description={team ? (leader ? 'You are team leader' : 'Team member') : 'Create or accept an invite'}
          isLoading={teamLoading}
        />
        <StatCard
          label="Active Stage"
          value={editionLoading ? undefined : activeStage ? `Stage ${activeStage}` : 'Pre stage'}
          icon={Trophy}
          description={edition?.submissionWindowOpen ? 'Submission window open' : 'Submission window closed'}
          isLoading={editionLoading}
        />
        <StatCard
          label="Submissions"
          value={submissions.length}
          icon={FileText}
          description={activeSubmission ? `Latest: ${activeSubmission.status.replaceAll('_', ' ')}` : 'No active submission yet'}
          isLoading={submissionsLoading}
        />
        <StatCard
          label="Updates"
          value={unreadCount}
          icon={Bell}
          description={`${feedback.length} published feedback item${feedback.length === 1 ? '' : 's'}`}
        />
      </div>

      <StudentPanel
        title="Competition Progress"
        description={edition?.theme ?? 'PIDEC 1.0 stage progression'}
      >
        <StageStepper activeStage={edition?.activeStage} />
      </StudentPanel>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <StudentPanel
          title="Current Team Status"
          description="Your team eligibility and next competition action."
          action={team ? <StatusBadge status={team.status} /> : undefined}
        >
          {teamLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : team ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Team name</p>
                <p className="font-heading text-2xl font-semibold text-[var(--brand-plum)]">{team.name}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[rgba(142,77,255,0.08)] p-3">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{team.department}</p>
                </div>
                <div className="rounded-xl bg-[rgba(18,183,234,0.1)] p-3">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="font-medium">{team.members?.length ?? team.memberCount ?? 1}/6</p>
                </div>
                <div className="rounded-xl bg-[rgba(255,85,0,0.1)] p-3">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium">{leader ? 'Leader' : 'Member'}</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="You are not in a team yet"
              description="Create a team for your department or accept a pending invite to join one."
            >
              <Button asChild>
                <Link href="/dashboard/team">Go to team workspace</Link>
              </Button>
            </EmptyState>
          )}
        </StudentPanel>

        <StudentPanel
          title="Next Action"
          description="The most important thing to do right now."
        >
          {!team && invites.length > 0 ? (
            <div className="rounded-xl border bg-white/80 p-4">
              <p className="font-medium">You have {invites.length} pending invite{invites.length === 1 ? '' : 's'}.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/team">Review invites</Link>
              </Button>
            </div>
          ) : activeSubmission ? (
            <div className="rounded-xl border bg-white/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">Stage {activeSubmission.stage} submitted</p>
                <StatusBadge status={activeSubmission.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Submitted {formatDateTime(activeSubmission.submittedAt)}
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard/submissions">View submission</Link>
              </Button>
            </div>
          ) : team && leader && edition?.submissionWindowOpen && activeStage ? (
            <div className="rounded-xl border bg-white/80 p-4">
              <FileCheck2 className="h-8 w-8 text-[var(--brand-orange)]" />
              <p className="mt-3 font-medium">Stage {activeStage} submission is open.</p>
              <p className="mt-1 text-sm text-muted-foreground">Prepare your team response and submit before the deadline.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/submissions">Start submission</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border bg-white/80 p-4">
              <p className="font-medium">Nothing urgent right now.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep your team ready and watch this space for stage updates.
              </p>
            </div>
          )}
        </StudentPanel>
      </div>
    </div>
  );
}
