import type { LucideIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
}

export function StatCard({ label, value, icon: Icon, description, isLoading }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-3xl font-bold tracking-tight">{value ?? '—'}</p>
        )}
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
