const express = require("express");
const { getRecentEvents } = require("../services/eventService");

const router = express.Router();

router.get("/recent", (_req, res) => {
  res.json(getRecentEvents());
});

router.get("/feed", (_req, res) => {
  res.json(getRecentEvents());
});

module.exports = router;
