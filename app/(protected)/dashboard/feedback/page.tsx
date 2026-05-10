'use client';

import { Award, MessageSquareText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  PageHero,
  STAGE_META,
  StudentPanel,
  formatDateTime,
} from '@/components/student/dashboard-utils';
import { useFeedback } from '@/lib/hooks/use-feedback';
import { useSubmissions } from '@/lib/hooks/use-submissions';

export default function StudentFeedbackPage() {
  const { feedback, isLoading } = useFeedback();
  const { submissions } = useSubmissions();

  return (
    <div className="space-y-8">
      <PageHero
        title="Published feedback"
        description="Feedback appears here only after admin publishes it for your team."
      />

      {isLoading ? (
        <StudentPanel title="Loading feedback">
          <Skeleton className="h-40 w-full rounded-xl" />
        </StudentPanel>
      ) : feedback.length === 0 ? (
        <StudentPanel title="No Published Feedback" description="Your team feedback is not available yet.">
          <EmptyState
            title="Nothing published yet"
            description="After judges score and admin publishes results, your scores and comments will appear here."
          />
        </StudentPanel>
      ) : (
        <div className="space-y-5">
          {feedback.map((item) => {
            const submission = submissions.find((entry) => entry.id === item.submissionId);
            return (
              <StudentPanel
                key={item.id}
                title={submission ? STAGE_META[submission.stage].title : 'Submission Feedback'}
                description={`Evaluator: ${item.evaluatorName ?? 'PIDEC judging panel'}`}
                action={<OutcomeBadge outcome={item.outcome} />}
              >
                <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(142,77,255,0.12),rgba(18,183,234,0.1))] p-5">
                    <Award className="h-8 w-8 text-[var(--brand-orange)]" />
                    <p className="mt-4 text-sm text-muted-foreground">Overall score</p>
                    <p className="font-heading text-5xl font-semibold text-[var(--brand-plum)]">
                      {item.totalScore ?? '-'}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Published {formatDateTime(item.publishedAt)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(item.scores ?? {}).length === 0 ? (
                      <p className="rounded-xl border bg-white/80 p-4 text-sm text-muted-foreground">
                        Score breakdown was not provided.
                      </p>
                    ) : (
                      Object.entries(item.scores).map(([criterion, score]) => (
                        <div key={criterion} className="rounded-xl border bg-white/80 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium capitalize">{criterion.replaceAll('_', ' ')}</p>
                            <Badge variant="secondary">{score} pts</Badge>
                          </div>
                          {item.comments?.[criterion] ? (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {item.comments[criterion]}
                            </p>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </StudentPanel>
            );
          })}
        </div>
      )}

      <StudentPanel
        title="Feedback Rules"
        description="Visibility is controlled by admin after judges complete evaluations."
      >
        <div className="flex items-start gap-3 rounded-xl bg-white/80 p-4">
          <MessageSquareText className="mt-0.5 h-5 w-5 text-[var(--brand-cyan)]" />
          <p className="text-sm text-muted-foreground">
            Teams cannot see judge scores before publication, and no team can see another team&apos;s feedback.
          </p>
        </div>
      </StudentPanel>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string | null | undefined }) {
  if (!outcome) return <Badge variant="secondary">Pending</Badge>;
  if (outcome === 'advanced') return <Badge className="bg-[var(--brand-plum)] text-white">Advanced</Badge>;
  if (outcome === 'not_advanced') return <Badge variant="destructive">Not advanced</Badge>;
  return <Badge variant="secondary">{outcome}</Badge>;
}
