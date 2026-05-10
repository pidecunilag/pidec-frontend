import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/register'],
      disallow: [
        '/admin',
        '/dashboard',
        '/forgot-password',
        '/login',
        '/reset-password',
        '/verify-email',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
