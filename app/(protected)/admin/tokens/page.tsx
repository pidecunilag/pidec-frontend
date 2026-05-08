'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Plus, Check } from 'lucide-react';

import { useAdminTokens, useGenerateToken, useRegenerateToken } from '@/lib/hooks/use-admin';
import { DEPARTMENTS } from '@/lib/constants';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TokensPage() {
  const { data, isPending } = useAdminTokens();
  const generate = useGenerateToken();
  const regenerate = useRegenerateToken();

  const [selectedDept, setSelectedDept] = useState('');
  const [regenDept, setRegenDept] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tokens = data?.data ?? [];

  function handleGenerate() {
    if (!selectedDept) return;
    generate.mutate({ department: selectedDept }, {
      onSuccess: () => setSelectedDept(''),
    });
  }

  function copyToken(tokenString: string, id: string) {
    navigator.clipboard.writeText(tokenString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submission Tokens</h2>
        <p className="text-muted-foreground">
          Generate and manage department submission tokens for Stage 1.
        </p>
      </div>

      {/* Generate */}
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerate} disabled={!selectedDept || generate.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Token
        </Button>
      </div>

      {/* Token List */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">No tokens generated yet.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Department</th>
                  <th className="text-left px-4 py-3 font-medium">Token</th>
                  <th className="text-left px-4 py-3 font-medium">Uses</th>
                  <th className="text-left px-4 py-3 font-medium">Last Used</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tokens.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{t.department}</td>
                    <td className="px-4 py-3 font-mono text-xs">{t.tokenString}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{t.useCount}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.lastUsedAt ? new Date(t.lastUsedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToken(t.tokenString, t.id)}
                        >
                          {copiedId === t.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRegenDept(t.department)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
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
        open={regenDept !== null}
        onOpenChange={(open) => !open && setRegenDept(null)}
        title="Regenerate Token"
        description={`Regenerate the submission token for ${regenDept}? The old token will be invalidated.`}
        confirmLabel="Regenerate"
        onConfirm={() => {
          if (regenDept) {
            regenerate.mutate({ department: regenDept }, {
              onSettled: () => setRegenDept(null),
            });
          }
        }}
        isDestructive
        isLoading={regenerate.isPending}
      />
    </div>
  );
}
