'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

import { Reveal } from './motion-primitives';

const FAQS = [
  {
    q: 'Who can register for PIDEC 1.0?',
    a: 'Engineering students at the University of Lagos with a valid matric number in the YYFFDDXXX format (FF must be 04 — Engineering). Students upload a course form or exam docket; an AI verification pipeline confirms eligibility.',
  },
  {
    q: 'How many people can be on a team?',
    a: 'Three to six members. All members must be from the same department, and a student can belong to only one team at a time.',
  },
  {
    q: 'Can teams from the same department compete in Stage 1?',
    a: 'Yes — Stage 1 is unlimited per department. The judge for each department selects one representative team to advance to Stage 2.',
  },
  {
    q: 'Is Stage 2 a physical inspection?',
    a: 'No. Stage 2 is fully remote. Every team uploads a video demonstration link (YouTube unlisted or Google Drive view-access) plus written documentation. The judge evaluates via the platform.',
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
    <li className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 shrink-0 text-muted-foreground"
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
            <p className="pb-6 pr-12 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function FAQ() {
  return (
    <section className="bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            FAQ
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Common questions.
          </h2>
        </Reveal>

        <Reveal>
          <ul className="mt-10 border-t border-border">
            {FAQS.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
