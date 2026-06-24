import { contractIds } from "@/utils/contracts";
import type { Credential, ReputationScore } from "@/types/credential";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const stellarService = {
  contractIds,
  getRecentEvents: () => request("/events/recent"),
  getReputation: (address: string) => request<ReputationScore>(`/reputation/${address}`),
  getCredentialsByRecipient: (address: string) =>
    request<Credential[]>(`/credentials/recipient/${address}`),
  verifyCredential: (credentialId: string, requesterAddress: string) =>
    request("/verification/verify", {
      method: "POST",
      body: JSON.stringify({ credentialId, requesterAddress }),
    }),
  registerInstitution: (payload: Record<string, string>) =>
    request("/institutions/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
