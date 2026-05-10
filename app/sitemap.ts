import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-05-10T00:00:00.000Z');

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/register'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
