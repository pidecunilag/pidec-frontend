'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type AutosaveOptions = {
  enabled?: boolean;
  debounceMs?: number;
  shouldSave?: boolean;
};

/**
 * Autosave hook: persists draft data quickly while typing and during page exits.
 * Key format: pidec_draft_{teamId}_{editionId}_{stage}
 */
export function useAutosave<T>(
  key: string,
  data: T,
  intervalMs = 30_000,
  options: AutosaveOptions = {},
) {
  const enabled = options.enabled ?? true;
  const debounceMs = options.debounceMs ?? 1_000;
  const shouldSave = options.shouldSave ?? true;
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const dataRef = useRef(data);
  const canRead = enabled && key.trim().length > 0;
  const canSave = canRead && shouldSave;

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draftExists = canRead ? localStorage.getItem(key) !== null : false;
    queueMicrotask(() => setHasSavedDraft(draftExists));
  }, [canRead, key]);

  const save = useCallback(() => {
    if (typeof window === 'undefined' || !canSave) return;

    try {
      const serialized = JSON.stringify(dataRef.current);
      localStorage.setItem(key, serialized);
      setLastSavedAt(new Date());
      setHasSavedDraft(true);
    } catch {
      // localStorage can be full or unavailable in private browsing.
    }
  }, [canSave, key]);

  useEffect(() => {
    if (!canSave || debounceMs <= 0) return;
    const timeout = window.setTimeout(save, debounceMs);
    return () => window.clearTimeout(timeout);
  }, [canSave, data, debounceMs, save]);

  useEffect(() => {
    if (!canSave || intervalMs <= 0) return;
    const interval = window.setInterval(save, intervalMs);
    return () => window.clearInterval(interval);
  }, [canSave, intervalMs, save]);

  useEffect(() => {
    if (!canSave) return;

    const saveOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') save();
    };

    window.addEventListener('blur', save);
    window.addEventListener('beforeunload', save);
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', saveOnVisibilityChange);

    return () => {
      window.removeEventListener('blur', save);
      window.removeEventListener('beforeunload', save);
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', saveOnVisibilityChange);
    };
  }, [canSave, save]);

  const restoreDraft = useCallback((): T | null => {
    if (typeof window === 'undefined' || !key.trim()) return null;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined' || !key.trim()) return;
    localStorage.removeItem(key);
    setLastSavedAt(null);
    setHasSavedDraft(false);
  }, [key]);

  const hasDraft = useCallback((): boolean => {
    if (typeof window === 'undefined' || !key.trim()) return false;
    return localStorage.getItem(key) !== null;
  }, [key]);

  return {
    save,
    restoreDraft,
    clearDraft,
    hasDraft,
    hasSavedDraft,
    lastSavedAt,
  };
}

/**
 * Generate a consistent autosave key from team/edition/stage context.
 */
export function getAutosaveKey(teamId: string, editionId: string, stage: number) {
  return `pidec_draft_${teamId}_${editionId}_${stage}`;
}
