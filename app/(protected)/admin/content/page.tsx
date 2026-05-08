'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, Pencil, X } from 'lucide-react';

import {
  useAdminSponsors,
  useCreateSponsor,
  useUpdateSponsor,
  useDeleteSponsor,
  useAdminPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  useAdminFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from '@/lib/hooks/use-admin';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { LandingAsset, LandingFaq } from '@/lib/types';

type TabKey = 'sponsors' | 'partners' | 'faqs';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('sponsors');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Landing Page Content</h2>
        <p className="text-muted-foreground">
          Manage sponsors, partners, and FAQs displayed on the public landing page.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {(['sponsors', 'partners', 'faqs'] as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'sponsors' && <AssetTab kind="sponsors" />}
      {activeTab === 'partners' && <AssetTab kind="partners" />}
      {activeTab === 'faqs' && <FaqsTab />}
    </div>
  );
}

// Sponsors and Partners share an identical CRUD shape; one component handles both via the kind prop.
function AssetTab({ kind }: { kind: 'sponsors' | 'partners' }) {
  // Hook tuples differ only by name — pick at the call site.
  const sponsorsList = useAdminSponsors();
  const sponsorsCreate = useCreateSponsor();
  const sponsorsUpdate = useUpdateSponsor();
  const sponsorsDelete = useDeleteSponsor();

  const partnersList = useAdminPartners();
  const partnersCreate = useCreatePartner();
  const partnersUpdate = useUpdatePartner();
  const partnersDelete = useDeletePartner();

  const list = kind === 'sponsors' ? sponsorsList : partnersList;
  const create = kind === 'sponsors' ? sponsorsCreate : partnersCreate;
  const update = kind === 'sponsors' ? sponsorsUpdate : partnersUpdate;
  const remove = kind === 'sponsors' ? sponsorsDelete : partnersDelete;

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [editing, setEditing] = useState<LandingAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingAsset | null>(null);

  const items = Array.isArray(list.data) ? list.data : [];
  const label = kind === 'sponsors' ? 'Sponsor' : 'Partner';

  function handleCreate() {
    if (!name || !logoUrl) return;
    create.mutate(
      { name, logoUrl, isActive: true },
      { onSuccess: () => { setName(''); setLogoUrl(''); } },
    );
  }

  function handleSaveEdit() {
    if (!editing) return;
    update.mutate(
      {
        id: editing.id,
        data: {
          name: editing.name,
          logoUrl: editing.logoUrl,
          websiteUrl: editing.websiteUrl ?? null,
          sortOrder: editing.sortOrder,
          isActive: editing.isActive,
        },
      },
      { onSuccess: () => setEditing(null) },
    );
  }

  function handleToggleActive(item: LandingAsset) {
    update.mutate({
      id: item.id,
      data: {
        name: item.name,
        logoUrl: item.logoUrl,
        websiteUrl: item.websiteUrl ?? null,
        sortOrder: item.sortOrder,
        isActive: !item.isActive,
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 rounded-xl border p-4">
        <div className="space-y-1 flex-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`${label} name`} />
        </div>
        <div className="space-y-1 flex-1">
          <Label>Logo URL</Label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button onClick={handleCreate} disabled={create.isPending || !name || !logoUrl}>
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          <span className="ml-2">Add {label}</span>
        </Button>
      </div>

      {list.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No {kind} yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editing?.id === item.id ? (
              <div key={item.id} className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Logo URL</Label>
                    <Input
                      value={editing.logoUrl}
                      onChange={(e) => setEditing({ ...editing, logoUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Website (optional)</Label>
                    <Input
                      value={editing.websiteUrl ?? ''}
                      onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value || null })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={editing.sortOrder}
                      onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={update.isPending}>
                    {update.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logoUrl} alt={item.name} className="h-8 w-8 rounded object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  {item.websiteUrl && (
                    <p className="text-xs text-muted-foreground truncate">{item.websiteUrl}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={() => handleToggleActive(item)}
                      disabled={update.isPending}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${label}`}
        description={`Remove "${deleteTarget?.name}" from the landing page? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            remove.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
          }
        }}
        isDestructive
        isLoading={remove.isPending}
      />
    </div>
  );
}

function FaqsTab() {
  const list = useAdminFaqs();
  const create = useCreateFaq();
  const update = useUpdateFaq();
  const remove = useDeleteFaq();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editing, setEditing] = useState<LandingFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingFaq | null>(null);

  const items = Array.isArray(list.data) ? list.data : [];

  function handleCreate() {
    if (!question || !answer) return;
    create.mutate(
      { question, answer, isActive: true },
      { onSuccess: () => { setQuestion(''); setAnswer(''); } },
    );
  }

  function handleSaveEdit() {
    if (!editing) return;
    update.mutate(
      {
        id: editing.id,
        data: {
          question: editing.question,
          answer: editing.answer,
          sortOrder: editing.sortOrder,
          isActive: editing.isActive,
        },
      },
      { onSuccess: () => setEditing(null) },
    );
  }

  function handleToggleActive(item: LandingFaq) {
    update.mutate({
      id: item.id,
      data: {
        question: item.question,
        answer: item.answer,
        sortOrder: item.sortOrder,
        isActive: !item.isActive,
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 space-y-3">
        <div className="space-y-1">
          <Label>Question</Label>
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What is PIDEC?" />
        </div>
        <div className="space-y-1">
          <Label>Answer</Label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="PIDEC is..."
            rows={3}
          />
        </div>
        <Button onClick={handleCreate} disabled={create.isPending || !question || !answer} className="w-fit">
          {create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add FAQ
        </Button>
      </div>

      {list.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No FAQs yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editing?.id === item.id ? (
              <div key={item.id} className="rounded-lg border p-4 space-y-3">
                <div className="space-y-1">
                  <Label>Question</Label>
                  <Input
                    value={editing.question}
                    onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Answer</Label>
                  <Textarea
                    value={editing.answer}
                    onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={update.isPending}>
                    {update.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{item.question}</p>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Visible' : 'Hidden'}
                    </Badge>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={() => handleToggleActive(item)}
                      disabled={update.isPending}
                    />
                    <Button size="sm" variant="ghost" onClick={() => setEditing(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete FAQ"
        description={`Remove "${deleteTarget?.question}" from the landing page? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            remove.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
          }
        }}
        isDestructive
        isLoading={remove.isPending}
      />
    </div>
  );
}
