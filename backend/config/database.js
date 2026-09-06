const mongoose = require("mongoose");
const { env } = require("./env");
const { captureError } = require("../services/monitoring");

async function connectDatabase() {
  const mongoUri = env.mongodbUri;
  if (!mongoUri) {
    return;
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    captureError(error, { category: "database_failure", operation: "connect" });
    throw error;
  }
}

module.exports = { connectDatabase };
