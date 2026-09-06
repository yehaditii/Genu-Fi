export interface Credential {
  id?: string;
  credentialId: string;
  issuer: string;
  issuerAddress?: string;
  recipient: string;
  recipientAddress?: string;
  credentialHash?: string;
  credentialType: string;
  issuedAt: string;
  status: "active" | "revoked";
    verificationStatus?: "valid" | "invalid" | "not_verified";
  metadata: string;
  transactionHash?: string;
}

export interface ReputationScore {
  totalScore: number;
  hackathonCount?: number;
  internshipCount?: number;
  courseCount?: number;
  lastUpdated?: string;
}

export interface PreparedTransaction {
  transactionXdr: string;
  credentialId: string;
  isValid?: boolean;
  contractId: string;
  network: string;
}

export interface TransactionResult {
  txHash: string;
  status: string;
  ledger?: number;
  network: string;
}

export interface VerificationResult {
  isValid: boolean;
  verification?: {
    credential_id?: string;
    verifier?: string;
    is_valid?: boolean;
    verified_at?: string;
  } | null;
  source: "stellar";
}
