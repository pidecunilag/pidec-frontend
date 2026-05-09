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
    <div className="group rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/88 p-6 shadow-[0_18px_44px_rgba(42,0,59,0.07)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(142,77,255,0.22)] hover:shadow-[0_24px_56px_rgba(42,0,59,0.1)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]/70">
          {label}
        </p>
        <div className="rounded-xl bg-[linear-gradient(135deg,rgba(142,77,255,0.14),rgba(18,183,234,0.12))] p-2.5 text-[var(--brand-purple)] transition-colors group-hover:text-[var(--brand-plum)]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <Skeleton className="h-9 w-24 rounded-lg" />
        ) : (
          <p className="font-heading text-4xl font-semibold tracking-normal text-[var(--brand-plum)]">
            {value ?? '-'}
          </p>
        )}
        {description && (
          <p className="mt-2 text-sm text-[var(--brand-plum-soft)]/70">{description}</p>
        )}
      </div>
    </div>
  );
}
