const express = require("express");
const Credential = require("../models/Credential");
const { issueCredential } = require("../services/stellarService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const tx = await issueCredential(req.body);
    const credential = await Credential.create({
      credentialId: req.body.credentialId || `cred-${Date.now()}`,
      issuerAddress: req.body.issuerAddress,
      recipientAddress: req.body.recipientAddress,
      credentialHash: req.body.credentialHash || `hash-${Date.now()}`,
      credentialType: req.body.credentialType,
      transactionHash: tx.txHash,
      metadata: req.body.metadata || "",
    });

    res.status(201).json({ success: true, credential, tx });
  } catch (error) {
    next(error);
  }
});

router.get("/recipient/:address", async (req, res, next) => {
  try {
    const credentials = await Credential.find({ recipientAddress: req.params.address }).sort({
      issuedAt: -1,
    });
    res.json(credentials);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const credential = await Credential.findOne({ credentialId: req.params.id });
    res.json(credential);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
