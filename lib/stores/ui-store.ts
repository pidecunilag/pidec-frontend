'use client';

import { create } from 'zustand';

interface UiState {
  announcementBanner: string | null;
  globalLoading: boolean;
}

interface UiActions {
  setAnnouncementBanner: (banner: string | null) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  announcementBanner: null,
  globalLoading: false,

  setAnnouncementBanner: (announcementBanner) => set({ announcementBanner }),
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}));
