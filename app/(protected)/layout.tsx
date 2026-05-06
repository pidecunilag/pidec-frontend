'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';

const ROLE_HOME: Record<string, string> = {
  student: '/dashboard',
  judge: '/judge',
  admin: '/admin',
};

function rootSegment(pathname: string): string {
  return '/' + (pathname.split('/').filter(Boolean)[0] ?? '');
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Gate: unauthenticated → /login. Wrong-role surface → bounce to their home.
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    const home = ROLE_HOME[user.role];
    if (home && rootSegment(pathname) !== home) {
      router.replace(home);
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
