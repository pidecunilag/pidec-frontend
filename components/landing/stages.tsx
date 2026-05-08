'use client';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

const STAGES = [
  {
    number: 'Stage 1',
    name: 'Preliminary Entry',
    dates: '18 to 24 May 2026',
    description:
      'Teams submit engineering proposals. One judge selects the best team from each department.',
    status: 'Upcoming',
    accent: 'var(--brand-purple)',
  },
  {
    number: 'Stage 2',
    name: 'Prototype Development',
    dates: '25 May to 7 June 2026',
    description:
      'Ten representative teams build and demonstrate working solutions. The top five teams advance.',
    status: 'Upcoming',
    accent: 'var(--brand-cyan)',
  },
  {
    number: 'Stage 3',
    name: 'Grand Finale',
    dates: '4 July 2026',
    description:
      'Five finalists present live and the winners are announced on the day.',
    status: 'Upcoming',
    accent: 'var(--brand-pink)',
  },
];

export function Stages() {
  return (
    <section id="stages" className="px-6 pb-10 pt-20 sm:pb-12 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl">
            How the Competition Works
          </h2>
        </Reveal>

        <StaggerGroup as="ol" className="mt-14 grid gap-6 lg:grid-cols-3">
          {STAGES.map((stage) => (
            <StaggerItem
              key={stage.number}
              as="li"
              className="brand-panel motion-surface motion-surface-hover rounded-[2rem] p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {stage.number}
                </p>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: stage.accent,
                    color: stage.accent === 'var(--brand-cyan)' ? 'var(--brand-plum)' : 'white',
                  }}
                >
                  {stage.status}
                </span>
              </div>

              <h3 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.05em] text-foreground">
                {stage.name}
              </h3>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-plum)]">
                {stage.dates}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {stage.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
