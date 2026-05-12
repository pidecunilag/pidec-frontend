'use client';

import { useState } from 'react';
import { Search, ShieldCheck, Trash2, UserPlus, Users2 } from 'lucide-react';
import { toast } from 'sonner';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  EmptyState,
  PageHero,
  StatusBadge,
  StudentPanel,
  formatDateTime,
  isInviteExpired,
  isTeamLeader,
} from '@/components/student/dashboard-utils';
import { extractApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEdition } from '@/lib/hooks/use-edition';
import { useTeam } from '@/lib/hooks/use-team';

export default function StudentTeamPage() {
  const { user } = useAuth();
  const { edition } = useEdition();
  const {
    team,
    invites,
    isLoading,
    searchTeammates,
    searchResults,
    isSearching,
    createTeam,
    sendInvite,
    acceptInvite,
    declineInvite,
    removeMember,
    dissolveTeam,
  } = useTeam();
  const [teamName, setTeamName] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [confirmDissolve, setConfirmDissolve] = useState(false);
  const leader = isTeamLeader(team, user);
  const locked = Boolean(edition?.teamManagementLocked);

  const runAction = async (key: string, action: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setBusy(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    searchTeammates(value);
  };

  const handleSendInvite = async (studentId: string) => {
    setBusy(`invite-${studentId}`);
    try {
      await sendInvite(studentId);
      setSearch('');
      searchTeammates('');
      toast.success('Invite sent.');
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHero
        title="Build your PIDEC team"
        description="Create your team, manage invites, and keep your members ready before team management locks."
      />

      {locked ? (
        <div className="rounded-2xl border border-[rgba(255,85,0,0.22)] bg-[rgba(255,85,0,0.08)] p-4 text-sm font-medium text-[var(--brand-plum)]">
          Team management is locked. Existing pending invites can still be accepted, but leaders cannot send new invites or remove members.
        </div>
      ) : null}

      <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <StudentPanel
          title={team ? team.name : 'Create Team'}
          description={team ? 'Your current team and member list.' : 'Verified students can create one team for their department.'}
          action={team ? <StatusBadge status={team.status} /> : undefined}
          className="min-w-0"
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : team ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[rgba(142,77,255,0.08)] p-4">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{team.department}</p>
                </div>
                <div className="rounded-xl bg-[rgba(18,183,234,0.1)] p-4">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="font-medium">{team.members?.length ?? team.memberCount ?? 1}/6</p>
                </div>
                <div className="rounded-xl bg-[rgba(255,85,0,0.1)] p-4">
                  <p className="text-xs text-muted-foreground">Your role</p>
                  <p className="font-medium">{leader ? 'Leader' : 'Member'}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border bg-white/80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Matric</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(team.members ?? []).map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </TableCell>
                        <TableCell>{member.matricNumber}</TableCell>
                        <TableCell>{member.level}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'leader' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {leader && member.id !== user?.id && !locked ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setRemoveTarget(member.id)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">No action</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(team.members?.length ?? 0) === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Member details are not available yet.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>

              {leader && !locked ? (
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDissolve(true)}
                  disabled={busy === 'dissolve'}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Dissolve team
                </Button>
              ) : null}
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!teamName.trim()) return toast.error('Team name is required.');
                runAction('create', () => createTeam(teamName.trim()), 'Team created.');
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="team-name">Team name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="Enter your team name"
                  disabled={busy === 'create'}
                />
              </div>
              <Button type="submit" disabled={busy === 'create' || locked}>
                <Users2 className="mr-2 h-4 w-4" />
                {busy === 'create' ? 'Creating team...' : 'Create team'}
              </Button>
            </form>
          )}
        </StudentPanel>

        <StudentPanel
          title="Pending Invites"
          description="Invites expire after 48 hours and refresh automatically."
          className="min-w-0"
        >
          {invites.length === 0 ? (
            <EmptyState
              title="No pending invites"
              description="When a team leader invites you, it will appear here."
            />
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => {
                const expired = isInviteExpired(invite);
                return (
                  <div key={invite.id} className="rounded-xl border bg-white/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{invite.teamName ?? 'Team invite'}</p>
                        <p className="text-sm text-muted-foreground">
                          From {invite.inviterName ?? 'team leader'} · expires {formatDateTime(invite.expiresAt)}
                        </p>
                      </div>
                      <Badge variant={expired ? 'destructive' : 'secondary'}>
                        {expired ? 'Expired' : invite.status}
                      </Badge>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        disabled={expired || busy === `accept-${invite.id}`}
                        onClick={() => runAction(`accept-${invite.id}`, () => acceptInvite(invite.id), 'Invite accepted.')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={expired || busy === `decline-${invite.id}`}
                        onClick={() => runAction(`decline-${invite.id}`, () => declineInvite(invite.id), 'Invite declined.')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </StudentPanel>
      </div>

      {team && leader ? (
        <StudentPanel
          title="Invite Teammates"
          description="Search verified, teamless students from your department."
          className="w-full"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-purple)]" />
            <Input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search by name"
              className="pl-10"
              disabled={locked}
            />
          </div>

          <div className="mt-4 grid gap-3">
            {isSearching ? <Skeleton className="h-16 w-full rounded-xl" /> : null}
            {!isSearching && search.length >= 2 && searchResults.length === 0 ? (
              <p className="rounded-xl border bg-white/80 p-4 text-sm text-muted-foreground">
                No eligible teammates found for this search.
              </p>
            ) : null}
            {searchResults.map((student) => (
              <div key={student.id} className="flex flex-col gap-3 rounded-xl border bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {student.email ? <span>{student.email}</span> : null}
                    {student.department ? <span>{student.department}</span> : null}
                    {student.verificationStatus ? (
                      <Badge variant="secondary" className="capitalize">
                        {student.verificationStatus}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={locked || busy === `invite-${student.id}`}
                  onClick={() => handleSendInvite(student.id)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </div>
            ))}
          </div>
        </StudentPanel>
      ) : null}

      <StudentPanel
        title="Eligibility Rules"
        description="PIDEC team rules are enforced by the platform."
        className="w-full"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {['3 to 6 verified students', 'Same department only', 'Leader submits for the team'].map((rule) => (
            <div key={rule} className="flex items-center gap-3 rounded-xl bg-white/80 p-4">
              <ShieldCheck className="h-5 w-5 text-[var(--brand-cyan)]" />
              <span className="text-sm font-medium">{rule}</span>
            </div>
          ))}
        </div>
      </StudentPanel>

      <AlertDialog open={Boolean(removeTarget)} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the student from your team. You can only do this before team management locks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeTarget) {
                  runAction('remove', () => removeMember(removeTarget), 'Member removed.');
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDissolve} onOpenChange={setConfirmDissolve}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dissolve this team?</AlertDialogTitle>
            <AlertDialogDescription>
              This returns every member to a teamless state. This action is only allowed before the Stage 1 lock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => runAction('dissolve', () => dissolveTeam(team?.id), 'Team dissolved.')}>
              Dissolve team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
