'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useApi';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      setIsRedirecting(true);
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || isRedirecting) {
    return <LoadingSkeleton />;
  }

  if (!user || user.role !== 'ADMIN' || isError) {
    return null;
  }

  return <>{children}</>;
}
