'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamsApi } from '@/lib/api/teams';
import { qk } from '@/lib/api/query-keys';
import type { Team, TeamInvite } from '@/lib/types';

export function useTeam() {
  const qc = useQueryClient();

  const teamQuery = useQuery({
    queryKey: qk.team.mine,
    queryFn: teamsApi.getMyTeam,
  });

  // PRD §5.2 — invite list polled every 60s so expiry transitions are visible without a manual refresh.
  const invitesQuery = useQuery({
    queryKey: qk.team.invites,
    queryFn: teamsApi.getInvites,
    refetchInterval: 60_000,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const searchResultsQuery = useQuery({
    queryKey: qk.team.search(searchQuery),
    queryFn: () => teamsApi.searchTeammates(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const createTeamMutation = useMutation({
    mutationFn: (name: string) => teamsApi.createTeam({ name }),
    onSuccess: (created) => {
      qc.setQueryData(qk.team.mine, created);
      qc.invalidateQueries({ queryKey: qk.team.mine });
    },
  });

  const dissolveTeamMutation = useMutation({
    mutationFn: (teamId?: string) => teamsApi.dissolveTeam(teamId),
    onSuccess: () => {
      qc.setQueryData<Team | null>(qk.team.mine, null);
      qc.invalidateQueries({ queryKey: qk.team.invites });
    },
  });

  const sendInviteMutation = useMutation({
    mutationFn: (inviteeId: string) => teamsApi.sendInvite({ inviteeId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team', 'search'] });
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (inviteId: string) => teamsApi.acceptInvite(inviteId),
    onMutate: async (inviteId) => {
      await qc.cancelQueries({ queryKey: qk.team.invites });
      const previous = qc.getQueryData<TeamInvite[]>(qk.team.invites);
      qc.setQueryData<TeamInvite[]>(qk.team.invites, (old) =>
        old?.filter((inv) => inv.id !== inviteId) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.team.invites, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.team.mine });
      qc.invalidateQueries({ queryKey: qk.team.invites });
    },
  });

  const declineInviteMutation = useMutation({
    mutationFn: (inviteId: string) => teamsApi.declineInvite(inviteId),
    onMutate: async (inviteId) => {
      await qc.cancelQueries({ queryKey: qk.team.invites });
      const previous = qc.getQueryData<TeamInvite[]>(qk.team.invites);
      qc.setQueryData<TeamInvite[]>(qk.team.invites, (old) =>
        old?.filter((inv) => inv.id !== inviteId) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.team.invites, ctx.previous);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => teamsApi.removeMember(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.team.mine });
    },
  });

  return {
    team: teamQuery.data ?? null,
    invites: invitesQuery.data ?? [],
    isLoading: teamQuery.isPending,

    searchTeammates: setSearchQuery,
    searchResults: searchResultsQuery.data ?? [],
    isSearching: searchResultsQuery.isFetching,

    createTeam: createTeamMutation.mutateAsync,
    dissolveTeam: dissolveTeamMutation.mutateAsync,
    sendInvite: sendInviteMutation.mutateAsync,
    acceptInvite: acceptInviteMutation.mutateAsync,
    declineInvite: declineInviteMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
  };
}
