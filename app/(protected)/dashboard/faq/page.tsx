'use client';

import { StudentPanel } from '@/components/student/dashboard-utils';
import { PLATFORM_GUIDE_EMBED_URL } from '@/lib/constants';

const DASHBOARD_FAQS = [
  {
    question: 'How do I create or join a team?',
    answer:
      'Open My Team from the dashboard. Team leaders can create a department team and invite members. Invited students can accept pending invites from the same page.',
  },
  {
    question: 'Where do we submit our proposal?',
    answer:
      'Open Submissions from the dashboard. When a submission window is active, the current stage form and upload controls will appear there.',
  },
  {
    question: 'Who can submit for a team?',
    answer:
      'Only the team leader can submit the stage work. Other team members can still view team status, submissions, feedback, and notifications.',
  },
  {
    question: 'Can I close the guide video on the overview?',
    answer:
      'Yes. Use the close button on the overview video. It will stay hidden on that browser, but you can always watch the guide again from this FAQ page.',
  },
  {
    question: 'Where will feedback appear?',
    answer:
      'Published feedback appears on the Feedback page and important updates also appear in Notifications.',
  },
];

export default function StudentFaqPage() {
  return (
    <div className="space-y-8">
      <StudentPanel
        title="Platform Guide"
        description="Watch the walkthrough anytime you need a refresher on teams, submissions, and dashboard actions."
      >
        <div className="overflow-hidden rounded-2xl border border-[rgba(42,0,59,0.1)] bg-black shadow-[0_18px_44px_rgba(42,0,59,0.08)]">
          <iframe
            src={PLATFORM_GUIDE_EMBED_URL}
            title="How to use the PIDEC platform"
            className="aspect-video w-full"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </StudentPanel>

      <StudentPanel
        title="Frequently Asked Questions"
        description="Quick answers for common student dashboard tasks."
      >
        <div className="divide-y divide-[rgba(42,0,59,0.08)]">
          {DASHBOARD_FAQS.map((item) => (
            <div key={item.question} className="py-5 first:pt-0 last:pb-0">
              <h3 className="font-heading text-lg font-semibold text-[var(--brand-plum)]">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </StudentPanel>
    </div>
  );
}
