'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { stagger, fadeUp } from './motion-primitives';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.97_0_0)_0%,transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.25_0_0)_0%,transparent_70%)]" />

      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-32 pb-24 text-center sm:pt-40"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          University of Lagos Engineering Society — PIDEC 1.0
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Proving Innovation, Design,
          <br />
          <span className="text-muted-foreground">and Engineering Competence.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground"
        >
          The Prototype Inter-Departmental Engineering Challenge. Ten departments,
          three stages, one chance to represent your discipline.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/register">
              Register Your Team
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="#about">Learn More</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
