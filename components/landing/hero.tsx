'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, LogIn, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { fadeUp, stagger } from './motion-primitives';

export function Hero() {
  return (
    <section className="brand-shell bg-[var(--brand-plum)] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(142,77,255,0.58),transparent_34%),radial-gradient(circle_at_top_right,rgba(18,183,234,0.28),transparent_28%),linear-gradient(180deg,#2a003b_0%,#220032_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_0,transparent_59px,rgba(255,255,255,0.05)_59px,rgba(255,255,255,0.05)_60px),linear-gradient(transparent_0,transparent_59px,rgba(255,255,255,0.05)_59px,rgba(255,255,255,0.05)_60px)] bg-[size:60px_60px]" />
      <div className="absolute -top-20 left-[12%] h-72 w-72 rounded-full bg-[rgba(244,3,91,0.2)] blur-3xl" />
      <div className="absolute right-[-6rem] bottom-[-10rem] h-96 w-96 rounded-full bg-[rgba(18,183,234,0.16)] blur-3xl" />

      <motion.div
        className="mx-auto flex max-w-6xl flex-col px-6 pt-8 pb-24 sm:pt-10 lg:pt-12"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="brand-kicker text-[rgba(215,179,251,0.9)]">University of Lagos Engineering Society</p>
            <p className="mt-2 font-heading text-2xl font-semibold tracking-[-0.06em] text-white sm:text-3xl">
              PIDEC 1.0
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/74">
            <Link href="#about" className="transition-colors hover:text-white">
              About PIDEC
            </Link>
            <Link href="#stages" className="transition-colors hover:text-white">
              Stages
            </Link>
            <Link href="#faq" className="transition-colors hover:text-white">
              FAQ
            </Link>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-white/8 px-4 text-white hover:bg-white/14 hover:text-white"
            >
              <Link href="/login">
                Sign In
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/80 uppercase backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
              Prototype Inter-Departmental Engineering Challenge
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-7 max-w-4xl text-balance font-heading text-5xl font-semibold tracking-[-0.08em] text-white sm:text-6xl lg:text-7xl"
            >
              The PIDEC brand deserves
              <span className="block text-[rgba(215,179,251,0.92)]">a landing page with voltage.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/74 sm:text-xl"
            >
              A digital arena for engineering students to pitch, prototype, and
              represent their departments through a competition built on bold
              identity, clarity, and competitive energy.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 bg-white px-6 text-[var(--brand-plum)] hover:bg-white/90"
              >
                <Link href="/register">
                  Register Your Team
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-white/8 px-6 text-white hover:bg-white/14 hover:text-white"
              >
                <Link href="#theme">Explore The Challenge</Link>
              </Button>
            </motion.div>
          </div>

          <motion.aside
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-gradient)]" />
            <div className="grid gap-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="brand-kicker text-[rgba(215,179,251,0.75)]">Competition Arc</p>
                  <p className="mt-2 font-heading text-3xl font-semibold tracking-[-0.06em]">
                    10 departments.
                    <br />
                    3 stages.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/72">
                  ULES C&amp;T
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  ['01', 'Proposal sprint', 'Pitch a grounded, department-led idea.'],
                  ['02', 'Prototype proof', 'Turn feasibility into a working demonstration.'],
                  ['03', 'Grand finale', 'Present live with build quality and confidence.'],
                ].map(([index, title, body]) => (
                  <div
                    key={index}
                    className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-heading text-2xl font-semibold text-[var(--brand-cyan)]">
                        {index}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/66">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
