const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  credentialId: { type: String, required: true, unique: true },
  issuerAddress: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  credentialHash: { type: String, required: true },
  credentialType: { type: String, required: true },
  transactionHash: { type: String, default: "" },
  issuedAt: { type: Date, default: Date.now },
  isRevoked: { type: Boolean, default: false },
  metadata: { type: String, default: "" },
});

module.exports = mongoose.model("Credential", credentialSchema);
