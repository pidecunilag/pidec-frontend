export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pidec.com.ng');

export const seo = {
  name: 'PIDEC 1.0',
  title: 'PIDEC 1.0 | Prototype Inter Departmental Engineering Challenge',
  description:
    'PIDEC 1.0 is a faculty wide engineering competition for University of Lagos students across all ten engineering departments.',
  theme:
    'Engineering for Impact: Building Inclusive Solutions for a Sustainable Future',
  organizer: 'University of Lagos Engineering Society',
  email: 'competitions@pidec.com.ng',
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}
