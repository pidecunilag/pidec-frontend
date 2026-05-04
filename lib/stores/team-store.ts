'use client';

import { create } from 'zustand';

import type { Team, TeamInvite } from '@/lib/types';

interface TeamState {
  team: Team | null;
  invites: TeamInvite[];
  isLoading: boolean;
}

interface TeamActions {
  setTeam: (team: Team | null) => void;
  setInvites: (invites: TeamInvite[]) => void;
  clearTeam: () => void;
  setLoading: (isLoading: boolean) => void;
  removeInvite: (inviteId: string) => void;
  removeMember: (userId: string) => void;
}

export const useTeamStore = create<TeamState & TeamActions>((set) => ({
  team: null,
  invites: [],
  isLoading: true,

  setTeam: (team) => set({ team, isLoading: false }),

  setInvites: (invites) => set({ invites }),

  clearTeam: () => set({ team: null, invites: [], isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  removeInvite: (inviteId) =>
    set((state) => ({
      invites: state.invites.filter((inv) => inv.id !== inviteId),
    })),

  removeMember: (userId) =>
    set((state) => {
      if (!state.team) return state;
      return {
        team: {
          ...state.team,
          members: state.team.members.filter((m) => m.id !== userId),
        },
      };
    }),
}));
