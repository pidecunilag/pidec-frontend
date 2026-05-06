'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

// Shared motion vocabulary — every section reuses these so the page feels coherent.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'section';
}) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
