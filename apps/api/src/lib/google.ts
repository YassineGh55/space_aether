import { OAuth2Client } from "google-auth-library";

let client: OAuth2Client | null = null;

export function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  if (!client) client = new OAuth2Client(clientId);
  return client;
}
