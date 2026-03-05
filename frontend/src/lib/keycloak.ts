import Keycloak from 'keycloak-js';

const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? 'http://localhost:8081';
const keycloakRealm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? 'serenica';
const keycloakClientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'serenica-frontend';

let keycloakInstance: Keycloak | null = null;

export function getKeycloakClient(): Keycloak {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: keycloakUrl,
      realm: keycloakRealm,
      clientId: keycloakClientId
    });
  }

  return keycloakInstance;
}
