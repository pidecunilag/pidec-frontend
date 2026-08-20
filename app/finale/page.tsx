import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { FinaleRegistrationExperience } from './registration-experience';

const title = 'PIDEC 1.0 Grand Finale Registration';
const description =
  'Register for the PIDEC 1.0 Grand Finale at J.F. Ajayi Auditorium, University of Lagos, on 28 August 2026.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/finale' },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/finale'),
    images: [{ url: '/finale-poster.jpg', width: 1024, height: 1280, alt: title }],
  },
};

export default function FinalePage() {
  return <FinaleRegistrationExperience />;
}
