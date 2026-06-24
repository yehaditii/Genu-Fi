const express = require("express");
const Reputation = require("../models/Reputation");
const { getReputationScore } = require("../services/stellarService");

const router = express.Router();

router.get("/:address", async (req, res, next) => {
  try {
    const stored = await Reputation.findOne({ userAddress: req.params.address });
    if (stored) {
      return res.json(stored);
    }

    const score = await getReputationScore(req.params.address);
    res.json(score);
  } catch (error) {
    next(error);
  }
});

router.get("/:address/breakdown", async (req, res, next) => {
  try {
    const score = await getReputationScore(req.params.address);
    res.json(score);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
