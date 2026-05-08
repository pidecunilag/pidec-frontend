'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

import { Reveal } from './motion-primitives';

const FAQS = [
  {
    q: 'Who can register for PIDEC 1.0?',
    a: 'Engineering students at the University of Lagos with a valid matric number in the YYFFDDXXX format, where FF must be 04 for Engineering. Students upload a course form or exam docket and the verification pipeline confirms eligibility.',
  },
  {
    q: 'How many people can be on a team?',
    a: 'Three to six members. All members must be from the same department, and a student can belong to only one team at a time.',
  },
  {
    q: 'Can teams from the same department compete in stage 1?',
    a: 'Yes. Stage 1 is unlimited per department. The judge for each department selects one representative team to advance to stage 2.',
  },
  {
    q: 'Is stage 2 a physical inspection?',
    a: 'No. Stage 2 is fully remote. Every team uploads a video demonstration link plus written documentation, and the judge evaluates it through the platform.',
  },
  {
    q: 'When does my team see scores?',
    a: 'Only after admin publishes feedback. Scores appear on the team dashboard with per-criterion breakdowns and written judge comments.',
  },
  {
    q: 'What happens if our team is disqualified?',
    a: 'A persistent banner appears on the dashboard. The team retains read-only access to submissions and feedback from the stage at which they were eliminated.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-white">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 shrink-0 text-white/64"
        >
          <Plus className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-sm leading-7 text-white/74">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[var(--brand-plum)] px-6 py-14 shadow-[0_32px_90px_rgba(42,0,59,0.18)] sm:px-10">
        <Reveal>
          <span className="brand-kicker text-[rgba(125,223,255,0.8)]">FAQ</span>
          <h2 className="mt-4 text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
            Common questions from teams getting ready to compete.
          </h2>
        </Reveal>

        <Reveal>
          <ul className="mt-10 border-t border-white/10">
            {FAQS.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
