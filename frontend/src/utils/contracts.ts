import type { ContractIds } from "@/types/stellar";
import { frontendEnv } from "@/config/env";

export const contractIds: ContractIds = {
  institutionRegistry: frontendEnv.institutionRegistryId,
  credentialRegistry: frontendEnv.credentialRegistryId,
  reputation: frontendEnv.reputationContractId,
  verification: frontendEnv.verificationContractId,
};
