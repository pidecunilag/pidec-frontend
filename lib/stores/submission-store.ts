'use client';

import { create } from 'zustand';

import type { Submission } from '@/lib/types';

interface SubmissionState {
  submissions: Submission[];
  activeSubmission: Submission | null;
  isLoading: boolean;
}

interface SubmissionActions {
  setSubmissions: (submissions: Submission[]) => void;
  setActiveSubmission: (submission: Submission | null) => void;
  setLoading: (isLoading: boolean) => void;
  addSubmission: (submission: Submission) => void;
}

export const useSubmissionStore = create<SubmissionState & SubmissionActions>((set) => ({
  submissions: [],
  activeSubmission: null,
  isLoading: true,

  setSubmissions: (submissions) => set({ submissions, isLoading: false }),

  setActiveSubmission: (activeSubmission) => set({ activeSubmission }),

  setLoading: (isLoading) => set({ isLoading }),

  addSubmission: (submission) =>
    set((state) => ({
      submissions: [...state.submissions, submission],
    })),
}));
