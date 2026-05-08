'use client';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

const PILLARS = [
  {
    title: 'Department-Driven',
    body: 'Each of the 10 engineering departments fields its strongest team. No cross-department mixing - every solution carries a discipline.',
  },
  {
    title: 'Three Stages',
    body: 'A written proposal, a working prototype with video demonstration, and a live Grand Finale presentation.',
  },
  {
    title: 'Independent Judging',
    body: 'A dedicated judge per department per stage. Scoring runs in a sealed Judge Portal - admin only publishes once review is complete.',
  },
];

export function About() {
  return (
    <section id="about" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="brand-kicker text-[var(--brand-purple)]">Story Foundation</span>
          <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl">
            PIDEC is where technical depth meets competitive showmanship.
          </h2>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            The platform is not just a submission portal. It is the digital home
            of the challenge, designed to feel intentional, credible, and alive
            with the same energy the brand guide carries.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {PILLARS.map((p) => (
            <StaggerItem
              key={p.title}
              className="brand-panel rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="h-2 w-20 rounded-full bg-[var(--brand-gradient)]" />
              <h3 className="mt-6 font-heading text-2xl font-semibold tracking-[-0.05em] text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
