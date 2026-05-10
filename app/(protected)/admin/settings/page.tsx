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

  const [stageDialog, setStageDialog] = useState<ActiveStage | null>(null);

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
