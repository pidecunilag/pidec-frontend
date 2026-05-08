'use client';

import { useState } from 'react';
import { Plus, Power, Loader2 } from 'lucide-react';

import { useAdminJudges, useCreateJudge, useDeactivateJudge } from '@/lib/hooks/use-admin';
import { DEPARTMENTS } from '@/lib/constants';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { StageScope } from '@/lib/types';

export default function JudgesPage() {
  const { data, isPending } = useAdminJudges();
  const create = useCreateJudge();
  const deactivate = useDeactivateJudge();

  const [createOpen, setCreateOpen] = useState(false);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [deactivateName, setDeactivateName] = useState('');

  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stageScope, setStageScope] = useState<StageScope>('stage_1');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const judges = data?.data ?? [];

  function handleCreate() {
    if (!name || !email || selectedDepts.length === 0) return;
    create.mutate(
      { name, email, stageScope, assignedDepartments: selectedDepts },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setName(''); setEmail(''); setSelectedDepts([]);
        },
      },
    );
  }

  function toggleDept(dept: string) {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Judge Management</h2>
          <p className="text-muted-foreground">Create and manage judge accounts.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Judge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Judge Account</DialogTitle>
              <DialogDescription>
                The judge will receive login credentials via email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Adebayo" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="judge@example.com" />
              </div>
              <div className="space-y-1">
                <Label>Stage Scope</Label>
                <Select value={stageScope} onValueChange={(v) => setStageScope(v as StageScope)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stage_1">Stage 1</SelectItem>
                    <SelectItem value="stage_2">Stage 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Departments</Label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDept(d)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedDepts.includes(d)
                          ? 'bg-foreground text-background border-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={create.isPending || !name || !email || selectedDepts.length === 0}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : judges.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">No judge accounts yet.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Departments</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {judges.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{j.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.email}</td>
                    <td className="px-4 py-3">{j.stageScope === 'stage_1' ? 'Stage 1' : 'Stage 2'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {j.assignedDepartments.map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={j.isActive ? 'default' : 'secondary'}>
                        {j.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {j.isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => { setDeactivateId(j.id); setDeactivateName(j.name); }}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={deactivateId !== null}
        onOpenChange={(open) => !open && setDeactivateId(null)}
        title="Deactivate Judge"
        description={`Deactivate ${deactivateName}? They will no longer be able to access the judge portal.`}
        confirmLabel="Deactivate"
        onConfirm={() => {
          if (deactivateId) {
            deactivate.mutate(deactivateId, {
              onSettled: () => { setDeactivateId(null); setDeactivateName(''); },
            });
          }
        }}
        isDestructive
        isLoading={deactivate.isPending}
      />
    </div>
  );
}
