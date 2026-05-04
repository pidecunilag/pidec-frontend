'use client';

import { useCallback, useEffect, useState } from 'react';

import { teamsApi } from '@/lib/api/teams';
import { extractApiError } from '@/lib/api/client';
import { useTeamStore } from '@/lib/stores/team-store';
import type { EligibleTeammate } from '@/lib/types';

export function useTeam() {
  const {
    team,
    invites,
    isLoading,
    setTeam,
    setInvites,
    clearTeam,
    setLoading,
    removeInvite,
    removeMember,
  } = useTeamStore();

  const [searchResults, setSearchResults] = useState<EligibleTeammate[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch team + invites on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [teamData, inviteData] = await Promise.allSettled([
          teamsApi.getMyTeam(),
          teamsApi.getInvites(),
        ]);

        if (cancelled) return;

        if (teamData.status === 'fulfilled') setTeam(teamData.value);
        else setTeam(null);

        if (inviteData.status === 'fulfilled') setInvites(inviteData.value);
      } catch {
        if (!cancelled) clearTeam();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [setTeam, setInvites, clearTeam, setLoading]);

  const createTeam = useCallback(
    async (name: string) => {
      const created = await teamsApi.createTeam({ name });
      setTeam(created);
      return created;
    },
    [setTeam],
  );

  const dissolveTeam = useCallback(
    async (teamId?: string) => {
      await teamsApi.dissolveTeam(teamId);
      clearTeam();
    },
    [clearTeam],
  );

  const searchTeammates = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await teamsApi.searchTeammates(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const sendInvite = useCallback(async (inviteeId: string) => {
    const invite = await teamsApi.sendInvite({ inviteeId });
    return invite;
  }, []);

  const acceptInvite = useCallback(
    async (inviteId: string) => {
      await teamsApi.acceptInvite(inviteId);
      removeInvite(inviteId);

      // Refresh team state after accepting
      try {
        const updatedTeam = await teamsApi.getMyTeam();
        setTeam(updatedTeam);
      } catch {
        // Team fetch may fail if still processing
      }
    },
    [removeInvite, setTeam],
  );

  const declineInvite = useCallback(
    async (inviteId: string) => {
      await teamsApi.declineInvite(inviteId);
      removeInvite(inviteId);
    },
    [removeInvite],
  );

  const handleRemoveMember = useCallback(
    async (userId: string) => {
      await teamsApi.removeMember(userId);
      removeMember(userId);
    },
    [removeMember],
  );

  return {
    team,
    invites,
    isLoading,
    searchResults,
    isSearching,
    createTeam,
    dissolveTeam,
    searchTeammates,
    sendInvite,
    acceptInvite,
    declineInvite,
    removeMember: handleRemoveMember,
  };
}
