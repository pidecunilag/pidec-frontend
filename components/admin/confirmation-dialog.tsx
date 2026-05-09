'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
  // Optional form inputs (textarea, select, etc.) rendered between description and footer.
  children?: React.ReactNode;
  // Disable the confirm button (e.g. when a required reason input is empty).
  confirmDisabled?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isDestructive = false,
  isLoading = false,
  children,
  confirmDisabled = false,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border border-[rgba(42,0,59,0.12)] bg-white p-6 shadow-[0_28px_90px_rgba(42,0,59,0.18)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-2xl font-semibold tracking-normal text-[var(--brand-plum)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--brand-plum-soft)]/72">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children && <div className="py-2">{children}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
            className={cn(
              isDestructive && buttonVariants({ variant: 'destructive' }),
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
