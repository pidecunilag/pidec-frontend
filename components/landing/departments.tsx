'use client';

import { DEPARTMENTS } from '@/lib/constants';
import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

export function Departments() {
  return (
    <section className="bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Participating Departments
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ten engineering departments. Ten representative teams.
          </h2>
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEPARTMENTS.map((dept) => (
            <StaggerItem
              key={dept}
              as="li"
              className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-accent/40"
            >
              {dept}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
