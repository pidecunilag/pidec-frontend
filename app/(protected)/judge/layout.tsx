import type { Metadata } from 'next';

import { JudgeShell } from '@/components/judge/judge-shell';

export const metadata: Metadata = {
  title: 'Judge Workspace',
  description: 'PIDEC judge workspace for representative selection and scoring.',
};

export default function JudgeLayout({ children }: { children: React.ReactNode }) {
  return <JudgeShell>{children}</JudgeShell>;
}
