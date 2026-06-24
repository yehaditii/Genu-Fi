const mongoose = require("mongoose");

const reputationSchema = new mongoose.Schema({
  userAddress: { type: String, required: true, unique: true },
  totalScore: { type: Number, default: 0 },
  hackathonCount: { type: Number, default: 0 },
  internshipCount: { type: Number, default: 0 },
  courseCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reputation", reputationSchema);
