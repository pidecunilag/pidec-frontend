'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Autosave hook — persists form data to localStorage on a timed interval
 * and on window blur. Key format: pidec_draft_{teamId}_{editionId}_{stage}
 */
export function useAutosave<T>(key: string, data: T, intervalMs = 30_000) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const save = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(dataRef.current);
      localStorage.setItem(key, serialized);
      setLastSavedAt(new Date());
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [key]);

  // Save on interval
  useEffect(() => {
    const interval = setInterval(save, intervalMs);
    return () => clearInterval(interval);
  }, [save, intervalMs]);

  // Save on window blur
  useEffect(() => {
    window.addEventListener('blur', save);
    return () => window.removeEventListener('blur', save);
  }, [save]);

  const restoreDraft = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    setLastSavedAt(null);
  }, [key]);

  const hasDraft = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) !== null;
  }, [key]);

  return {
    save,
    restoreDraft,
    clearDraft,
    hasDraft,
    lastSavedAt,
  };
}

/**
 * Generate a consistent autosave key from team/edition/stage context.
 */
export function getAutosaveKey(teamId: string, editionId: string, stage: number) {
  return `pidec_draft_${teamId}_${editionId}_${stage}`;
}
