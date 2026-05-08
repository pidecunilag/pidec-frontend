'use client';

import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

const STAGES = [
  {
    n: 1,
    name: 'Proposals',
    blurb:
      'Every team submits a written proposal: problem, solution, theme alignment, feasibility, and departmental relevance.',
    detail: 'Unlimited stage 1 entries per department.',
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
      'Top five teams present physical prototypes live on stage. The platform handles pre-finale documentation only.',
    detail: 'Live presentation. One winner.',
  },
];

export function Stages() {
  return (
    <section id="stages" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[var(--brand-plum)] px-6 py-14 text-white shadow-[0_32px_90px_rgba(42,0,59,0.22)] sm:px-8 lg:px-12">
        <Reveal>
          <span className="brand-kicker text-[rgba(215,179,251,0.82)]">Competition Stages</span>
          <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
            Three deliberate rounds from concept signal to live-build proof.
          </h2>
        </Reveal>

        <StaggerGroup as="ol" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {STAGES.map((s) => (
            <StaggerItem
              key={s.n}
              as="li"
              className="relative flex flex-col rounded-[2rem] border border-white/10 bg-white/7 p-8 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-bold text-[var(--brand-plum)]">
                  {s.n}
                </span>
                <span className="brand-kicker text-white/60">Stage {s.n}</span>
              </div>
              <h3 className="mt-6 font-heading text-2xl font-semibold tracking-[-0.05em] text-white">
                {s.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/72">{s.blurb}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
                {s.detail}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
