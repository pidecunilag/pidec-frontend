'use client';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

const PILLARS = [
  {
    title: 'Department-Driven',
    body: 'Each of the 10 engineering departments fields its strongest team. No cross-department mixing — every solution carries a discipline.',
  },
  {
    title: 'Three Stages',
    body: 'A written proposal, a working prototype with video demonstration, and a live Grand Finale presentation.',
  },
  {
    title: 'Independent Judging',
    body: 'A dedicated judge per department per stage. Scoring runs in a sealed Judge Portal — admin only publishes once review is complete.',
  },
];

export function About() {
  return (
    <section id="about" className="bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            About
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A platform built for verifiable engineering competition.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            PIDEC replaces manual submission workflows with a digital-first
            experience that is auditable end-to-end. Built and operated by the
            ULES Competitions &amp; Technical Team.
          </p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40"
            >
              <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
