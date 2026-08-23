import type { Metadata } from 'next';

import { absoluteUrl } from '@/lib/seo';
import { FinaleCardLookupExperience } from './card-lookup-experience';

const title = 'Create Your PIDEC Grand Finale Share Card';
const description =
  'Look up your PIDEC 1.0 Grand Finale registration and create a personalised share card.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/finale/card' },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/finale/card'),
    images: [
      { url: '/finale/card/opengraph-image', width: 1200, height: 630, alt: title },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/finale/card/opengraph-image'],
  },
};

export default function FinaleCardPage() {
  return <FinaleCardLookupExperience />;
}
