'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function UserGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/auth/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}