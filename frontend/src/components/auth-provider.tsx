'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type Keycloak from 'keycloak-js';
import { getKeycloakClient } from '@/lib/keycloak';

type AuthState = {
  ready: boolean;
  token: string | null;
  userName: string;
  error: string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  ready: false,
  token: null,
  userName: 'Therapist',
  error: null,
  logout: () => undefined
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('Therapist');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let refreshInterval: ReturnType<typeof setInterval> | null = null;
    let client: Keycloak;

    async function init() {
      try {
        client = getKeycloakClient();
        const authenticated = await client.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256'
        });

        if (!mounted) return;

        if (!authenticated || !client.token) {
          setError('Authentication failed.');
          setReady(true);
          return;
        }

        setToken(client.token);
        setUserName(
          client.tokenParsed?.name?.toString() ||
            client.tokenParsed?.preferred_username?.toString() ||
            'Therapist'
        );
        setReady(true);

        refreshInterval = setInterval(async () => {
          try {
            const refreshed = await client.updateToken(60);
            if (refreshed && mounted) {
              setToken(client.token ?? null);
            }
          } catch {
            if (mounted) {
              setError('Session refresh failed. Please login again.');
            }
          }
        }, 30000);
      } catch (initError) {
        if (mounted) {
          setError((initError as Error).message || 'Could not initialize authentication.');
          setReady(true);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      token,
      userName,
      error,
      logout: () => {
        try {
          getKeycloakClient().logout({ redirectUri: window.location.origin });
        } catch {
          window.location.reload();
        }
      }
    }),
    [error, ready, token, userName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
