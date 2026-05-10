'use client';

import { useQuery } from '@tanstack/react-query';

import { publicApi } from '@/lib/api/public';
import { qk } from '@/lib/api/query-keys';

export function useEdition() {
  const query = useQuery({
    queryKey: qk.public.landingData,
    queryFn: publicApi.getLandingData,
    staleTime: 30_000,
  });

  return {
    edition: query.data?.edition ?? null,
    announcementBanner:
      query.data?.announcementBanner ?? query.data?.edition?.announcementBanner ?? null,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
