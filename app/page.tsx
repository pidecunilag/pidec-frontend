import { Hero } from '@/components/landing/hero';
import { About } from '@/components/landing/about';
import { Stages } from '@/components/landing/stages';
import { ThemeSection } from '@/components/landing/theme-section';
import { Departments } from '@/components/landing/departments';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';

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
