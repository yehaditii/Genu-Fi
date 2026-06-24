const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  stellarAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  contractId: { type: String, default: "" },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Institution", institutionSchema);
