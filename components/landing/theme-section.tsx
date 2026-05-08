'use client';

import { motion } from 'motion/react';

import { Reveal } from './motion-primitives';

export function ThemeSection() {
  return (
    <section id="theme" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(135deg,#f4035b_0%,#ff7a21_52%,#12b7ea_100%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.12 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px, 64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-white/20 bg-[rgba(42,0,59,0.72)] px-6 py-14 text-center text-white shadow-[0_32px_90px_rgba(42,0,59,0.2)] backdrop-blur sm:px-10">
        <Reveal>
          <span className="brand-kicker text-white/64">PIDEC 1.0 Theme</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 text-balance font-heading text-4xl font-semibold leading-tight tracking-[-0.07em] sm:text-6xl">
            Engineering for a sustainable, self-reliant Nigeria.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-3xl text-balance text-base leading-8 text-white/76 sm:text-lg">
            Solutions that solve real problems faced by Nigerian communities,
            using the constraints and resources available locally. Judged on
            originality, feasibility, and engineering rigour.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
