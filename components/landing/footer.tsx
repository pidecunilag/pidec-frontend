'use client';

import Link from 'next/link';

import { Reveal } from './motion-primitives';

export function Footer() {
  return (
    <footer className="px-6 pb-12">
      <Reveal>
        <div className="motion-surface mx-auto max-w-6xl rounded-[2rem] border border-[rgba(42,0,59,0.12)] bg-white/72 px-6 py-8 shadow-[0_20px_60px_rgba(42,0,59,0.08)] backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-heading text-2xl font-semibold tracking-[-0.06em] text-foreground">
                PIDEC 1.0
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Organised by ULES, University of Lagos Engineering Society
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
              <Link href="#stages" className="transition-colors hover:text-foreground">
                Competition Rules
              </Link>
              <Link href="#about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <a
                href="mailto:competitions@pidec.com.ng"
                className="transition-colors hover:text-foreground"
              >
                Contact
              </a>
            </div>

            <a
              href="mailto:competitions@pidec.com.ng"
              className="text-sm font-semibold text-foreground transition-colors hover:text-[var(--brand-purple)]"
            >
              competitions@pidec.com.ng
            </a>
          </div>

          <div className="mt-8 border-t border-[rgba(42,0,59,0.08)] pt-5 text-sm text-muted-foreground">
            © 2026 PIDEC. All rights reserved.
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
