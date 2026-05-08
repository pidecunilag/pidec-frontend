'use client';

import { useMemo, useState } from 'react';
import { Search, Send, Eye } from 'lucide-react';

import {
  useAdminSubmissions,
  useAdminTeams,
  usePublishFeedback,
  usePublishBulkFeedback,
} from '@/lib/hooks/use-admin';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Naming nuance: the admin filter param is 'feedback_published' (action-shaped),
// but the persisted Submission.status is 'feedback_available' (state-shaped, what teams see).
// Use the entity status here since this is a runtime check against fetched data.
const PUBLISHED_STATUS = 'feedback_available' as const;

export default function FeedbackPage() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [statusFilter, setStatusFilter] = useState('unpublished');

  const params = {
    ...(search && { q: search }),
    ...(stage !== 'all' && { stage: Number(stage) }),
    ...(statusFilter !== 'all' && statusFilter !== 'unpublished' && {
      status: statusFilter as 'submitted' | 'under_review' | 'feedback_published',
    }),
  };

  const { data: submissionsData, isPending: submissionsLoading } = useAdminSubmissions(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const { data: teamsData } = useAdminTeams();

  const publish = usePublishFeedback();
  const publishBulk = usePublishBulkFeedback();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [singleId, setSingleId] = useState<string | null>(null);

  const submissions = submissionsData?.data ?? [];

  // Build a teamId → team name lookup so the table reads as something a human recognises.
  const teamNameById = useMemo(() => {
    const map = new Map<string, string>();
    teamsData?.data?.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [teamsData]);

  // The 'unpublished' filter is purely client-side — the backend doesn't have a single status
  // for "anything not yet published," so we filter the result.
  const visible = useMemo(() => {
    if (statusFilter !== 'unpublished') return submissions;
    return submissions.filter((s) => s.status !== PUBLISHED_STATUS);
  }, [submissions, statusFilter]);

  const eligibleIds = visible
    .filter((s) => s.status !== PUBLISHED_STATUS)
    .map((s) => s.id);

  const allEligibleSelected =
    eligibleIds.length > 0 && eligibleIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allEligibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligibleIds));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkPublish() {
    publishBulk.mutate(
      { submissionIds: Array.from(selected) },
      {
        onSettled: () => {
          setSelected(new Set());
          setBulkOpen(false);
        },
      },
    );
  }

  function handleSinglePublish() {
    if (!singleId) return;
    publish.mutate(singleId, {
      onSettled: () => setSingleId(null),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedback Publishing</h2>
          <p className="text-muted-foreground">
            Review scored submissions and publish feedback to teams.
          </p>
        </div>
        {selected.size > 0 && (
          <Button onClick={() => setBulkOpen(true)} disabled={publishBulk.isPending}>
            <Send className="mr-2 h-4 w-4" />
            Publish {selected.size} selected
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by team or stage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="1">Stage 1</SelectItem>
            <SelectItem value="2">Stage 2</SelectItem>
            <SelectItem value="3">Stage 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="unpublished">Unpublished</SelectItem>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="feedback_published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {submissionsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {statusFilter === 'unpublished'
              ? 'All feedback has been published. Switch the filter to see published submissions.'
              : 'No submissions match the current filters.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-10">
                    <Checkbox
                      checked={allEligibleSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all eligible"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Team</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Submitted</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((s) => {
                  const isPublished = s.status === PUBLISHED_STATUS;
                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.has(s.id)}
                          onCheckedChange={() => toggleOne(s.id)}
                          disabled={isPublished}
                          aria-label="Select submission"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {teamNameById.get(s.teamId) ?? s.teamId}
                      </td>
                      <td className="px-4 py-3">Stage {s.stage}</td>
                      <td className="px-4 py-3">
                        <Badge variant={isPublished ? 'default' : 'secondary'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" disabled>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isPublished || publish.isPending}
                            onClick={() => setSingleId(s.id)}
                          >
                            {isPublished ? 'Published' : 'Publish'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={singleId !== null}
        onOpenChange={(open) => !open && setSingleId(null)}
        title="Publish Feedback"
        description="The team will be notified by email and see scores on their dashboard. This cannot be unpublished."
        confirmLabel="Publish"
        onConfirm={handleSinglePublish}
        isLoading={publish.isPending}
      />

      <ConfirmationDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title={`Publish feedback for ${selected.size} teams`}
        description="Each selected team will be notified by email and see their scores immediately. This action cannot be undone."
        confirmLabel="Publish All"
        onConfirm={handleBulkPublish}
        isLoading={publishBulk.isPending}
      />
    </div>
  );
}
