function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

export const frontendEnv = {
  apiUrl: normalizeUrl(
    import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "")
  ),
  analyticsEnabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || "",
  plausibleScriptUrl: import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL || "https://plausible.io/js/script.js",
  eventsWsUrl: import.meta.env.VITE_EVENTS_WS_URL || "",
  stellarNetwork: import.meta.env.VITE_STELLAR_NETWORK || "TESTNET",
  stellarNetworkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
  institutionRegistryId: import.meta.env.VITE_INSTITUTION_REGISTRY_ID || "",
  credentialRegistryId: import.meta.env.VITE_CREDENTIAL_REGISTRY_ID || "",
  reputationContractId: import.meta.env.VITE_REPUTATION_CONTRACT_ID || "",
  verificationContractId: import.meta.env.VITE_VERIFICATION_CONTRACT_ID || "",
};