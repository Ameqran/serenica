import Keycloak from 'keycloak-js';

const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
const keycloakRealm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const keycloakClientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

let keycloakInstance: Keycloak | null = null;

export function getKeycloakClient(): Keycloak {
  if (!keycloakUrl || !keycloakRealm || !keycloakClientId) {
    throw new Error('Missing Keycloak environment variables.');
  }

  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: keycloakUrl,
      realm: keycloakRealm,
      clientId: keycloakClientId
    });
  }

  return keycloakInstance;
}
