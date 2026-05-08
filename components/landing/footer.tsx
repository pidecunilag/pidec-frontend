'use client';

import Link from 'next/link';

import { Reveal } from './motion-primitives';

export function Footer() {
  return (
    <footer className="px-6 pb-12">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[2rem] border border-[rgba(42,0,59,0.12)] bg-white/70 px-6 py-7 shadow-[0_20px_60px_rgba(42,0,59,0.08)] backdrop-blur sm:flex-row sm:items-center">
          <div>
            <p className="font-heading text-2xl font-semibold tracking-[-0.06em] text-foreground">
              PIDEC <span className="text-[var(--brand-purple)]">1.0</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              University of Lagos Engineering Society - Competitions &amp; Technical Team
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign In
            </Link>
            <Link href="/register" className="transition-colors hover:text-foreground">
              Register
            </Link>
            <a
              href="mailto:competitions@pidec.com.ng"
              className="transition-colors hover:text-foreground"
            >
              competitions@pidec.com.ng
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
