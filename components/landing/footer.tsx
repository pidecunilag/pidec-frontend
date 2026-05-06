'use client';

import Link from 'next/link';

import { Reveal } from './motion-primitives';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              PIDEC <span className="text-muted-foreground">1.0</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              University of Lagos Engineering Society — Competitions &amp; Technical Team
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Register
            </Link>
            <a
              href="mailto:competitions@pidec.com.ng"
              className="hover:text-foreground transition-colors"
            >
              competitions@pidec.com.ng
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
