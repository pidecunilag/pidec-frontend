'use client';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

const STAGES = [
  {
    n: 1,
    name: 'Proposals',
    blurb:
      'Every team submits a written proposal: problem, solution, theme alignment, feasibility, departmental relevance.',
    detail: 'Unlimited Stage 1 entries per department.',
  },
  {
    n: 2,
    name: 'Prototypes',
    blurb:
      'Department representatives advance. Each team uploads a video demonstration alongside design documentation.',
    detail: 'One representative team per department.',
  },
  {
    n: 3,
    name: 'Grand Finale',
    blurb:
      'Top five teams present physical prototypes live on stage. The platform handles pre-Finale documentation only.',
    detail: 'Live presentation. One winner.',
  },
];

export function Stages() {
  return (
    <section className="bg-muted/30 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Competition Stages
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three stages. One arc from proposal to prototype to finale.
          </h2>
        </Reveal>

        <StaggerGroup
          as="ol"
          className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {STAGES.map((s) => (
            <StaggerItem
              key={s.n}
              as="li"
              className="relative flex flex-col rounded-3xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                  {s.n}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Stage {s.n}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.blurb}
              </p>
              <p className="mt-6 text-xs font-medium text-foreground/70">
                {s.detail}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
