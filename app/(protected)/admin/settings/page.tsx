'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  useAdminEdition,
  useUpdateEdition,
  useSetActiveStage,
  useToggleSignup,
  useToggleSubmissionWindow,
  useToggleTeamLock,
  useLaunchStage1Results,
} from '@/lib/hooks/use-admin';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ActiveStage, Edition, UpdateEditionRequest } from '@/lib/types';

export default function SettingsPage() {
  const { data: edition, isPending: editionLoading } = useAdminEdition();

  const updateEdition = useUpdateEdition();
  const setStage = useSetActiveStage();
  const toggleSignup = useToggleSignup();
  const toggleSubmission = useToggleSubmissionWindow();
  const toggleTeamLock = useToggleTeamLock();
  const launchStage1Results = useLaunchStage1Results();

  const [stageDialog, setStageDialog] = useState<ActiveStage | null>(null);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [launchPassword, setLaunchPassword] = useState('');
  const [launchReport, setLaunchReport] = useState<unknown>(null);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Competition Settings</h2>
        <p className="text-muted-foreground">
          Control the competition lifecycle — stages, registrations, and submission windows.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border p-6">
        <h3 className="text-lg font-semibold">Edition Info</h3>
        {editionLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : edition ? (
          <EditionInfoForm
            key={edition.id}
            edition={edition}
            updateEdition={updateEdition}
          />
        ) : null}
      </section>

      <section className="space-y-4 rounded-xl border p-6">
        <h3 className="text-lg font-semibold">Platform Controls</h3>
        {editionLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <ToggleCard
              label="Student Registrations"
              description="When closed, new students cannot create accounts."
              checked={edition?.signupOpen ?? false}
              onCheckedChange={(open) => toggleSignup.mutate({ open })}
              isPending={toggleSignup.isPending}
            />
            <ToggleCard
              label="Submission Window"
              description="Controls whether teams can submit for the current active stage."
              checked={edition?.submissionWindowOpen ?? false}
              onCheckedChange={(open) => toggleSubmission.mutate({ open })}
              isPending={toggleSubmission.isPending}
            />
            <ToggleCard
              label="Team Management Lock"
              description="When locked, no new invites or team changes. Existing invites can still be accepted."
              checked={edition?.teamManagementLocked ?? false}
              onCheckedChange={(locked) => toggleTeamLock.mutate({ open: locked })}
              isPending={toggleTeamLock.isPending}
            />
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border p-6">
        <h3 className="text-lg font-semibold">Active Stage</h3>
        <p className="text-sm text-muted-foreground">
          Setting a new stage updates all student dashboards immediately.
          {edition && (
            <span className="block mt-1 text-foreground">
              Current: <span className="font-medium">Stage {edition.activeStage}</span>
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <Select
            value={edition ? String(edition.activeStage) : undefined}
            onValueChange={(v) => setStageDialog(Number(v) as ActiveStage)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Pre-Competition</SelectItem>
              <SelectItem value="1">Stage 1</SelectItem>
              <SelectItem value="2">Stage 2</SelectItem>
              <SelectItem value="3">Stage 3 (Finale)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-red-200 bg-red-50/50 p-6">
        <div>
          <h3 className="text-lg font-semibold text-red-950">Stage 1 Results Launch</h3>
          <p className="mt-1 text-sm text-red-900/75">
            This sends the Stage 1 results announcement to all registered students,
            sends congratulatory emails to the Top 10 team leads, promotes those
            teams to Stage 2, publishes their reviews, and sets the platform active
            stage to Stage 2. Keep this page open while it runs.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setLaunchDialogOpen(true)}
          disabled={launchStage1Results.isPending}
        >
          {launchStage1Results.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Launch Stage 1 Results
        </Button>
        {launchReport ? <LaunchReportSummary report={launchReport} /> : null}
      </section>

      <ConfirmationDialog
        // stageDialog can be 0 (Pre-Competition) — explicit null check, not truthy.
        open={stageDialog !== null}
        onOpenChange={(open) => !open && setStageDialog(null)}
        title="Change Active Stage"
        description={`Set the competition to stage ${stageDialog}? This immediately updates every dashboard.`}
        confirmLabel="Set Stage"
        onConfirm={() => {
          if (stageDialog !== null) {
            setStage.mutate(
              { stage: stageDialog },
              { onSettled: () => setStageDialog(null) },
            );
          }
        }}
        isLoading={setStage.isPending}
      />

      <ConfirmationDialog
        open={launchDialogOpen}
        onOpenChange={(open) => {
          setLaunchDialogOpen(open);
          if (!open) setLaunchPassword('');
        }}
        title="Launch Stage 1 Results"
        description="Enter your admin password to confirm. This will send emails, promote the Top 10, publish reviews, and move the platform to Stage 2."
        confirmLabel="Launch results"
        isDestructive
        confirmDisabled={!launchPassword.trim()}
        isLoading={launchStage1Results.isPending}
        onConfirm={() => {
          launchStage1Results.mutate(
            { password: launchPassword },
            {
              onSuccess: (data) => {
                setLaunchReport(data.report);
                setLaunchDialogOpen(false);
                setLaunchPassword('');
              },
            },
          );
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="launch-password">Admin password</Label>
          <Input
            id="launch-password"
            type="password"
            value={launchPassword}
            onChange={(event) => setLaunchPassword(event.target.value)}
            placeholder="Re-enter your password"
            autoComplete="current-password"
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
}

function LaunchReportSummary({ report }: { report: unknown }) {
  const data = report as {
    totals?: {
      generalRecipients?: number;
      teamLeadRecipients?: number;
      liveGeneralSent?: number;
      liveLeadSent?: number;
      liveGeneralFailed?: number;
      liveLeadFailed?: number;
      topTeams?: number;
    };
    edition?: {
      activeStageAfterLiveRun?: number | string;
    };
  };

  const totals = data.totals ?? {};

  return (
    <div className="grid gap-2 rounded-lg border bg-white/80 p-4 text-sm md:grid-cols-2">
      <p><span className="font-medium">General recipients:</span> {totals.generalRecipients ?? '-'}</p>
      <p><span className="font-medium">Team lead recipients:</span> {totals.teamLeadRecipients ?? '-'}</p>
      <p><span className="font-medium">General sent:</span> {totals.liveGeneralSent ?? '-'}</p>
      <p><span className="font-medium">Team lead sent:</span> {totals.liveLeadSent ?? '-'}</p>
      <p><span className="font-medium">General failed:</span> {totals.liveGeneralFailed ?? '-'}</p>
      <p><span className="font-medium">Team lead failed:</span> {totals.liveLeadFailed ?? '-'}</p>
      <p><span className="font-medium">Top teams:</span> {totals.topTeams ?? '-'}</p>
      <p><span className="font-medium">Active stage:</span> {data.edition?.activeStageAfterLiveRun ?? '-'}</p>
    </div>
  );
}

function EditionInfoForm({
  edition,
  updateEdition,
}: {
  edition: Edition;
  updateEdition: ReturnType<typeof useUpdateEdition>;
}) {
  const [editionName, setEditionName] = useState(edition.name);
  const [theme, setTheme] = useState(edition.theme);
  const [banner, setBanner] = useState(edition.announcementBanner ?? '');

  function handleEditionSave() {
    const data: UpdateEditionRequest = {};
    if (editionName !== edition.name) data.name = editionName;
    if (theme !== edition.theme) data.theme = theme;
    const trimmedBanner = banner.trim();
    const currentBanner = edition.announcementBanner ?? '';
    if (trimmedBanner !== currentBanner) {
      data.announcementBanner = trimmedBanner || null;
    }
    if (Object.keys(data).length === 0) return;
    updateEdition.mutate(data);
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="edition-name">Edition Name</Label>
        <Input
          id="edition-name"
          placeholder="PIDEC 1.0"
          value={editionName}
          onChange={(e) => setEditionName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Input
          id="theme"
          placeholder="Engineering for Sustainable Development"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner">Announcement Banner</Label>
        <Input
          id="banner"
          placeholder="Optional platform-wide announcement"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Shown on all dashboards. Leave empty to clear.
        </p>
      </div>
      <Button
        onClick={handleEditionSave}
        disabled={updateEdition.isPending}
        className="w-fit"
      >
        {updateEdition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onCheckedChange,
  isPending,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={isPending} />
    </div>
  );
}
