'use client';

import { useDeferredValue, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  RotateCcw,
  Search,
  TicketCheck,
  UserCheck,
  Users,
} from 'lucide-react';

import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { StatCard } from '@/components/admin/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useExportFinaleRegistrations,
  useFinaleRegistrations,
  useSetFinaleAdmission,
} from '@/lib/hooks/use-admin';
import type { FinaleRegistration } from '@/lib/types';

const PAGE_SIZE = 25;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function FinaleRegistrationsPage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<'all' | 'admitted' | 'awaiting'>('all');
  const [page, setPage] = useState(1);
  const [undoTarget, setUndoTarget] = useState<FinaleRegistration | null>(null);

  const { data, isPending, isFetching } = useFinaleRegistrations({
    ...(deferredSearch ? { q: deferredSearch } : {}),
    status,
    page,
    limit: PAGE_SIZE,
  });
  const admission = useSetFinaleAdmission();
  const exportList = useExportFinaleRegistrations();
  const registrations = data?.registrations ?? [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  function admit(registration: FinaleRegistration) {
    admission.mutate({ registrationId: registration.id, admitted: true });
  }

  function reverseAdmission() {
    if (!undoTarget) return;
    admission.mutate(
      { registrationId: undoTarget.id, admitted: false },
      { onSettled: () => setUndoTarget(null) },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--brand-purple)]">Grand Finale</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal">Attendee registrations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search attendees, admit them at the venue, and monitor entry numbers.
          </p>
        </div>
        <Button variant="outline" onClick={() => exportList.mutate()} disabled={exportList.isPending} className="bg-white">
          {exportList.isPending ? <Loader2 className="animate-spin" /> : <Download />}
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total registered" value={stats?.total} icon={Users} isLoading={isPending} description="All confirmed attendees" />
        <StatCard label="Admitted" value={stats?.admitted} icon={UserCheck} isLoading={isPending} description="Checked in at the venue" />
        <StatCard label="Awaiting admission" value={stats?.awaiting} icon={Clock3} isLoading={isPending} description="Registered but not checked in" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, phone, or reg number"
            className="h-10 bg-white pl-9"
          />
          {isFetching && !isPending ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" /> : null}
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as typeof status);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-full bg-white sm:w-[190px]">
            <SelectValue placeholder="Admission status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All attendees</SelectItem>
            <SelectItem value="awaiting">Awaiting admission</SelectItem>
            <SelectItem value="admitted">Admitted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : registrations.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-[var(--brand-plum)]/15 bg-white/55 px-6 text-center">
          <TicketCheck className="h-10 w-10 text-[var(--brand-purple)]" />
          <p className="mt-4 font-semibold">No registrations found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try another search or admission status.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[var(--brand-plum)]/10 bg-white shadow-[0_14px_36px_rgba(42,0,59,0.05)]">
          <Table>
            <TableHeader className="bg-[#f6f1fa]">
              <TableRow>
                <TableHead className="px-4">Registration</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => {
                const isThisUpdating = admission.isPending && admission.variables?.registrationId === registration.id;
                return (
                  <TableRow key={registration.id}>
                    <TableCell className="px-4 font-mono text-xs font-semibold text-[var(--brand-purple)]">{registration.registrationNumber}</TableCell>
                    <TableCell className="font-semibold">{registration.fullName}</TableCell>
                    <TableCell>
                      <p className="text-sm">{registration.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{registration.phone}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(registration.createdAt)}</TableCell>
                    <TableCell>
                      {registration.admittedAt ? (
                        <div>
                          <Badge className="bg-[#e4f8ee] text-[#12643d] hover:bg-[#e4f8ee]"><CheckCircle2 />Admitted</Badge>
                          <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(registration.admittedAt)}</p>
                        </div>
                      ) : (
                        <Badge variant="secondary"><Clock3 />Awaiting</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      {registration.admittedAt ? (
                        <Button variant="ghost" size="sm" title="Reverse admission" aria-label={`Reverse admission for ${registration.fullName}`} onClick={() => setUndoTarget(registration)} disabled={isThisUpdating}>
                          <RotateCcw />Undo
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => admit(registration)} disabled={isThisUpdating} className="bg-[#167447] text-white hover:bg-[#105f3a]">
                          {isThisUpdating ? <Loader2 className="animate-spin" /> : <UserCheck />}
                          Admit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination && pagination.total > 0 ? (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Page {pagination.page} of {pagination.totalPages} · {pagination.total} result{pagination.total === 1 ? '' : 's'}</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))} className="bg-white">Previous</Button>
            <Button variant="outline" disabled={page >= pagination.totalPages || isFetching} onClick={() => setPage((current) => current + 1)} className="bg-white">Next</Button>
          </div>
        </div>
      ) : null}

      <ConfirmationDialog
        open={Boolean(undoTarget)}
        onOpenChange={(open) => !open && setUndoTarget(null)}
        title="Reverse admission?"
        description={`${undoTarget?.fullName ?? 'This attendee'} will return to awaiting admission. The correction will be logged.`}
        confirmLabel="Reverse admission"
        onConfirm={reverseAdmission}
        isDestructive
        isLoading={admission.isPending}
      />
    </div>
  );
}
