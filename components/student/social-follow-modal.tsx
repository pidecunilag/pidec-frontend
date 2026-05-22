'use client';

import type { SVGProps } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SOCIAL_LINKS } from '@/lib/constants';

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 3v11.2a4.8 4.8 0 1 1-4.8-4.8" />
      <path d="M14 5.5c1.2 2.4 3.1 3.7 5.6 3.9" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  X: XIcon,
  TikTok: TikTokIcon,
  LinkedIn: LinkedInIcon,
} as const;

interface SocialFollowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SocialFollowModal({ open, onOpenChange }: SocialFollowModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[1.75rem] border border-[rgba(42,0,59,0.1)] bg-white p-6 shadow-[0_30px_90px_rgba(42,0,59,0.24)] sm:max-w-xl">
        <DialogHeader className="pr-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
            Stay Connected
          </p>
          <DialogTitle className="font-heading text-3xl font-semibold tracking-normal text-[var(--brand-plum)]">
            Follow PIDEC for updates
          </DialogTitle>
          <DialogDescription className="text-base leading-7 text-[var(--brand-plum-soft)]/76">
            Get announcements, deadline reminders, event updates, and quick support from our official channels.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_LINKS.map(({ href, label }) => {
            const Icon = SOCIAL_ICONS[label];

            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-[rgba(42,0,59,0.1)] bg-[rgba(42,0,59,0.02)] p-4 text-[var(--brand-plum)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-[rgba(142,77,255,0.28)] hover:bg-[rgba(142,77,255,0.07)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(142,77,255,0.16),rgba(18,183,234,0.14))] text-[var(--brand-purple)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="text-sm text-[var(--brand-plum-soft)]/70">
                    Open official page
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
