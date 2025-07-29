'use client';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  // console.log("Pathname Guard: ", pathname)

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     redirect(`/api/auth/login?returnTo=/${pathname}`);
  //   }
  // }, [isLoading, user, pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push(`/auth/login?returnTo=${pathname}`);
  }

  return <>{children}</>;
};

export default SessionGuard;