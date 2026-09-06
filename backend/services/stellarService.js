const { contract, rpc, TransactionBuilder } = require("@stellar/stellar-sdk");
const { env } = require("../config/env");
const { captureError } = require("./monitoring");

function server() {
  return new rpc.Server(env.stellarRpcUrl);
}

function serviceError(message, statusCode = 400, code = "STELLAR_REQUEST_ERROR") {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function requireAddress(address, name) {
  if (!address || typeof address !== "string") {
    throw serviceError(`${name} is required.`);
  }
}

function requireContractId(contractId, name) {
  if (!contractId) {
    throw serviceError(`${name} contract ID is not configured.`, 503, "CONTRACT_NOT_CONFIGURED");
  }
}

async function client(contractId, publicKey, name) {
  requireContractId(contractId, name);
  requireAddress(publicKey, "sourceAddress");

  return contract.Client.from({
    contractId,
    publicKey,
    rpcUrl: env.stellarRpcUrl,
    networkPassphrase: env.stellarNetworkPassphrase,
  });
}

function credentialIdValue(value) {
  const credentialId = BigInt(value);
  if (credentialId <= 0n) {
    throw serviceError("credentialId must be a positive integer.");
  }
  return credentialId;
}

function serializeValue(value) {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeValue(item)])
    );
  }
  return value;
}

async function prepareCredentialIssuance(payload) {
  requireAddress(payload.issuerAddress, "issuerAddress");
  requireAddress(payload.recipientAddress, "recipientAddress");
  const credentialId = credentialIdValue(payload.credentialId);
  if (!payload.credentialHash || !payload.credentialType || !payload.metadata) {
    throw serviceError("credentialHash, credentialType, and metadata are required.");
  }

  const credentialClient = await client(
    env.credentialRegistryId,
    payload.issuerAddress,
    "credential-registry"
  );
  const transaction = await credentialClient.issue_credential({
    credential_id: credentialId,
    issuer: payload.issuerAddress,
    recipient: payload.recipientAddress,
    credential_hash: payload.credentialHash,
    credential_type: payload.credentialType,
    metadata_uri: payload.metadata,
  });

  return {
    transactionXdr: transaction.toXDR(),
    credentialId: credentialId.toString(),
    contractId: env.credentialRegistryId,
    network: "TESTNET",
  };
}

async function getCredential(credentialId, sourceAddress) {
  try {
    const credentialClient = await client(env.credentialRegistryId, sourceAddress, "credential-registry");
    const transaction = await credentialClient.get_credential({ credential_id: credentialIdValue(credentialId) });
    const { result } = await transaction.simulate();
    return serializeValue(result);
  } catch (error) {
    captureError(error, { category: "stellar_rpc_failure", operation: "get_credential" });
    throw error;
  }
}

async function getCredentialValidity(credentialId, sourceAddress) {
  try {
    const credentialClient = await client(env.credentialRegistryId, sourceAddress, "credential-registry");
    const transaction = await credentialClient.is_valid({ credential_id: credentialIdValue(credentialId) });
    const { result } = await transaction.simulate();
    return Boolean(result);
  } catch (error) {
    captureError(error, { category: "stellar_rpc_failure", operation: "get_credential_validity" });
    throw error;
  }
}

async function prepareVerification(payload) {
  requireAddress(payload.requesterAddress, "requesterAddress");
  const credentialId = credentialIdValue(payload.credentialId);
  const isValid = await getCredentialValidity(credentialId, payload.requesterAddress);
  const verificationClient = await client(
    env.verificationContractId,
    payload.requesterAddress,
    "verification"
  );
  const transaction = await verificationClient.record_verification({
    credential_id: credentialId,
    verifier: payload.requesterAddress,
    is_valid: isValid,
  });

  return {
    transactionXdr: transaction.toXDR(),
    credentialId: credentialId.toString(),
    isValid,
    contractId: env.verificationContractId,
    network: "TESTNET",
  };
}

async function getVerification(credentialId, sourceAddress) {
  try {
    const verificationClient = await client(env.verificationContractId, sourceAddress, "verification");
    const transaction = await verificationClient.get_verification({ credential_id: credentialIdValue(credentialId) });
    const { result } = await transaction.simulate();
    return serializeValue(result);
  } catch (error) {
    captureError(error, { category: "stellar_rpc_failure", operation: "get_verification" });
    throw error;
  }
}

async function submitTransaction(signedTransactionXdr) {
  try {
    if (!signedTransactionXdr) {
      throw serviceError("signedTransactionXdr is required.");
    }

  let transaction;
  try {
    transaction = TransactionBuilder.fromXDR(
      signedTransactionXdr,
      env.stellarNetworkPassphrase
    );
  } catch (_error) {
    throw serviceError("The signed transaction XDR is invalid.", 400, "INVALID_TRANSACTION_XDR");
  }

  const submitted = await server().sendTransaction(transaction);
  if (submitted.status !== "PENDING") {
    throw serviceError(
      `Stellar rejected the transaction with status ${submitted.status}.`,
      502,
      "STELLAR_SUBMISSION_FAILED"
    );
  }

  const confirmed = await server().pollTransaction(submitted.hash);
  if (confirmed.status !== "SUCCESS") {
    throw serviceError(
      `Stellar transaction ${submitted.hash} ended with status ${confirmed.status}.`,
      502,
      "STELLAR_CONFIRMATION_FAILED"
    );
  }

    return {
      txHash: submitted.hash,
      status: confirmed.status,
      ledger: confirmed.ledger,
      network: "TESTNET",
    };
  } catch (error) {
    captureError(error, { category: "stellar_rpc_failure", operation: "submit_transaction" });
    throw error;
  }
}

async function issueCredential(payload) {
  return submitTransaction(payload.signedTransactionXdr);
}

async function verifyCredential(payload) {
  return submitTransaction(payload.signedTransactionXdr);
}

async function getReputationScore(userAddress, sourceAddress = userAddress) {
  try {
    requireAddress(userAddress, "userAddress");
    const reputationClient = await client(env.reputationContractId, sourceAddress, "reputation");
    const transaction = await reputationClient.get_score({ user: userAddress });
    const { result } = await transaction.simulate();
    return { userAddress, totalScore: Number(result || 0) };
  } catch (error) {
    captureError(error, { category: "stellar_rpc_failure", operation: "get_reputation" });
    throw error;
  }
}

async function registerInstitution(_payload) {
  throw serviceError("Institution registration transaction flow is not implemented yet.", 501);
}

module.exports = {
  server,
  getCredential,
  getCredentialValidity,
  getReputationScore,
  getVerification,
  issueCredential,
  prepareCredentialIssuance,
  prepareVerification,
  registerInstitution,
  submitTransaction,
  verifyCredential,
};
