'use client';

import { useState } from 'react';
import { Search, ArrowUpRight, Ban, Unlock } from 'lucide-react';

import { useAdminTeams, useTeamAction } from '@/lib/hooks/use-admin';
import { DEPARTMENTS } from '@/lib/constants';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Team, TeamActionRequest } from '@/lib/types';

export default function TeamsPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');

  const params = {
    ...(search && { q: search }),
    ...(department !== 'all' && { department }),
    ...(status !== 'all' && { status: status as 'active' | 'disqualified' | 'under_review' }),
  };

  const { data, isPending } = useAdminTeams(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const teamAction = useTeamAction();

  const [targetTeam, setTargetTeam] = useState<Team | null>(null);
  const [dialogAction, setDialogAction] = useState<'advance' | 'disqualify' | 'unlock' | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [disqualifyStage, setDisqualifyStage] = useState<1 | 2 | 3>(1);

  function openDisqualify(team: Team) {
    setTargetTeam(team);
    setDialogAction('disqualify');
    // Default the eliminated-at stage to whatever stage the team is currently in.
    const current = team.currentStage;
    setDisqualifyStage((current === 2 || current === 3 ? current : 1) as 1 | 2 | 3);
    setDisqualifyReason('');
  }

  const teams = data?.data ?? [];

  function handleAction() {
    if (!targetTeam || !dialogAction) return;

    let payload: TeamActionRequest;
    if (dialogAction === 'advance') {
      payload = { action: 'advance' };
    } else if (dialogAction === 'disqualify') {
      payload = {
        action: 'disqualify',
        reason: disqualifyReason.trim(),
        atStage: disqualifyStage,
      };
    } else {
      payload = { action: 'unlock_submission' };
    }

    teamAction.mutate(
      { teamId: targetTeam.id, data: payload },
      {
        onSettled: () => {
          setTargetTeam(null);
          setDialogAction(null);
          setDisqualifyReason('');
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Team Directory</h2>
        <p className="text-muted-foreground">
          Manage all teams. Advance, disqualify, or unlock submission windows.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by team name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disqualified">Disqualified</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">No teams found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Team</th>
                  <th className="text-left px-4 py-3 font-medium">Department</th>
                  <th className="text-left px-4 py-3 font-medium">Leader</th>
                  <th className="text-left px-4 py-3 font-medium">Members</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3">{t.department}</td>
                    <td className="px-4 py-3">
                      {t.leader ? (
                        <div>
                          <p className="font-medium">{t.leader.name}</p>
                          <p className="text-xs text-muted-foreground">{t.leader.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{t.memberCount ?? t.members?.length ?? 0}</td>
                    <td className="px-4 py-3">Stage {t.currentStage ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge variant={t.status === 'disqualified' ? 'destructive' : t.status === 'under_review' ? 'outline' : 'default'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setTargetTeam(t); setDialogAction('advance'); }}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDisqualify(t)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setTargetTeam(t); setDialogAction('unlock'); }}
                        >
                          <Unlock className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={dialogAction === 'advance'}
        onOpenChange={(open) => !open && setDialogAction(null)}
        title="Advance Team"
        description={`Advance "${targetTeam?.name}" to the next stage?`}
        confirmLabel="Advance"
        onConfirm={handleAction}
        isLoading={teamAction.isPending}
      />

      <ConfirmationDialog
        open={dialogAction === 'disqualify'}
        onOpenChange={(open) => !open && setDialogAction(null)}
        title="Disqualify Team"
        description={`Disqualify "${targetTeam?.name}"? This action is final and visible to team members.`}
        confirmLabel="Disqualify"
        onConfirm={handleAction}
        isDestructive
        isLoading={teamAction.isPending}
        confirmDisabled={!disqualifyReason.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Eliminated at stage</Label>
            <Select
              value={String(disqualifyStage)}
              onValueChange={(v) => setDisqualifyStage(Number(v) as 1 | 2 | 3)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Stage 1</SelectItem>
                <SelectItem value="2">Stage 2</SelectItem>
                <SelectItem value="3">Stage 3 (Finale)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disqualify-reason">Reason (visible to the team)</Label>
            <Textarea
              id="disqualify-reason"
              placeholder="e.g. Submission did not meet minimum scoring threshold."
              value={disqualifyReason}
              onChange={(e) => setDisqualifyReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={dialogAction === 'unlock'}
        onOpenChange={(open) => !open && setDialogAction(null)}
        title="Unlock Submission"
        description={`Unlock the submission window for "${targetTeam?.name}" to allow resubmission?`}
        confirmLabel="Unlock"
        onConfirm={handleAction}
        isLoading={teamAction.isPending}
      />
    </div>
  );
}
