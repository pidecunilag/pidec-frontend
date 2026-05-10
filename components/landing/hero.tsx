'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';

import { BrandIcon, BrandLogo } from '@/components/brand/brand-assets';
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
    <section className="brand-shell overflow-hidden bg-[#fcfbfe] text-[var(--brand-plum)]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(18,183,234,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,122,33,0.1),transparent_24%),linear-gradient(180deg,#fcfbfe_0%,#f7f3fb_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_0,transparent_59px,rgba(42,0,59,0.05)_59px,rgba(42,0,59,0.05)_60px),linear-gradient(transparent_0,transparent_59px,rgba(42,0,59,0.05)_59px,rgba(42,0,59,0.05)_60px)] bg-[size:60px_60px]" />
      <div className="absolute -top-20 left-[10%] h-72 w-72 rounded-full bg-[rgba(18,183,234,0.12)] blur-3xl" />
      <div className="absolute right-[-6rem] bottom-[-10rem] h-96 w-96 rounded-full bg-[rgba(255,122,33,0.12)] blur-3xl" />
      <div aria-hidden="true" className="brand-float-accent absolute left-[8%] top-52 hidden opacity-80 sm:block">
        <BrandIcon name="bulb" width={58} height={86} sizes="58px" />
      </div>
      <div aria-hidden="true" className="brand-float-accent brand-float-accent-delay absolute right-[11%] top-56 hidden opacity-75 md:block">
        <BrandIcon name="gear" width={86} height={86} sizes="86px" />
      </div>
      <div aria-hidden="true" className="brand-float-accent absolute bottom-32 left-[14%] hidden opacity-55 lg:block">
        <BrandIcon name="chip" width={64} height={68} sizes="64px" />
      </div>
      <div aria-hidden="true" className="brand-float-accent brand-float-accent-delay absolute bottom-28 right-[18%] hidden opacity-60 lg:block">
        <BrandIcon name="nut" width={62} height={72} sizes="62px" />
      </div>

      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="fixed inset-x-0 top-6 z-[120] px-6"
      >
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-[rgba(42,0,59,0.09)] bg-[rgba(255,255,255,0.82)] px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center"
              aria-label="PIDEC 1.0 home"
            >
              <BrandLogo priority width={128} height={55} sizes="128px" className="h-9 w-auto" />
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
                  className="rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:140%_140%] px-5 text-white shadow-[0_14px_28px_rgba(109,45,255,0.22)] hover:bg-[position:100%_50%] hover:shadow-[0_18px_36px_rgba(109,45,255,0.28)]"
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

          <AnimatePresence initial={false}>
            {mobileOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -8 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 grid overflow-hidden border-t border-[rgba(42,0,59,0.08)] pt-4 md:hidden"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { transition: { staggerChildren: 0.035, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
                  }}
                  className="grid gap-3"
                >
                  {NAV_LINKS.map((item) => (
                    <motion.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-[var(--brand-plum-soft)] transition-colors duration-300 hover:text-[var(--brand-plum)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  {SIGNUPS_OPEN ? (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Button
                        asChild
                        className="mt-2 rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:140%_140%] text-white shadow-[0_14px_28px_rgba(109,45,255,0.22)] hover:bg-[position:100%_50%] hover:shadow-[0_18px_36px_rgba(109,45,255,0.28)]"
                      >
                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                          Register Now
                        </Link>
                      </Button>
                    </motion.div>
                  ) : null}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.header>

      <motion.div
        className="mx-auto flex max-w-6xl flex-col px-6 pb-12 pt-36 sm:pt-40"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <div className="flex min-h-[calc(78vh-7rem)] items-center justify-center py-6 sm:min-h-[calc(82vh-7rem)]">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              variants={fadeUp}
              className="text-balance font-heading text-6xl font-semibold tracking-[-0.08em] text-[var(--brand-plum)] sm:text-7xl lg:text-8xl"
            >
              PIDEC 1.0
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--brand-orange)] sm:text-2xl"
            >
              Engineering for Impact: Building Inclusive Solutions for a Sustainable Future
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-[var(--brand-plum-soft)] sm:text-lg"
            >
              A faculty wide engineering competition for students across all ten
              engineering departments at UNILAG.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {SIGNUPS_OPEN ? (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] px-6 text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
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
                className="rounded-full border-[rgba(18,183,234,0.18)] bg-[linear-gradient(135deg,rgba(18,183,234,0.14)_0%,rgba(142,77,255,0.12)_100%)] px-6 text-[var(--brand-plum)] shadow-[0_14px_28px_rgba(18,183,234,0.08)] hover:bg-[linear-gradient(135deg,rgba(18,183,234,0.22)_0%,rgba(142,77,255,0.18)_100%)] hover:text-[var(--brand-plum)]"
              >
                <Link href="#about">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
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
        </div>
      </motion.div>
    </section>
  );
}
