'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { useAdminSubmissions, useAdminTeams } from '@/lib/hooks/use-admin';
import { DEPARTMENTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SubmissionsPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [stage, setStage] = useState('all');

  const params = {
    ...(search && { q: search }),
    ...(department !== 'all' && { department }),
    ...(stage !== 'all' && { stage: Number(stage) }),
  };

  const { data, isPending } = useAdminSubmissions(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const { data: teamsData } = useAdminTeams();

  const submissions = data?.data ?? [];

  const teamNameById = useMemo(() => {
    const map = new Map<string, string>();
    teamsData?.data?.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [teamsData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
        <p className="text-muted-foreground">
          View all team submissions across stages.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="1">Stage 1</SelectItem>
            <SelectItem value="2">Stage 2</SelectItem>
            <SelectItem value="3">Stage 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">No submissions found.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Team</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {teamNameById.get(s.teamId) ?? s.teamId}
                    </td>
                    <td className="px-4 py-3">Stage {s.stage}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === 'submitted' ? 'default' : 'secondary'}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
