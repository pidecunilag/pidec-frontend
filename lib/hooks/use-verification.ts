'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { authApi } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { VerificationStatus } from '@/lib/types';

const POLL_INTERVAL_MS = 5_000;

interface UseVerificationOptions {
  poll?: boolean;
}

interface VerificationDetails {
  attempts?: number;
  attemptsRemaining?: number;
  cooldownRemainingMs?: number;
  lastAttemptAt?: string;
  method?: string;
  timestamp?: string;
}

function normalizeVerificationStatus(status: string): VerificationStatus {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'pending':
    case 'processing':
    case 'in_review':
      return 'pending';
    case 'verified':
    case 'approved':
    case 'success':
      return 'verified';
    case 'rejected':
    case 'failed':
    case 'declined':
    case 'mismatch':
      return 'rejected';
    case 'flagged':
    case 'manual_review':
    case 'under_review':
      return 'flagged';
    case 'suspended':
      return 'suspended';
    default:
      return 'rejected';
  }
}

export function useVerification(options: UseVerificationOptions = {}) {
  const shouldPoll = options.poll ?? false;
  const { verificationStatus, setVerificationStatus } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<VerificationDetails>({});
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPollingRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  const fetchStatus = useCallback(async () => {
    const result = await authApi.getVerificationStatus();
    const normalizedStatus = normalizeVerificationStatus(result.status);
    setError(null);
    setDetails({
      attempts: result.attempts,
      attemptsRemaining: result.attemptsRemaining,
      cooldownRemainingMs: result.cooldownRemainingMs,
      lastAttemptAt: result.lastAttemptAt,
      method: result.method,
      timestamp: result.timestamp,
    });
    setVerificationStatus(normalizedStatus);
    return normalizedStatus;
  }, [setVerificationStatus]);

  const poll = useCallback(async function runPoll() {
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;
    try {
      const normalizedStatus = await fetchStatus();

      if (normalizedStatus === 'pending') {
        pollTimeoutRef.current = setTimeout(() => {
          isPollingRef.current = false;
          void runPoll();
        }, POLL_INTERVAL_MS);
      } else {
        stopPolling();
      }
    } catch (err) {
      const apiError = extractApiError(err);
      if (apiError.code === 'AUTH_REQUIRED') {
        setError('AUTH_REQUIRED');
        stopPolling();
      } else {
        pollTimeoutRef.current = setTimeout(() => {
          isPollingRef.current = false;
          void runPoll();
        }, POLL_INTERVAL_MS);
      }
    } finally {
      if (!pollTimeoutRef.current) {
        isPollingRef.current = false;
      }
    }
  }, [fetchStatus, stopPolling]);

  useEffect(() => {
    if (!shouldPoll || verificationStatus === 'pending') return;

    let cancelled = false;
    fetchStatus().catch((err) => {
      if (cancelled) return;
      const apiError = extractApiError(err);
      setError(apiError.code === 'AUTH_REQUIRED' ? 'AUTH_REQUIRED' : apiError.message);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchStatus, shouldPoll, verificationStatus]);

  useEffect(() => {
    if (!shouldPoll || verificationStatus !== 'pending') {
      stopPolling();
      return;
    }

    if (!pollTimeoutRef.current && !isPollingRef.current) {
      void poll();
    }

    return stopPolling;
  }, [verificationStatus, poll, shouldPoll, stopPolling]);

  const uploadDoc = useCallback(
    async (file: File, unauthData?: { email: string; matricNumber: string }) => {
      setIsUploading(true);
      setError(null);
      try {
        await authApi.uploadVerificationDoc(file, unauthData);
        setDetails({});
        setVerificationStatus('pending');
      } catch (err) {
        const apiError = extractApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsUploading(false);
      }
    },
    [setVerificationStatus],
  );

  const reuploadDoc = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);
      try {
        await authApi.reuploadVerificationDoc(file);
        setDetails({});
        setVerificationStatus('pending');
      } catch (err) {
        const apiError = extractApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsUploading(false);
      }
    },
    [setVerificationStatus],
  );

  return {
    status: verificationStatus,
    cooldownRemainingMs: details.cooldownRemainingMs ?? 0,
    attempts: details.attempts,
    attemptsRemaining: details.attemptsRemaining,
    lastAttemptAt: details.lastAttemptAt,
    isUploading,
    error,
    uploadDoc,
    reuploadDoc,
  };
}
