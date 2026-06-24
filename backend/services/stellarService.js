const { rpc } = require("@stellar/stellar-sdk");

const server = () => new rpc.Server(process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org");

async function issueCredential(payload) {
  return {
    success: true,
    network: process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
    contractId: process.env.CREDENTIAL_REGISTRY_ID || "credential-registry-dev",
    rpcUrl: process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
    request: payload,
    txHash: `stellar-${Date.now()}`,
  };
}

async function verifyCredential(credentialId) {
  return {
    credentialId,
    isValid: true,
    source: "soroban-simulated",
  };
}

async function getReputationScore(userAddress) {
  return {
    userAddress,
    totalScore: 60,
    hackathonCount: 1,
    internshipCount: 0,
    courseCount: 1,
    lastUpdated: new Date().toISOString(),
  };
}

async function registerInstitution(payload) {
  return {
    success: true,
    contractId: process.env.INSTITUTION_REGISTRY_ID || "institution-registry-dev",
    request: payload,
    txHash: `stellar-${Date.now()}`,
  };
}

module.exports = {
  server,
  issueCredential,
  verifyCredential,
  getReputationScore,
  registerInstitution,
};
