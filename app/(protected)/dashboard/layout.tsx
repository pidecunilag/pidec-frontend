import type { Metadata } from 'next';

import { StudentShell } from '@/components/student/student-shell';

export const metadata: Metadata = {
  title: 'Student Dashboard',
  description: 'PIDEC 1.0 student workspace for teams, submissions, feedback, and notifications.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
