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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Platform overview and quick actions for {edition?.name ?? 'PIDEC'}.
        </p>
      </div>

      {edition && (
        <section className="rounded-xl border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Active Edition
              </p>
              <h3 className="mt-1 text-lg font-semibold">{edition.name}</h3>
              <p className="text-sm text-muted-foreground">{edition.theme}</p>
            </div>
            <Badge variant="secondary">Stage {edition.activeStage}</Badge>
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
            <p className="rounded-md bg-muted p-3 text-sm">
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
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
