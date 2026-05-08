'use client';

import { Download, FileSpreadsheet, FileArchive, Loader2 } from 'lucide-react';

import {
  useExportStudents,
  useExportTeams,
  useExportSubmissions,
  useExportScores,
} from '@/lib/hooks/use-admin';
import { Button } from '@/components/ui/button';

export default function ExportsPage() {
  const students = useExportStudents();
  const teams = useExportTeams();
  const submissions = useExportSubmissions();
  const scores = useExportScores();

  const exports = [
    {
      title: 'Students',
      description: 'All registered students with verification status, department, and level.',
      icon: FileSpreadsheet,
      mutation: students,
      action: () => students.mutate(),
    },
    {
      title: 'Teams',
      description: 'All teams with members, leader, department, and current stage.',
      icon: FileSpreadsheet,
      mutation: teams,
      action: () => teams.mutate(),
    },
    {
      title: 'Submissions',
      description: 'All submissions across stages with form data.',
      icon: FileArchive,
      mutation: submissions,
      action: () => submissions.mutate(undefined),
    },
    {
      title: 'Scores',
      description: 'All feedback scores and comments by criterion.',
      icon: FileSpreadsheet,
      mutation: scores,
      action: () => scores.mutate(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Data Exports</h2>
        <p className="text-muted-foreground">
          Download platform data scoped to the active edition.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {exports.map((exp) => (
          <div key={exp.title} className="rounded-xl border p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-muted p-2.5">
                <exp.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
              </div>
            </div>
            <Button
              onClick={exp.action}
              disabled={exp.mutation.isPending}
              variant="outline"
              className="w-full"
            >
              {exp.mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download CSV
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
