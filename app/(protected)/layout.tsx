import type { Metadata } from 'next';

import { ProtectedShell } from './protected-shell';

// Authenticated surfaces should not be indexed — students/judges/admins authenticate to access them
// and search engines have nothing useful to crawl.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
