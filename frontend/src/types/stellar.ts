export interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
  network: string;
}

export interface ContractIds {
  institutionRegistry: string;
  credentialRegistry: string;
  reputation: string;
  verification: string;
}
