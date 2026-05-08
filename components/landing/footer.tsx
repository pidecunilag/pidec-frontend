'use client';

import Link from 'next/link';
import type { SVGProps } from 'react';

import { Reveal } from './motion-primitives';

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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 4l16 16" />
      <path d="M20 4 9.5 14.5" />
      <path d="M14.5 9.5 4 20" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: LinkedInIcon },
  { href: 'https://www.instagram.com', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://x.com', label: 'X', Icon: XIcon },
];

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
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="motion-surface flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(42,0,59,0.1)] bg-[linear-gradient(135deg,rgba(142,77,255,0.12)_0%,rgba(18,183,234,0.12)_100%)] text-[var(--brand-plum)] hover:border-[rgba(142,77,255,0.24)] hover:bg-[linear-gradient(135deg,rgba(142,77,255,0.22)_0%,rgba(18,183,234,0.2)_100%)] hover:text-[var(--brand-purple)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
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
