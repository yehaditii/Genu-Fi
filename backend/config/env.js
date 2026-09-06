const dotenv = require("dotenv");

dotenv.config();

function parseList(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || "",
  stellarRpcUrl:
    process.env.STELLAR_RPC_URL ||
    (process.env.NODE_ENV === "production" ? "" : "https://soroban-testnet.stellar.org"),
  stellarNetworkPassphrase:
    process.env.STELLAR_NETWORK_PASSPHRASE ||
    (process.env.NODE_ENV === "production" ? "" : "Test SDF Network ; September 2015"),
  stellarSecretKey: process.env.STELLAR_SECRET_KEY || "",
  institutionRegistryId: process.env.INSTITUTION_REGISTRY_ID || "",
  credentialRegistryId: process.env.CREDENTIAL_REGISTRY_ID || "",
  reputationContractId: process.env.REPUTATION_CONTRACT_ID || "",
  verificationContractId: process.env.VERIFICATION_CONTRACT_ID || "",
  corsOrigins: parseList(
    process.env.CORS_ORIGINS ||
      "http://localhost:8080,http://localhost:5173,https://genu-fi.vercel.app"
  ),
};

function validateEnvironment() {
  if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  if (env.nodeEnv !== "production") {
    return;
  }

  const required = [
    ["MONGODB_URI", env.mongodbUri],
    ["STELLAR_RPC_URL", env.stellarRpcUrl],
    ["STELLAR_NETWORK_PASSPHRASE", env.stellarNetworkPassphrase],
    ["STELLAR_SECRET_KEY", env.stellarSecretKey],
    ["INSTITUTION_REGISTRY_ID", env.institutionRegistryId],
    ["CREDENTIAL_REGISTRY_ID", env.credentialRegistryId],
    ["REPUTATION_CONTRACT_ID", env.reputationContractId],
    ["VERIFICATION_CONTRACT_ID", env.verificationContractId],
    ["CORS_ORIGINS", process.env.CORS_ORIGINS],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}

module.exports = { env, validateEnvironment };