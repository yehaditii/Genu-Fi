export interface Credential {
  id: string;
  issuer: string;
  recipient: string;
  credentialType: string;
  issuedAt: string;
  status: "active" | "revoked";
  metadata: string;
}

export interface ReputationScore {
  totalScore: number;
  hackathonCount: number;
  internshipCount: number;
  courseCount: number;
  lastUpdated: string;
}
