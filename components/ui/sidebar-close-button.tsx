'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function SidebarCloseButton({ className }: { className?: string }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Close sidebar"
      title="Close sidebar"
      className={cn(
        'h-9 w-9 shrink-0 rounded-xl text-[var(--brand-plum-soft)] opacity-80 transition-[transform,background-color,color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-90 hover:scale-105 hover:bg-[rgba(214,64,69,0.08)] hover:text-destructive hover:opacity-100 active:scale-95 md:hidden',
        className,
      )}
      onClick={() => setOpenMobile(false)}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
