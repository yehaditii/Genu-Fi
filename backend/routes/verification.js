const express = require("express");
const VerificationRequest = require("../models/VerificationRequest");
const { verifyCredential } = require("../services/stellarService");

const router = express.Router();

router.post("/verify", async (req, res, next) => {
  try {
    const result = await verifyCredential(req.body.credentialId);
    const verification = await VerificationRequest.create({
      credentialId: req.body.credentialId,
      requesterAddress: req.body.requesterAddress,
      isValid: result.isValid,
      transactionHash: `verify-${Date.now()}`,
    });

    res.status(201).json({ success: true, verification, result });
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
