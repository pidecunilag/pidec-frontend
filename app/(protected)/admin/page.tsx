'use client';

import {
  Users,
  Users2,
  FileText,
  Gavel,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

import { useAdminOverview } from '@/lib/hooks/use-admin';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminOverviewPage() {
  const { data, isPending } = useAdminOverview();

  const counts = data?.counts;
  const edition = data?.edition;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,220,255,0.78)_56%,rgba(196,240,255,0.58)_100%)] p-7 shadow-[0_24px_70px_rgba(42,0,59,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-orange)]">
          Admin Command
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="max-w-2xl text-muted-foreground">
          Platform overview and quick actions for {edition?.name ?? 'PIDEC'}.
        </p>
      </div>

      {edition && (
        <section className="space-y-4 rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-6 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
                Active Edition
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{edition.name}</h3>
              <p className="text-sm text-muted-foreground">{edition.theme}</p>
            </div>
            <Badge className="rounded-full bg-[var(--brand-plum)] px-3 py-1 text-white">
              Stage {edition.activeStage}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <Badge variant={edition.signupOpen ? 'default' : 'secondary'}>
              {edition.signupOpen ? 'Signups open' : 'Signups closed'}
            </Badge>
            <Badge variant={edition.submissionWindowOpen ? 'default' : 'secondary'}>
              {edition.submissionWindowOpen ? 'Submissions open' : 'Submissions closed'}
            </Badge>
            <Badge variant={edition.teamManagementLocked ? 'destructive' : 'secondary'}>
              {edition.teamManagementLocked ? 'Team mgmt locked' : 'Team mgmt unlocked'}
            </Badge>
          </div>
          {edition.announcementBanner && (
            <p className="rounded-xl border border-[rgba(255,85,0,0.18)] bg-[rgba(255,85,0,0.08)] p-3 text-sm text-[var(--brand-plum)]">
              <strong>Announcement:</strong> {edition.announcementBanner}
            </p>
          )}
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered Users"
          value={counts?.users}
          icon={Users}
          isLoading={isPending}
        />
        <StatCard
          label="Teams"
          value={counts?.teams}
          icon={Users2}
          isLoading={isPending}
        />
        <StatCard
          label="Submissions"
          value={counts?.submissions}
          icon={FileText}
          isLoading={isPending}
        />
        <StatCard
          label="Active Judges"
          value={counts?.activeJudges}
          icon={Gavel}
          isLoading={isPending}
        />
      </div>

      <div className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-6 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
        <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/verifications">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Verification Queue
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Layers className="mr-2 h-4 w-4" />
              Competition Settings
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/students">
              <Users className="mr-2 h-4 w-4" />
              Student Directory
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/teams">
              <Users2 className="mr-2 h-4 w-4" />
              Team Directory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
