import { contractIds } from "@/utils/contracts";
import { frontendEnv } from "@/config/env";
import type {
  Credential,
  PreparedTransaction,
  ReputationScore,
  TransactionResult,
  VerificationResult,
} from "@/types/credential";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!frontendEnv.apiUrl) {
    throw new Error("VITE_API_URL must be configured for production API access.");
  }

  const response = await fetch(`${frontendEnv.apiUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } | string }
      | null;
    const errorMessage =
      typeof payload?.error === "string" ? payload.error : payload?.error?.message;
    throw new Error(errorMessage || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const stellarService = {
  contractIds,
  getRecentEvents: () => request("/events/recent"),
  getReputation: (address: string) => request<ReputationScore>(`/reputation/${address}`),
  getCredentialsByRecipient: (address: string) =>
    request<Credential[]>(`/credentials/recipient/${address}`),
  getCredential: (credentialId: string, sourceAddress: string) =>
    request<Credential>(
      `/credentials/${encodeURIComponent(credentialId)}?sourceAddress=${encodeURIComponent(sourceAddress)}`
    ),
  prepareCredentialIssuance: (payload: Record<string, string>) =>
    request<{ success: true; transaction: PreparedTransaction }>("/credentials/prepare", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  submitCredentialIssuance: (payload: Record<string, string>) =>
    request<{ success: true; credential: Credential; tx: TransactionResult }>("/credentials/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verifyCredential: (credentialId: string, requesterAddress: string) =>
    request<VerificationResult>("/verification/verify", {
      method: "POST",
      body: JSON.stringify({ credentialId, requesterAddress }),
    }),
  prepareVerification: (credentialId: string, requesterAddress: string) =>
    request<{ success: true; transaction: PreparedTransaction }>("/verification/prepare", {
      method: "POST",
      body: JSON.stringify({ credentialId, requesterAddress }),
    }),
  submitVerification: (payload: Record<string, string>) =>
    request<{ success: true; verification: unknown; result: TransactionResult }>("/verification/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  registerInstitution: (payload: Record<string, string>) =>
    request("/institutions/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
