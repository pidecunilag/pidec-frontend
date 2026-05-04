'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, verificationStatus, setUser, clearUser, setLoading } =
    useAuthStore();

  // Hydrate session on mount
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const me = await authApi.getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearUser();
      }
    }

    if (!isAuthenticated && isLoading) {
      hydrate();
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, setUser, clearUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      try {
        const me = await authApi.login(data);
        setUser(me);

        // Route based on role
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

        return me;
      } catch (error) {
        setLoading(false);
        throw extractApiError(error);
      }
    },
    [router, setUser, setLoading],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true);
      try {
        const me = await authApi.register(data);
        setUser(me);
        return me;
      } catch (error) {
        setLoading(false);
        throw extractApiError(error);
      }
    },
    [setUser, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearUser();
      router.push('/login');
    }
  }, [router, clearUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    verificationStatus,
    login,
    register,
    logout,
  };
}
