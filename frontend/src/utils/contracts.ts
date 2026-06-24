import type { ContractIds } from "@/types/stellar";

export const contractIds: ContractIds = {
  institutionRegistry: import.meta.env.VITE_INSTITUTION_REGISTRY_ID ?? "institution-registry-dev",
  credentialRegistry: import.meta.env.VITE_CREDENTIAL_REGISTRY_ID ?? "credential-registry-dev",
  reputation: import.meta.env.VITE_REPUTATION_CONTRACT_ID ?? "reputation-dev",
  verification: import.meta.env.VITE_VERIFICATION_CONTRACT_ID ?? "verification-dev",
};
