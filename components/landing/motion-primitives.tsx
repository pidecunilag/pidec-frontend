'use client';

import { motion, type Variants } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
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
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
  style?: CSSProperties;
}) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={fadeUp} style={style}>
      {children}
    </Component>
  );
}
