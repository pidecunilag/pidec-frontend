import type { Metadata } from 'next';

import { About } from '@/components/landing/about';
import { Departments } from '@/components/landing/departments';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Stages } from '@/components/landing/stages';
import { ThemeSection } from '@/components/landing/theme-section';

export const metadata: Metadata = {
  title: {
    absolute: 'PIDEC 1.0 - Proving Innovation, Design, and Engineering Competence',
  },
  description:
    'PIDEC 1.0 is the inter-departmental engineering challenge run by the University of Lagos Engineering Society. Register your team, submit across three stages, and represent your department.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Stages />
      <ThemeSection />
      <Departments />
      <FAQ />
      <Footer />
    </main>
  );
}
