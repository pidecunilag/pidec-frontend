'use client';

import { useCallback, useEffect, useRef } from 'react';

import { notificationsApi } from '@/lib/api/notifications';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { NOTIFICATION_POLL_INTERVAL_MS } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useNotifications() {
  const { isAuthenticated } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    setNotifications,
    appendNotifications,
    markAsRead,
    markAllAsRead: markAllAsReadStore,
    setLoading,
  } = useNotificationStore();

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch {
      // Fail silently — notifications are non-critical
    }
  }, [setNotifications]);

  const loadMore = useCallback(
    async (cursor: string) => {
      try {
        const { data } = await notificationsApi.getNotifications({ cursor });
        appendNotifications(data);
      } catch {
        // Fail silently
      }
    },
    [appendNotifications],
  );

  // Initial load + polling
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    fetchNotifications();

    pollRef.current = setInterval(fetchNotifications, NOTIFICATION_POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isAuthenticated, fetchNotifications, setLoading]);

  const markRead = useCallback(
    async (notificationId: string) => {
      // Optimistic update
      markAsRead(notificationId);
      try {
        await notificationsApi.markRead(notificationId);
      } catch {
        // Re-fetch on failure to correct state
        fetchNotifications();
      }
    },
    [markAsRead, fetchNotifications],
  );

  const markAllRead = useCallback(async () => {
    // Optimistic update
    markAllAsReadStore();
    try {
      await notificationsApi.markAllRead();
    } catch {
      fetchNotifications();
    }
  }, [markAllAsReadStore, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    loadMore,
    refresh: fetchNotifications,
  };
}
