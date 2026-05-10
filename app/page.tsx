import type { Metadata } from 'next';

import { About } from '@/components/landing/about';
import { Departments } from '@/components/landing/departments';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Sponsors } from '@/components/landing/sponsors';
import { Stages } from '@/components/landing/stages';
import { ThemeSection } from '@/components/landing/theme-section';
import { absoluteUrl, seo } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: seo.title,
  },
  description: seo.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: absoluteUrl('/'),
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': absoluteUrl('/#organization'),
        name: seo.organizer,
        alternateName: 'ULES',
        url: absoluteUrl('/'),
        email: seo.email,
      },
      {
        '@type': 'Event',
        '@id': absoluteUrl('/#event'),
        name: seo.name,
        description: seo.description,
        startDate: '2026-05-18',
        endDate: '2026-07-04',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        url: absoluteUrl('/'),
        organizer: { '@id': absoluteUrl('/#organization') },
        location: {
          '@type': 'Place',
          name: 'University of Lagos',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lagos',
            addressCountry: 'NG',
          },
        },
        offers: {
          '@type': 'Offer',
          url: absoluteUrl('/register'),
          availability: 'https://schema.org/InStock',
          price: '0',
          priceCurrency: 'NGN',
        },
      },
      {
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        name: seo.name,
        url: absoluteUrl('/'),
        publisher: { '@id': absoluteUrl('/#organization') },
      },
    ],
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
