const express = require("express");
const Institution = require("../models/Institution");
const { registerInstitution } = require("../services/stellarService");

function notImplementedResponse(message) {
  return { implemented: false, message };
}


const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const tx = await registerInstitution(req.body);
    const institution = await Institution.create({
      stellarAddress: req.body.stellarAddress,
      name: req.body.name,
      type: req.body.type,
      contractId: tx.contractId,
    });

    res.status(201).json({ success: true, institution, tx });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const institutions = await Institution.find().sort({ registeredAt: -1 });
    res.json(institutions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);
    res.json(institution);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/verify", async (req, res, next) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json({ success: true, institution });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
