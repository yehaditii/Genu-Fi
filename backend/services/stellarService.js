const { rpc } = require("@stellar/stellar-sdk");

const server = () => new rpc.Server(process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org");

function notImplemented() {
  return { notImplemented: true };
}

async function issueCredential(_payload) {
  return notImplemented();
}

async function verifyCredential(_credentialId) {
  return notImplemented();
}

async function getReputationScore(_userAddress) {
  return notImplemented();
}

async function registerInstitution(_payload) {
  return notImplemented();
}


module.exports = {
  server,
  issueCredential,
  verifyCredential,
  getReputationScore,
  registerInstitution,
};
