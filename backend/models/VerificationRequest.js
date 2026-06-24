const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema({
  credentialId: { type: String, required: true },
  requesterAddress: { type: String, required: true },
  isValid: { type: Boolean, default: false },
  verifiedAt: { type: Date, default: Date.now },
  transactionHash: { type: String, default: "" },
});

module.exports = mongoose.model("VerificationRequest", verificationRequestSchema);
