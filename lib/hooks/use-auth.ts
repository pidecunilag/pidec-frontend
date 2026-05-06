'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api/client';
import { qk } from '@/lib/api/query-keys';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { LoginRequest, RegisterRequest, User } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, isAuthenticated, isLoading, verificationStatus, setUser, clearUser, setLoading } =
    useAuthStore();

  // Hydrate session from /auth/me. The store remains the sync source of truth for components;
  // the query exists so login/logout/refresh all flow through one cache key.
  const meQuery = useQuery({
    queryKey: qk.me,
    queryFn: authApi.getMe,
    enabled: isLoading && !isAuthenticated,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isSuccess && meQuery.data) {
      setUser(meQuery.data);
    } else if (meQuery.isError) {
      clearUser();
    }
  }, [meQuery.isSuccess, meQuery.isError, meQuery.data, setUser, clearUser]);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onMutate: () => setLoading(true),
    onSuccess: (me) => {
      qc.setQueryData<User>(qk.me, me);
      setUser(me);
      switch (me.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'judge':
          router.push('/judge');
          break;
        default:
          router.push('/dashboard');
      }
    },
    onError: () => setLoading(false),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onMutate: () => setLoading(true),
    onSuccess: (me) => {
      qc.setQueryData<User>(qk.me, me);
      setUser(me);
    },
    onError: () => setLoading(false),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      qc.removeQueries({ queryKey: qk.me });
      qc.clear();
      clearUser();
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    verificationStatus,

    login: async (data: LoginRequest) => {
      try {
        return await loginMutation.mutateAsync(data);
      } catch (error) {
        throw extractApiError(error);
      }
    },
    register: async (data: RegisterRequest) => {
      try {
        return await registerMutation.mutateAsync(data);
      } catch (error) {
        throw extractApiError(error);
      }
    },
    logout: () => logoutMutation.mutateAsync(),
  };
}
