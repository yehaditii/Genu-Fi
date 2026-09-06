const express = require("express");
const Credential = require("../models/Credential");
const {
  getCredential,
  getVerification,
  issueCredential,
  prepareCredentialIssuance,
} = require("../services/stellarService");


const router = express.Router();

async function persistCredential(payload, tx) {
  return Credential.create({
    credentialId: String(payload.credentialId),
    issuerAddress: payload.issuerAddress,
    recipientAddress: payload.recipientAddress,
    credentialHash: payload.credentialHash,
    credentialType: payload.credentialType,
    transactionHash: tx.txHash,
    metadata: payload.metadata,
  });
}

router.post("/prepare", async (req, res, next) => {
  try {
    const prepared = await prepareCredentialIssuance(req.body);
    res.status(200).json({ success: true, transaction: prepared });
  } catch (error) {
    next(error);
  }
});

router.post("/submit", async (req, res, next) => {
  try {
    const tx = await issueCredential(req.body);
    const credential = await persistCredential(req.body, tx);
    res.status(201).json({ success: true, credential, tx });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const tx = await issueCredential(req.body);
    const credential = await persistCredential(req.body, tx);

    res.status(201).json({ success: true, credential, tx });
  } catch (error) {
    next(error);
  }
});

router.get("/recipient/:address", async (req, res, next) => {
  try {
    const mirrors = await Credential.find({ recipientAddress: req.params.address }).sort({
      issuedAt: -1,
    });
    const credentials = await Promise.all(
      mirrors.map(async (mirror) => {
        const onChain = await getCredential(mirror.credentialId, req.params.address);
        if (!onChain || onChain.recipient !== req.params.address) return null;
        const verification = await getVerification(mirror.credentialId, req.params.address);
        return {
          ...onChain,
          id: String(onChain.credential_id),
          credentialId: String(onChain.credential_id),
          issuer: onChain.issuer,
          issuerAddress: onChain.issuer,
          recipient: onChain.recipient,
          recipientAddress: onChain.recipient,
          credentialHash: onChain.credential_hash,
          credentialType: onChain.credential_type,
          metadata: onChain.metadata_uri,
          issuedAt: onChain.issued_at,
          status: onChain.revoked ? "revoked" : "active",
          verificationStatus:
            verification?.is_valid === true
              ? "valid"
              : verification?.is_valid === false
                ? "invalid"
                : "not_verified",
          transactionHash: mirror.transactionHash,
        };
      })
    );
    res.json(credentials.filter(Boolean));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const sourceAddress = req.query.sourceAddress;
    const credential = await getCredential(req.params.id, sourceAddress);
    if (!credential) {
      return res.status(404).json({ success: false, error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential not found on Stellar." } });
    }
    res.json({
      id: String(credential.credential_id),
      credentialId: String(credential.credential_id),
      issuer: credential.issuer,
      issuerAddress: credential.issuer,
      recipient: credential.recipient,
      recipientAddress: credential.recipient,
      credentialHash: credential.credential_hash,
      credentialType: credential.credential_type,
      metadata: credential.metadata_uri,
      issuedAt: credential.issued_at,
      status: credential.revoked ? "revoked" : "active",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
