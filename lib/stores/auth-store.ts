'use client';

import { create } from 'zustand';

import type { User, VerificationStatus } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationStatus: VerificationStatus | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  verificationStatus: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      verificationStatus: user.verificationStatus,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      verificationStatus: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setVerificationStatus: (verificationStatus) => set({ verificationStatus }),
}));
