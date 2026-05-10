'use client';

import { BrandIcon } from '@/components/brand/brand-assets';
import { Reveal } from './motion-primitives';

export function About() {
  return (
    <section id="about" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div className="lg:min-h-[calc(100vh-10rem)]">
            <Reveal className="lg:sticky lg:top-40">
              <h2 className="max-w-md text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl">
                What is PIDEC?
              </h2>
            </Reveal>
          </div>

          <div className="lg:min-h-[calc(100vh-10rem)]">
            <Reveal delay={0.05}>
              <div className="brand-panel motion-surface motion-surface-hover relative overflow-hidden rounded-[2rem] p-7 sm:p-8 lg:sticky lg:top-40">
                <BrandIcon
                  name="gear"
                  width={120}
                  height={120}
                  sizes="120px"
                  className="absolute -right-8 -top-8 opacity-[0.06]"
                />
                <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                  PIDEC means Prototype Inter Departmental Engineering Challenge. It is a
                  faculty wide engineering competition created for students in the
                  University of Lagos.
                </p>
                <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
                  The competition is organised by ULES, the University of Lagos Engineering
                  Society, to showcase engineering talent, encourage practical problem
                  solving, and give departments a strong platform to build solutions with
                  real world relevance.
                </p>
                <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
                  It exists to help students move from theory to working ideas, connect
                  talent with industry visibility, and create room for solutions that are
                  useful, inclusive, and sustainable.
                </p>
                <p className="mt-6 font-semibold text-[var(--brand-plum)]">
                  Open to all 10 engineering departments at UNILAG.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
