'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { authApi } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { VerificationStatus } from '@/lib/types';

const POLL_INTERVAL_MS = 5_000;

export function useVerification() {
  const { verificationStatus, setVerificationStatus } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    try {
      const result = await authApi.getVerificationStatus();
      setVerificationStatus(result.status as VerificationStatus);

      // Stop polling once we reach a terminal state
      if (result.status !== 'pending') {
        stopPolling();
      }
    } catch (err) {
      const apiError = extractApiError(err);
      if (apiError.code === 'AUTH_REQUIRED') {
        setError('AUTH_REQUIRED');
      }
      stopPolling();
    }
  }, [setVerificationStatus, stopPolling]);

  // Auto-poll when status is pending
  useEffect(() => {
    if (verificationStatus === 'pending' && !pollRef.current) {
      pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    }

    return stopPolling;
  }, [verificationStatus, poll, stopPolling]);

  const uploadDoc = useCallback(
    async (file: File, unauthData?: { email: string; matricNumber: string }) => {
      setIsUploading(true);
      setError(null);
      try {
        await authApi.uploadVerificationDoc(file, unauthData);
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
    isUploading,
    error,
    uploadDoc,
    reuploadDoc,
  };
}
