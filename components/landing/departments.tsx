'use client';

import { DEPARTMENTS } from '@/lib/constants';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

export function Departments() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="brand-kicker text-[var(--brand-cyan)]">Participating Departments</span>
          <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl">
            Ten engineering departments. Ten clear identities on one stage.
          </h2>
        </Reveal>

        <StaggerGroup as="ul" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((dept, index) => (
            <StaggerItem
              key={dept}
              as="li"
              className={[
                'brand-panel rounded-[1.6rem] px-5 py-5 text-sm font-semibold text-foreground transition-transform duration-300 hover:-translate-y-1',
                index % 3 === 0 &&
                  'bg-[linear-gradient(135deg,rgba(142,77,255,0.14),rgba(255,255,255,0.9))]',
                index % 3 === 1 &&
                  'bg-[linear-gradient(135deg,rgba(18,183,234,0.16),rgba(255,255,255,0.9))]',
                index % 3 === 2 &&
                  'bg-[linear-gradient(135deg,rgba(244,3,91,0.12),rgba(255,255,255,0.92))]',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {dept}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
