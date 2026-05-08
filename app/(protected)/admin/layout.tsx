import type { Metadata } from 'next';

import { AdminShell } from '@/components/admin/admin-shell';

export const metadata: Metadata = {
  title: 'Admin Console',
  description: 'PIDEC 1.0 admin console — operated by the ULES Competitions & Technical Team.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
