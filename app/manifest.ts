import type { MetadataRoute } from 'next';

import { seo } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: seo.name,
    description: seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfbfe',
    theme_color: '#2a003b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
