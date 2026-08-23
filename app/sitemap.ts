import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-23T00:00:00.000Z');

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
    {
      url: absoluteUrl('/finale'),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/finale/card'),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}
