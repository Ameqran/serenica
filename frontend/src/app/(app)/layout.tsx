'use client';

import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/components/auth-provider';
import { ErrorState, LoadingState } from '@/components/state';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, token, error } = useAuth();

  if (!ready) {
    return <LoadingState message="Authenticating with Keycloak..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!token) {
    return <LoadingState message="Redirecting to login..." />;
  }

  return <AppShell>{children}</AppShell>;
}
