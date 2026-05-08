'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

import { Reveal } from './motion-primitives';

const FAQS = [
  {
    q: 'Who can participate in PIDEC 1.0?',
    a: 'PIDEC 1.0 is open to students in the ten engineering departments at the University of Lagos.',
  },
  {
    q: 'How do I register?',
    a: 'Teams register through the platform when registration is open. The Register Now button takes you straight to the registration flow.',
  },
  {
    q: 'How many people can be in a team?',
    a: 'Teams can have between three and six students.',
  },
  {
    q: 'Can students from different departments form a team?',
    a: 'No. Teams are department based, so members of a team must come from the same department.',
  },
  {
    q: 'How does Stage 1 judging work?',
    a: 'Teams submit proposals and one judge selects the strongest entry from each department to move forward.',
  },
  {
    q: 'What do teams build in Stage 2?',
    a: 'Teams develop working prototype solutions and present clear evidence of how the idea performs in practice.',
  },
  {
    q: 'When is the Grand Finale?',
    a: 'The Grand Finale takes place on July 4, 2026.',
  },
  {
    q: 'How do I contact the PIDEC team?',
    a: 'You can reach the team through competitions@pidec.com.ng.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-[var(--brand-cyan-soft)]"
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
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-sm leading-7 text-white/74">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-24 sm:py-32">
      <div className="motion-surface mx-auto max-w-4xl rounded-[2.5rem] bg-[var(--brand-plum)] px-6 py-14 shadow-[0_32px_90px_rgba(42,0,59,0.18)] sm:px-10">
        <Reveal>
          <h2 className="text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
            Frequently Asked Questions
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
