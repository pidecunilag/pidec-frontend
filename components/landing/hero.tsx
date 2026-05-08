'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { fadeUp, stagger } from './motion-primitives';

const SIGNUPS_OPEN = true;

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#stages', label: 'Stages' },
  { href: '#departments', label: 'Departments' },
  { href: '#faq', label: 'FAQ' },
];

const STATS = [
  { label: 'Departments', value: '10' },
  { label: 'Stages', value: '3' },
  { label: 'Grand Finale', value: 'July 4, 2026' },
];

export function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="brand-shell bg-[#fcfbfe] text-[var(--brand-plum)]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(18,183,234,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,122,33,0.1),transparent_24%),linear-gradient(180deg,#fcfbfe_0%,#f7f3fb_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_0,transparent_59px,rgba(42,0,59,0.05)_59px,rgba(42,0,59,0.05)_60px),linear-gradient(transparent_0,transparent_59px,rgba(42,0,59,0.05)_59px,rgba(42,0,59,0.05)_60px)] bg-[size:60px_60px]" />
      <div className="absolute -top-20 left-[10%] h-72 w-72 rounded-full bg-[rgba(18,183,234,0.12)] blur-3xl" />
      <div className="absolute right-[-6rem] bottom-[-10rem] h-96 w-96 rounded-full bg-[rgba(255,122,33,0.12)] blur-3xl" />

      <motion.div
        className="mx-auto flex max-w-6xl flex-col px-6 pb-24"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          variants={fadeUp}
          className="motion-surface sticky top-0 z-30 mt-6 rounded-[1.75rem] border border-[rgba(42,0,59,0.09)] bg-[rgba(255,255,255,0.82)] px-5 py-4 backdrop-blur"
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="font-heading text-2xl font-semibold tracking-[-0.06em] text-[var(--brand-plum)]"
            >
              PIDEC 1.0
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--brand-plum-soft)] md:flex">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative transition-colors duration-300 hover:text-[var(--brand-plum)] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--brand-plum)] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
              {SIGNUPS_OPEN ? (
                <Button
                  asChild
                  className="rounded-full border-0 bg-white px-5 text-[var(--brand-plum)] hover:bg-white/90"
                >
                  <Link href="/register">Register Now</Link>
                </Button>
              ) : null}
            </nav>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="motion-surface flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(42,0,59,0.1)] bg-white text-[var(--brand-plum)] md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-4 grid gap-3 border-t border-[rgba(42,0,59,0.08)] pt-4 md:hidden">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--brand-plum-soft)] transition-colors duration-300 hover:text-[var(--brand-plum)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {SIGNUPS_OPEN ? (
                <Button
                  asChild
                  className="mt-2 rounded-full border-0 bg-white text-[var(--brand-plum)] hover:bg-white/90"
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Register Now
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </motion.header>

        <div className="grid gap-10 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pt-24">
          <div className="max-w-3xl">
            <motion.h1
              variants={fadeUp}
              className="text-balance font-heading text-6xl font-semibold tracking-[-0.08em] text-[var(--brand-plum)] sm:text-7xl lg:text-8xl"
            >
              PIDEC 1.0
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-cyan)] sm:text-2xl"
            >
              Engineering for Impact: Building Inclusive Solutions for a Sustainable Future
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-2xl text-balance text-base leading-8 text-[var(--brand-plum-soft)] sm:text-lg"
            >
              PIDEC 1.0 is a faculty wide engineering competition for students across
              all ten engineering departments at UNILAG. It gives teams a real platform
              to present ideas, build prototypes, and solve practical problems with
              strong engineering thinking.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              {SIGNUPS_OPEN ? (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full border-0 bg-white px-6 text-[var(--brand-plum)] hover:bg-white/90"
                >
                  <Link href="/register">
                    Register Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[rgba(42,0,59,0.12)] bg-white px-6 text-[var(--brand-plum)] hover:bg-[var(--brand-purple-mist)] hover:text-[var(--brand-plum)]"
              >
                <Link href="#about">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="motion-surface rounded-[1.6rem] border border-[rgba(42,0,59,0.08)] bg-[rgba(255,255,255,0.82)] px-5 py-5 backdrop-blur"
                >
                  <p className="text-3xl font-heading font-semibold tracking-[-0.06em] text-[var(--brand-plum)]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--brand-plum-soft)]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.aside
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2rem] border border-[rgba(42,0,59,0.1)] bg-[var(--brand-plum)] p-6 text-white shadow-[0_24px_60px_rgba(42,0,59,0.16)] sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-gradient)]" />
            <div className="grid gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan-soft)]">
                  This Year
                </p>
                <p className="mt-3 font-heading text-3xl font-semibold tracking-[-0.06em] text-white">
                  A sharper stage for ideas that can become real solutions.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  ['18 to 24 May 2026', 'Preliminary Entry'],
                  ['25 May to 7 June 2026', 'Prototype Development'],
                  ['4 July 2026', 'Grand Finale'],
                ].map(([date, title]) => (
                  <div
                    key={title}
                    className="motion-surface rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">
                      {date}
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">{title}</p>
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
