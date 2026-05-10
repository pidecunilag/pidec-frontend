'use client';

import Link from 'next/link';
import { BellRing, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  PageHero,
  StudentPanel,
  formatDateTime,
} from '@/components/student/dashboard-utils';
import { extractApiError } from '@/lib/api/client';
import { useNotifications } from '@/lib/hooks/use-notifications';

export default function StudentNotificationsPage() {
  const { notifications, unreadCount, isLoading, markRead, markAllRead } = useNotifications();

  const runMarkAll = async () => {
    try {
      await markAllRead();
      toast.success('Notifications marked as read.');
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  const runMarkRead = async (id: string) => {
    try {
      await markRead(id);
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  return (
    <div className="space-y-8">
      <PageHero
        title="Notifications"
        description="Track team invites, submission confirmations, feedback releases, and stage movement."
      >
        <Button onClick={runMarkAll} disabled={unreadCount === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </PageHero>

      <StudentPanel
        title="Notification Feed"
        description={`${unreadCount} unread update${unreadCount === 1 ? '' : 's'}.`}
      >
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="Important team and competition updates will appear here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex flex-col gap-4 rounded-xl border bg-white/84 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(42,0,59,0.08)] sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex gap-3">
                  <div className={notification.read ? 'rounded-xl bg-muted p-2 text-muted-foreground' : 'rounded-xl bg-[rgba(255,85,0,0.12)] p-2 text-[var(--brand-orange)]'}>
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--brand-plum)]">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.type.replaceAll('_', ' ')} · {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {notification.actionUrl ? (
                    <Button asChild variant="outline" size="sm" onClick={() => runMarkRead(notification.id)}>
                      <Link href={notification.actionUrl}>Open</Link>
                    </Button>
                  ) : null}
                  {!notification.read ? (
                    <Button size="sm" onClick={() => runMarkRead(notification.id)}>
                      Mark read
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </StudentPanel>
    </div>
  );
}
