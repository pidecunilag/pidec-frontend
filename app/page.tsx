import type { Metadata } from 'next';

import { About } from '@/components/landing/about';
import { Departments } from '@/components/landing/departments';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Sponsors } from '@/components/landing/sponsors';
import { Stages } from '@/components/landing/stages';
import { ThemeSection } from '@/components/landing/theme-section';

export const metadata: Metadata = {
  title: {
    absolute: 'PIDEC 1.0 | Prototype Inter Departmental Engineering Challenge',
  },
  description:
    'PIDEC 1.0 is the Prototype Inter Departmental Engineering Challenge by ULES for all ten engineering departments at UNILAG.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Stages />
      <Departments />
      <ThemeSection />
      <Sponsors />
      <FAQ />
      <Footer />
    </main>
  );
}
