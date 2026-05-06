'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsApi } from '@/lib/api/notifications';
import { qk } from '@/lib/api/query-keys';
import { NOTIFICATION_POLL_INTERVAL_MS } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Notification } from '@/lib/types';

export function useNotifications() {
  const qc = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const query = useQuery({
    queryKey: qk.notifications.list,
    queryFn: () => notificationsApi.getNotifications(),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? NOTIFICATION_POLL_INTERVAL_MS : false,
  });

  const notifications = query.data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markRead(notificationId),
    onMutate: async (notificationId) => {
      await qc.cancelQueries({ queryKey: qk.notifications.list });
      const previous = qc.getQueryData<{ data: Notification[]; meta?: unknown }>(
        qk.notifications.list,
      );
      qc.setQueryData<{ data: Notification[]; meta?: unknown }>(
        qk.notifications.list,
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((n) =>
                  n.id === notificationId ? { ...n, read: true } : n,
                ),
              }
            : old,
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.notifications.list, ctx.previous);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.notifications.list });
      const previous = qc.getQueryData<{ data: Notification[]; meta?: unknown }>(
        qk.notifications.list,
      );
      qc.setQueryData<{ data: Notification[]; meta?: unknown }>(
        qk.notifications.list,
        (old) =>
          old
            ? { ...old, data: old.data.map((n) => ({ ...n, read: true })) }
            : old,
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.notifications.list, ctx.previous);
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading: query.isPending && isAuthenticated,
    markRead: markReadMutation.mutateAsync,
    markAllRead: markAllReadMutation.mutateAsync,
    refresh: query.refetch,
  };
}
