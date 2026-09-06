const express = require("express");
const VerificationRequest = require("../models/VerificationRequest");
const {
  getCredential,
  getVerification,
  prepareVerification,
  verifyCredential,
} = require("../services/stellarService");


const router = express.Router();

router.post("/prepare", async (req, res, next) => {
  try {
    const transaction = await prepareVerification(req.body);
    res.json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
});

router.get("/check/:credentialId", async (req, res, next) => {
  try {
    const sourceAddress = req.query.sourceAddress;
    const credential = await getCredential(req.params.credentialId, sourceAddress);
    if (!credential) {
      return res.status(404).json({ success: false, error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential not found on Stellar." } });
    }
    const verification = await getVerification(req.params.credentialId, sourceAddress);
    res.json({
      credential,
      verification,
      isValid: !credential.revoked,
      source: "stellar",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/submit", async (req, res, next) => {
  try {
    const result = await verifyCredential(req.body);
    const verificationState = await getVerification(
      req.body.credentialId,
      req.body.requesterAddress
    );
    const verification = await VerificationRequest.create({
      credentialId: String(req.body.credentialId),
      requesterAddress: req.body.requesterAddress,
      isValid: Boolean(verificationState?.is_valid),
      transactionHash: result.txHash,
    });
    res.status(201).json({ success: true, verification, result, source: "stellar" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const credential = await getCredential(
      req.body.credentialId,
      req.body.requesterAddress
    );
    if (!credential) {
      return res.status(404).json({ success: false, error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential not found on Stellar." } });
    }
    const verification = await getVerification(
      req.body.credentialId,
      req.body.requesterAddress
    );
    res.json({
      success: true,
      result: {
        isValid: !credential.revoked,
        verification,
        source: "stellar",
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/history/:credentialId", async (req, res, next) => {
  try {
    const history = await VerificationRequest.find({ credentialId: req.params.credentialId }).sort({
      verifiedAt: -1,
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
});

router.get("/requester/:address", async (req, res, next) => {
  try {
    const history = await VerificationRequest.find({
      requesterAddress: req.params.address,
    }).sort({ verifiedAt: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
