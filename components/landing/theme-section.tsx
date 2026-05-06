'use client';

import { motion } from 'motion/react';
import { Reveal } from './motion-primitives';

export function ThemeSection() {
  return (
    <section className="relative overflow-hidden bg-foreground px-6 py-24 text-background sm:py-32">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.06 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 70%, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px, 64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-background/60">
            PIDEC 1.0 Theme
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Engineering for a sustainable, self-reliant Nigeria.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-background/70">
            Solutions that solve real problems faced by Nigerian communities,
            using the constraints and resources available locally. Judged on
            originality, feasibility, and engineering rigour.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
